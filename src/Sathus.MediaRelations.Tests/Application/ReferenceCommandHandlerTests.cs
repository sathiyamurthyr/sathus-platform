using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Application.Commands.RemoveReference;
using Sathus.MediaRelations.Application.Commands.RestoreReference;
using Sathus.MediaRelations.Application.Commands.UpdateReference;
using Sathus.MediaRelations.Application.Commands.ValidateReference;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Tests.Application;

public class ReferenceCommandHandlerTests
{
    private static CreateReferenceCommandHandler CreateHandler(EngineFixture f) =>
        new(f.References, f.Usages, f.Statistics, f.Relations, f.History, f.GraphCache);

    [Fact]
    public async Task Create_PersistsReferenceUsageStatisticsAndRelation()
    {
        using var f = new EngineFixture();
        var handler = CreateHandler(f);
        var assetId = Guid.NewGuid();

        var result = await handler.Handle(new CreateReferenceCommand(
            assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue), CancellationToken.None);

        result.AssetId.Should().Be(assetId);
        (await f.References.CountActiveByAssetAsync(assetId)).Should().Be(1);

        var stats = await f.Statistics.GetByAssetIdAsync(assetId);
        stats!.ReferenceCount.Should().Be(1);
        stats.UsageCount.Should().Be(1);

        var usages = await f.Usages.GetByAssetIdAsync(assetId);
        usages.Should().ContainSingle();

        var relations = await f.Relations.GetBySourceNodeAsync(MediaRelation.AssetNode(assetId));
        relations.Should().ContainSingle(r => r.TargetNodeKey == "page:home");

        var history = await f.History.GetByAssetIdAsync(assetId);
        history.Should().Contain(h => h.Action == ReferenceHistoryAction.Created);
    }

    [Fact]
    public async Task Create_Duplicate_Throws()
    {
        using var f = new EngineFixture();
        var handler = CreateHandler(f);
        var assetId = Guid.NewGuid();
        var cmd = new CreateReferenceCommand(assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue);

        await handler.Handle(cmd, CancellationToken.None);

        Func<Task> act = () => handler.Handle(cmd, CancellationToken.None);
        await act.Should().ThrowAsync<DuplicateReferenceException>();
    }

    [Fact]
    public async Task Create_AfterRemoval_ReactivatesInsteadOfDuplicate()
    {
        using var f = new EngineFixture();
        var createHandler = CreateHandler(f);
        var assetId = Guid.NewGuid();
        var cmd = new CreateReferenceCommand(assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue);

        var created = await createHandler.Handle(cmd, CancellationToken.None);

        var removeHandler = new RemoveReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.History, f.GraphCache);
        await removeHandler.Handle(new RemoveReferenceCommand(created.Id), CancellationToken.None);

        var recreated = await createHandler.Handle(cmd, CancellationToken.None);

        recreated.Status.Should().Be(nameof(ReferenceStatus.Active));
        (await f.References.CountActiveByAssetAsync(assetId)).Should().Be(1);
    }

    [Fact]
    public async Task Remove_DecrementsStatisticsAndUsage()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        var created = await CreateHandler(f).Handle(
            new CreateReferenceCommand(assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
            CancellationToken.None);

        var removeHandler = new RemoveReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.History, f.GraphCache);
        await removeHandler.Handle(new RemoveReferenceCommand(created.Id), CancellationToken.None);

        (await f.References.CountActiveByAssetAsync(assetId)).Should().Be(0);
        var stats = await f.Statistics.GetByAssetIdAsync(assetId);
        stats!.ReferenceCount.Should().Be(0);
        stats.IsUnused.Should().BeTrue();
    }

    [Fact]
    public async Task Remove_MissingReference_Throws()
    {
        using var f = new EngineFixture();
        var removeHandler = new RemoveReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.History, f.GraphCache);
        Func<Task> act = () => removeHandler.Handle(new RemoveReferenceCommand(Guid.NewGuid()), CancellationToken.None);
        await act.Should().ThrowAsync<MediaReferenceNotFoundException>();
    }

    [Fact]
    public async Task Update_ChangesScopeAndPlacement()
    {
        using var f = new EngineFixture();
        var created = await CreateHandler(f).Handle(
            new CreateReferenceCommand(Guid.NewGuid(), "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
            CancellationToken.None);

        var updateHandler = new UpdateReferenceCommandHandler(f.References, f.History, f.GraphCache);
        var updated = await updateHandler.Handle(
            new UpdateReferenceCommand(created.Id, Title: "New", Scope: ReferenceScope.PublishedValue),
            CancellationToken.None);

        updated.Title.Should().Be("New");
        updated.Scope.Should().Be(ReferenceScope.PublishedValue);
        updated.Version.Should().BeGreaterThan(1);
    }

    [Fact]
    public async Task Restore_ReactivatesRemovedReference()
    {
        using var f = new EngineFixture();
        var created = await CreateHandler(f).Handle(
            new CreateReferenceCommand(Guid.NewGuid(), "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
            CancellationToken.None);
        var removeHandler = new RemoveReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.History, f.GraphCache);
        await removeHandler.Handle(new RemoveReferenceCommand(created.Id), CancellationToken.None);

        var restoreHandler = new RestoreReferenceCommandHandler(f.References, f.Statistics, f.History, f.GraphCache);
        var restored = await restoreHandler.Handle(new RestoreReferenceCommand(created.Id), CancellationToken.None);

        restored.Status.Should().Be(nameof(ReferenceStatus.Active));
        var stats = await f.Statistics.GetByAssetIdAsync(created.AssetId);
        stats!.ReferenceCount.Should().Be(1);
    }

    [Fact]
    public async Task Validate_MarksBrokenWhenAssetMissing_ThenRestoresWhenPresent()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        await CreateHandler(f).Handle(
            new CreateReferenceCommand(assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
            CancellationToken.None);

        var validateHandler = new ValidateAssetReferencesCommandHandler(f.References, f.History, f.AssetChecker, f.GraphCache);

        // Asset missing -> broken.
        var brokenResult = await validateHandler.Handle(new ValidateAssetReferencesCommand(assetId), CancellationToken.None);
        brokenResult.AssetExists.Should().BeFalse();
        brokenResult.BrokenReferences.Should().Be(1);

        // Asset reappears -> restored.
        f.AssetChecker.Add(assetId);
        var restoredResult = await validateHandler.Handle(new ValidateAssetReferencesCommand(assetId), CancellationToken.None);
        restoredResult.AssetExists.Should().BeTrue();
        restoredResult.RestoredReferences.Should().Be(1);
    }
}
