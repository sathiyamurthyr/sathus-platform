using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Tests.Domain;

public class MediaReferenceTests
{
    [Fact]
    public void Create_RaisesAssetReferencedEvent_AndInitialState()
    {
        var reference = TestHelpers.NewReference();

        reference.Status.Should().Be(ReferenceStatus.Active);
        reference.Version.Value.Should().Be(1);
        reference.IsActive.Should().BeTrue();
        reference.DomainEvents.Should().ContainSingle(e => e is AssetReferencedEvent);
    }

    [Fact]
    public void Create_EmptyAsset_Throws()
    {
        Action act = () => new MediaReference(
            Guid.Empty, "web", ReferenceType.Page, ReferenceId.Create("x"), UsageType.Logo);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_EmptyModule_Throws()
    {
        Action act = () => new MediaReference(
            Guid.NewGuid(), "  ", ReferenceType.Page, ReferenceId.Create("x"), UsageType.Logo);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void DeduplicationKey_IsStableAndDistinct()
    {
        var assetId = Guid.NewGuid();
        var a = TestHelpers.NewReference(assetId, usageType: UsageType.LogoValue);
        var b = TestHelpers.NewReference(assetId, usageType: UsageType.LogoValue);
        var c = TestHelpers.NewReference(assetId, usageType: UsageType.GalleryValue);

        a.DeduplicationKey.Should().Be(b.DeduplicationKey);
        a.DeduplicationKey.Should().NotBe(c.DeduplicationKey);
    }

    [Fact]
    public void MarkBroken_SetsBrokenAndRaisesEvent()
    {
        var reference = TestHelpers.NewReference();
        reference.ClearDomainEvents();

        reference.MarkBroken("missing");

        reference.Status.Should().Be(ReferenceStatus.Broken);
        reference.BrokenReason.Should().Be("missing");
        reference.LastValidatedAt.Should().NotBeNull();
        reference.DomainEvents.Should().ContainSingle(e => e is ReferenceBrokenEvent);
    }

    [Fact]
    public void MarkValid_FromBroken_RestoresAndRaisesRestoredEvent()
    {
        var reference = TestHelpers.NewReference();
        reference.MarkBroken("missing");
        reference.ClearDomainEvents();

        reference.MarkValid();

        reference.Status.Should().Be(ReferenceStatus.Active);
        reference.BrokenReason.Should().BeNull();
        reference.DomainEvents.Should().ContainSingle(e => e is ReferenceRestoredEvent);
    }

    [Fact]
    public void Remove_MarksRemovedSoftDeletedAndRaisesUnreferenced()
    {
        var reference = TestHelpers.NewReference();
        reference.ClearDomainEvents();

        reference.Remove();

        reference.Status.Should().Be(ReferenceStatus.Removed);
        reference.IsDeleted.Should().BeTrue();
        reference.DomainEvents.Should().ContainSingle(e => e is AssetUnreferencedEvent);
    }

    [Fact]
    public void Restore_FromRemoved_BumpsVersionAndReactivates()
    {
        var reference = TestHelpers.NewReference();
        reference.Remove();
        reference.ClearDomainEvents();

        reference.Restore();

        reference.Status.Should().Be(ReferenceStatus.Active);
        reference.IsDeleted.Should().BeFalse();
        reference.Version.Value.Should().Be(2);
        reference.DomainEvents.Should().ContainSingle(e => e is ReferenceRestoredEvent);
    }

    [Fact]
    public void Retarget_ChangesAssetAndBumpsVersion()
    {
        var reference = TestHelpers.NewReference();
        var newAsset = Guid.NewGuid();

        reference.Retarget(newAsset);

        reference.AssetId.Should().Be(newAsset);
        reference.Version.Value.Should().Be(2);
    }

    [Fact]
    public void Retarget_WhenRemoved_Throws()
    {
        var reference = TestHelpers.NewReference();
        reference.Remove();

        Action act = () => reference.Retarget(Guid.NewGuid());
        act.Should().Throw<InvalidReferenceStateException>();
    }

    [Fact]
    public void ChangeScope_ToScheduled_KeepsScheduledDate()
    {
        var reference = TestHelpers.NewReference();
        var when = DateTime.UtcNow.AddDays(2);

        reference.ChangeScope(ReferenceScope.Scheduled, when);

        reference.Scope.Should().Be(ReferenceScope.Scheduled);
        reference.ScheduledFor.Should().Be(when);
        reference.IsScheduledInFuture.Should().BeTrue();
    }

    [Fact]
    public void IsBlockingDeletion_TrueForPublished()
    {
        var reference = TestHelpers.NewReference(scope: ReferenceScope.PublishedValue);
        reference.IsBlockingDeletion.Should().BeTrue();
    }

    [Fact]
    public void IsBlockingDeletion_FalseForDraft()
    {
        var reference = TestHelpers.NewReference(scope: ReferenceScope.DraftValue);
        reference.IsBlockingDeletion.Should().BeFalse();
    }

    [Fact]
    public void UpdatePlacement_ChangesFieldsAndVersion()
    {
        var reference = TestHelpers.NewReference();
        reference.UpdatePlacement("new title", "/new", ReferencePath.Create("hero.image"));

        reference.Title.Should().Be("new title");
        reference.Url.Should().Be("/new");
        reference.Path.Value.Should().Be("hero.image");
        reference.Version.Value.Should().Be(2);
    }
}
