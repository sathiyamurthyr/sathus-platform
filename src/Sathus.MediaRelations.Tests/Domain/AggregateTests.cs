using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Tests.Domain;

public class MediaUsageTests
{
    [Fact]
    public void RecordReference_IncrementsAndTracksUsageTypes()
    {
        var usage = new MediaUsage(Guid.NewGuid(), "web", ReferenceType.Page, ReferenceId.Create("home"));

        usage.RecordReference(UsageType.FeaturedImage);
        usage.RecordReference(UsageType.Gallery);
        usage.RecordReference(UsageType.Gallery);

        usage.ActiveReferenceCount.Should().Be(3);
        usage.GetUsageTypes().Should().BeEquivalentTo(new[] { "featured-image", "gallery" });
        usage.IsActive.Should().BeTrue();
    }

    [Fact]
    public void RemoveReference_DecrementsWithoutGoingNegative()
    {
        var usage = new MediaUsage(Guid.NewGuid(), "web", ReferenceType.Page, ReferenceId.Create("home"));
        usage.RecordReference(UsageType.FeaturedImage);

        usage.RemoveReference();
        usage.RemoveReference();

        usage.ActiveReferenceCount.Should().Be(0);
        usage.IsActive.Should().BeFalse();
    }

    [Fact]
    public void Key_IsDeterministic()
    {
        var assetId = Guid.NewGuid();
        var a = new MediaUsage(assetId, "web", ReferenceType.Page, ReferenceId.Create("home"));
        var b = new MediaUsage(assetId, "WEB", ReferenceType.Page, ReferenceId.Create("home"));
        a.Key.Should().Be(b.Key);
    }
}

public class MediaRelationTests
{
    [Fact]
    public void Create_BuildsEdge()
    {
        var relation = new MediaRelation(
            MediaRelation.AssetNode(Guid.NewGuid()), GraphNodeType.Asset,
            MediaRelation.ContentNode("page", "home"), GraphNodeType.Content,
            "featured-image");

        relation.SourceNodeKey.Should().StartWith("asset:");
        relation.TargetNodeKey.Should().Be("page:home");
        relation.Relationship.Should().Be("featured-image");
    }

    [Fact]
    public void Create_SelfReference_Throws()
    {
        Action act = () => new MediaRelation("n1", GraphNodeType.Content, "n1", GraphNodeType.Content, "x");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_EmptyRelationship_DefaultsToReferences()
    {
        var relation = new MediaRelation("a", GraphNodeType.Asset, "b", GraphNodeType.Content, "  ");
        relation.Relationship.Should().Be("references");
    }
}

public class MediaDependencyTests
{
    [Fact]
    public void Create_Direct()
    {
        var dep = new MediaDependency(Guid.NewGuid(), "page:home", GraphNodeType.Content, DependencyLevel.Direct, "path");
        dep.Level.IsDirect.Should().BeTrue();
        dep.IsCircular.Should().BeFalse();
    }

    [Fact]
    public void MarkCircular_SetsFlag()
    {
        var dep = new MediaDependency(Guid.NewGuid(), "page:home", GraphNodeType.Content, DependencyLevel.Create(2), "path");
        dep.MarkCircular();
        dep.IsCircular.Should().BeTrue();
    }

    [Fact]
    public void Create_EmptyAsset_Throws()
    {
        Action act = () => new MediaDependency(Guid.Empty, "x", GraphNodeType.Content, DependencyLevel.Direct, "p");
        act.Should().Throw<ArgumentException>();
    }
}

public class MediaUsageStatisticsTests
{
    [Fact]
    public void RecordReferenceAdded_IncrementsUsageAndClearsUnused()
    {
        var stats = new MediaUsageStatistics(Guid.NewGuid());
        stats.RecordReferenceAdded();

        stats.UsageCount.Should().Be(1);
        stats.ReferenceCount.Should().Be(1);
        stats.UnusedSince.Should().BeNull();
        stats.LastUsedAt.Should().NotBeNull();
        stats.IsUnused.Should().BeFalse();
    }

    [Fact]
    public void RecordReferenceRemoved_MarksUnusedWhenZero()
    {
        var stats = new MediaUsageStatistics(Guid.NewGuid());
        stats.RecordReferenceAdded();
        stats.RecordReferenceRemoved();

        stats.ReferenceCount.Should().Be(0);
        stats.UnusedSince.Should().NotBeNull();
        stats.IsUnused.Should().BeTrue();
    }

    [Fact]
    public void RecordViewAndDownload_Accumulate()
    {
        var stats = new MediaUsageStatistics(Guid.NewGuid());
        stats.RecordView(5);
        stats.RecordDownload(3);
        stats.RecordView(0); // ignored

        stats.ViewCount.Should().Be(5);
        stats.DownloadCount.Should().Be(3);
    }

    [Fact]
    public void SyncReferenceCount_Reconciles()
    {
        var stats = new MediaUsageStatistics(Guid.NewGuid());
        stats.SyncReferenceCount(4);
        stats.ReferenceCount.Should().Be(4);
        stats.UnusedSince.Should().BeNull();

        stats.SyncReferenceCount(0);
        stats.ReferenceCount.Should().Be(0);
        stats.UnusedSince.Should().NotBeNull();
    }

    [Fact]
    public void SyncReferenceCount_Negative_Throws()
    {
        var stats = new MediaUsageStatistics(Guid.NewGuid());
        Action act = () => stats.SyncReferenceCount(-1);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }
}

public class MediaReferenceSnapshotTests
{
    [Fact]
    public void Snapshot_ComputesHashAndMatches()
    {
        var snapshot = new MediaReferenceSnapshot(Guid.NewGuid(), 2, "payload-data", "backup");
        snapshot.ContentHash.Should().NotBeNullOrEmpty();
        snapshot.Matches("payload-data").Should().BeTrue();
        snapshot.Matches("other").Should().BeFalse();
    }
}
