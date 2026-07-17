using FluentValidation;
using Sathus.MediaRelations.Application.Behaviors;
using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Application.Commands.UpdateReference;
using Sathus.MediaRelations.Application.Specifications;
using Sathus.MediaRelations.Application.Validators;

namespace Sathus.MediaRelations.Tests.Application;

/// <summary>
/// Coverage for FluentValidation validators, the MediatR validation behavior, the reference
/// specifications and DTO projections that make up the application layer.
/// </summary>
public class ValidatorsBehaviorSpecTests
{
    private static CreateReferenceCommand ValidCreate() => new(
        Guid.NewGuid(), "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue);

    [Fact]
    public async Task CreateValidator_AcceptsWellFormedCommand()
    {
        var result = await new CreateReferenceCommandValidator().ValidateAsync(ValidCreate());
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task CreateValidator_RejectsEmptyAssetModuleAndType()
    {
        var command = new CreateReferenceCommand(Guid.Empty, "", "", "", "");
        var result = await new CreateReferenceCommandValidator().ValidateAsync(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Select(e => e.PropertyName).Should()
            .Contain(new[] { nameof(CreateReferenceCommand.AssetId), nameof(CreateReferenceCommand.Module) });
    }

    [Fact]
    public async Task CreateValidator_RejectsTooLongModule()
    {
        var command = ValidCreate() with { Module = new string('m', 129) };
        var result = await new CreateReferenceCommandValidator().ValidateAsync(command);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public async Task CreateValidator_RejectsInvalidScope()
    {
        var command = ValidCreate() with { Scope = new string('z', ReferenceScope.MaxLength + 1) };
        var result = await new CreateReferenceCommandValidator().ValidateAsync(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateReferenceCommand.Scope));
    }

    [Fact]
    public async Task CreateValidator_RequiresScheduledForWhenScheduled()
    {
        var command = ValidCreate() with { Scope = ReferenceScope.ScheduledValue, ScheduledFor = null };
        var result = await new CreateReferenceCommandValidator().ValidateAsync(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateReferenceCommand.ScheduledFor));

        var ok = command with { ScheduledFor = DateTime.UtcNow.AddDays(1) };
        (await new CreateReferenceCommandValidator().ValidateAsync(ok)).IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateValidator_ValidatesIdsScopeAndPath()
    {
        var invalid = new UpdateReferenceCommand(Guid.Empty, NewAssetId: Guid.Empty, Path: new string('p', ReferencePath.MaxLength + 1), Scope: "??-invalid-" + new string('x', 40));
        var invalidResult = await new UpdateReferenceCommandValidator().ValidateAsync(invalid);
        invalidResult.IsValid.Should().BeFalse();
        invalidResult.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateReferenceCommand.ReferenceId));
        invalidResult.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateReferenceCommand.Scope));

        var valid = new UpdateReferenceCommand(Guid.NewGuid(), NewAssetId: Guid.NewGuid(), Path: "body.image", Scope: ReferenceScope.PublishedValue);
        (await new UpdateReferenceCommandValidator().ValidateAsync(valid)).IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task ValidationBehavior_ThrowsWhenValidatorFails()
    {
        var behavior = new ValidationBehavior<CreateReferenceCommand, MediaReferenceResponse>(
            new[] { new CreateReferenceCommandValidator() });

        var act = async () => await behavior.Handle(
            new CreateReferenceCommand(Guid.Empty, "", "", "", ""),
            () => throw new InvalidOperationException("handler must not run"),
            CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>();
    }

    [Fact]
    public async Task ValidationBehavior_InvokesNextWhenValid()
    {
        var behavior = new ValidationBehavior<CreateReferenceCommand, string>(
            new[] { new CreateReferenceCommandValidator() });

        var next = false;
        var result = await behavior.Handle(ValidCreate(), () =>
        {
            next = true;
            return Task.FromResult("ok");
        }, CancellationToken.None);

        next.Should().BeTrue();
        result.Should().Be("ok");
    }

    [Fact]
    public async Task ValidationBehavior_ShortCircuitsWhenNoValidators()
    {
        var behavior = new ValidationBehavior<CreateReferenceCommand, string>(Array.Empty<IValidator<CreateReferenceCommand>>());
        var result = await behavior.Handle(ValidCreate(), () => Task.FromResult("passthrough"), CancellationToken.None);
        result.Should().Be("passthrough");
    }

    [Fact]
    public async Task ActiveReferencesSpecification_FiltersByAssetAndStatus()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        var active = TestHelpers.NewReference(assetId);
        var removed = TestHelpers.NewReference(assetId, sourceReferenceId: "other");
        removed.Remove(Guid.NewGuid());
        var otherAsset = TestHelpers.NewReference(Guid.NewGuid());
        await f.References.AddAsync(active);
        await f.References.AddAsync(removed);
        await f.References.AddAsync(otherAsset);
        await f.References.SaveChangesAsync();

        var matches = await f.References.GetAsync(new ActiveReferencesForAssetSpecification(assetId));
        matches.Should().ContainSingle().Which.Id.Should().Be(active.Id);
    }

    [Fact]
    public async Task ReferencesFromSourceSpecification_FiltersBySource()
    {
        using var f = new EngineFixture();
        var reference = TestHelpers.NewReference(Guid.NewGuid(), referenceType: ReferenceType.BlogValue, sourceReferenceId: "post-1", path: "body.hero");
        await f.References.AddAsync(reference);
        await f.References.SaveChangesAsync();

        var matches = await f.References.GetAsync(new ReferencesFromSourceSpecification(ReferenceType.BlogValue, "post-1"));
        matches.Should().ContainSingle();

        var none = await f.References.GetAsync(new ReferencesFromSourceSpecification(ReferenceType.BlogValue, "missing"));
        none.Should().BeEmpty();
    }

    [Fact]
    public async Task BrokenReferencesSpecification_PagesBrokenOnly()
    {
        using var f = new EngineFixture();
        var broken = TestHelpers.NewReference(Guid.NewGuid());
        broken.MarkBroken("asset missing");
        var healthy = TestHelpers.NewReference(Guid.NewGuid());
        await f.References.AddAsync(broken);
        await f.References.AddAsync(healthy);
        await f.References.SaveChangesAsync();

        var matches = await f.References.GetAsync(new BrokenReferencesSpecification(0, 10));
        matches.Should().ContainSingle().Which.Id.Should().Be(broken.Id);

        var count = await f.References.CountAsync(new BrokenReferencesSpecification(0, 10));
        count.Should().Be(1);
        (await f.References.AnyAsync(new BrokenReferencesSpecification(0, 10))).Should().BeTrue();
    }

    [Fact]
    public void ReferenceScanReport_AggregatesIssues()
    {
        var issues = new List<ReferenceScanIssue>
        {
            new(ScannerIssueType.BrokenReference, Guid.NewGuid(), Guid.NewGuid(), "broken"),
            new(ScannerIssueType.BrokenReference, Guid.NewGuid(), Guid.NewGuid(), "broken"),
            new(ScannerIssueType.OrphanAsset, Guid.NewGuid(), null, "orphan")
        };
        var report = new ReferenceScanReport(DateTime.UtcNow, DateTime.UtcNow, 10, 5, 1, issues);

        report.TotalIssues.Should().Be(3);
        report.IssueCountsByType[ScannerIssueType.BrokenReference].Should().Be(2);
        report.IssueCountsByType[ScannerIssueType.OrphanAsset].Should().Be(1);
        ReferenceScanOptions.Default.DetectBroken.Should().BeTrue();
    }

    [Fact]
    public void UsageAndGraphResponses_Construct()
    {
        var usage = new AssetUsageResponse(Guid.NewGuid(), 2, 1, 5, 3, 4, DateTime.UtcNow, null, false,
            new List<MediaReferenceResponse>());
        usage.ActiveReferenceCount.Should().Be(2);

        var graph = new UsageGraphResponse(Guid.NewGuid(), "asset:x", 2, false, DateTime.UtcNow,
            new[] { new GraphNodeResponse("asset:x", "asset", 0, "root") },
            new[] { new GraphEdgeResponse("asset:x", "page:home", "featured-image") });
        graph.Nodes.Should().ContainSingle();
        graph.Edges.Should().ContainSingle();

        var dependent = new DependentResponse("page:home", "content", 1, true, false, "asset:x -> page:home");
        dependent.IsDirect.Should().BeTrue();
    }
}
