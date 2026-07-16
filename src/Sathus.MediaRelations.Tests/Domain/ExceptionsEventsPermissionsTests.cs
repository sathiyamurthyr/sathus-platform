namespace Sathus.MediaRelations.Tests.Domain;

/// <summary>
/// Coverage for the domain exception hierarchy, permission constants, domain events and
/// value-object edge cases that are not exercised by the aggregate behaviour tests.
/// </summary>
public class ExceptionsEventsPermissionsTests
{
    [Fact]
    public void MediaReferenceNotFound_CarriesId()
    {
        var id = Guid.NewGuid();
        var ex = new MediaReferenceNotFoundException(id);
        ex.ReferenceId.Should().Be(id);
        ex.Message.Should().Contain(id.ToString());
    }

    [Fact]
    public void MediaUsageStatisticsNotFound_CarriesAssetId()
    {
        var id = Guid.NewGuid();
        var ex = new MediaUsageStatisticsNotFoundException(id);
        ex.AssetId.Should().Be(id);
        ex.Message.Should().Contain(id.ToString());
    }

    [Fact]
    public void InvalidReferenceState_CarriesMessage()
    {
        var ex = new InvalidReferenceStateException("bad state");
        ex.Message.Should().Be("bad state");
    }

    [Fact]
    public void DuplicateReference_ComposesMessage()
    {
        var assetId = Guid.NewGuid();
        var ex = new DuplicateReferenceException(assetId, "page", "home", "featured-image", "$");
        ex.Message.Should().Contain(assetId.ToString());
        ex.Message.Should().Contain("featured-image");
    }

    [Fact]
    public void AssetDeletionBlocked_ExposesReasons()
    {
        var assetId = Guid.NewGuid();
        var reasons = new[] { "1 published reference", "2 active references" };
        var ex = new AssetDeletionBlockedException(assetId, reasons);
        ex.AssetId.Should().Be(assetId);
        ex.Reasons.Should().BeEquivalentTo(reasons);
        ex.Message.Should().Contain("published reference");
    }

    [Fact]
    public void CircularDependency_CarriesMessage()
    {
        var ex = new CircularDependencyException("cycle detected");
        ex.Message.Should().Be("cycle detected");
    }

    [Fact]
    public void Permissions_ExposeAllConstants()
    {
        MediaRelationPermissions.UsageRead.Should().Be("media.usage.read");
        MediaRelationPermissions.UsageManage.Should().Be("media.usage.manage");
        MediaRelationPermissions.ReferenceValidate.Should().Be("media.reference.validate");
        MediaRelationPermissions.All.Should().BeEquivalentTo(new[]
        {
            "media.usage.read",
            "media.usage.manage",
            "media.reference.validate"
        });
    }

    [Fact]
    public void Events_ExposeTheirPayloads()
    {
        var referenceId = Guid.NewGuid();
        var assetId = Guid.NewGuid();

        var referenced = new AssetReferencedEvent(referenceId, assetId, "page", "home", "featured-image");
        referenced.ReferenceId.Should().Be(referenceId);
        referenced.AssetId.Should().Be(assetId);
        referenced.ReferenceType.Should().Be("page");
        referenced.SourceReferenceId.Should().Be("home");
        referenced.UsageType.Should().Be("featured-image");
        referenced.OccurredAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));

        var unreferenced = new AssetUnreferencedEvent(referenceId, assetId);
        unreferenced.ReferenceId.Should().Be(referenceId);
        unreferenced.AssetId.Should().Be(assetId);

        var broken = new ReferenceBrokenEvent(referenceId, assetId, "asset missing");
        broken.Reason.Should().Be("asset missing");
        broken.AssetId.Should().Be(assetId);

        var restored = new ReferenceRestoredEvent(referenceId, assetId);
        restored.ReferenceId.Should().Be(referenceId);
        restored.AssetId.Should().Be(assetId);

        var usageUpdated = new AssetUsageUpdatedEvent(assetId, 3, 42);
        usageUpdated.AssetId.Should().Be(assetId);
        usageUpdated.ReferenceCount.Should().Be(3);
        usageUpdated.UsageCount.Should().Be(42);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void ReferenceType_Create_RejectsBlank(string? value)
    {
        var act = () => ReferenceType.Create(value!);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ReferenceType_FromName_AcceptsFutureModulesButFlagsWellKnown()
    {
        ReferenceType.Create("PAGE").IsWellKnown.Should().BeTrue();
        var future = ReferenceType.Create("future-module");
        future.IsWellKnown.Should().BeFalse();
        future.ToString().Should().Be("future-module");
        ReferenceType.Supported.Should().HaveCount(10);
    }

    [Fact]
    public void ReferenceType_FromName_RejectsTooLong()
    {
        var act = () => ReferenceType.Create(new string('a', ReferenceType.MaxLength + 1));
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void UsageType_RoundTripsAllWellKnownValues()
    {
        foreach (var supported in UsageType.Supported)
        {
            var created = UsageType.Create(supported.Value.ToUpperInvariant());
            created.Value.Should().Be(supported.Value);
            created.IsWellKnown.Should().BeTrue();
        }

        UsageType.Create("custom-usage").IsWellKnown.Should().BeFalse();
        UsageType.Supported.Should().HaveCount(12);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void UsageType_Create_RejectsBlank(string? value)
    {
        var act = () => UsageType.Create(value!);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void UsageType_RejectsTooLong()
    {
        var act = () => UsageType.Create(new string('x', UsageType.MaxLength + 1));
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ReferenceScope_ClassifiesActiveScopes()
    {
        ReferenceScope.Published.IsActive.Should().BeTrue();
        ReferenceScope.Scheduled.IsActive.Should().BeTrue();
        ReferenceScope.Draft.IsActive.Should().BeFalse();
        ReferenceScope.Archived.IsActive.Should().BeFalse();
        ReferenceScope.Create("published").ToString().Should().Be("published");
        ReferenceScope.Create("custom-scope").IsActive.Should().BeFalse();
        ReferenceScope.Supported.Should().HaveCount(4);
    }

    [Fact]
    public void ReferenceScope_RejectsBlankAndTooLong()
    {
        ((Action)(() => ReferenceScope.Create(" "))).Should().Throw<ArgumentException>();
        ((Action)(() => ReferenceScope.Create(new string('s', ReferenceScope.MaxLength + 1)))).Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ReferenceId_TrimsAndValidates()
    {
        ReferenceId.Create("  home  ").Value.Should().Be("home");
        ((Action)(() => ReferenceId.Create(" "))).Should().Throw<ArgumentException>();
        ((Action)(() => ReferenceId.Create(new string('a', ReferenceId.MaxLength + 1)))).Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ReferencePath_ComputesDepthAndRoot()
    {
        ReferencePath.Create(null).IsRoot.Should().BeTrue();
        ReferencePath.Create("   ").Depth.Should().Be(0);
        ReferencePath.Create("body.blocks.image").Depth.Should().Be(3);
        ReferencePath.Root.ToString().Should().Be("$");
        ((Action)(() => ReferencePath.Create(new string('p', ReferencePath.MaxLength + 1)))).Should().Throw<ArgumentException>();
    }

    [Fact]
    public void DependencyLevel_Progression()
    {
        DependencyLevel.Direct.IsDirect.Should().BeTrue();
        DependencyLevel.Direct.Next().IsTransitive.Should().BeTrue();
        DependencyLevel.Create(5).ToString().Should().Be("5");
        ((Action)(() => DependencyLevel.Create(-1))).Should().Throw<ArgumentOutOfRangeException>();
        ((Action)(() => DependencyLevel.Create(DependencyLevel.MaxValue + 1))).Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void ReferenceVersion_Progression()
    {
        ReferenceVersion.Initial.Value.Should().Be(1);
        ReferenceVersion.Initial.Next().Value.Should().Be(2);
        ReferenceVersion.Create(3).ToString().Should().Be("v3");
        ((Action)(() => ReferenceVersion.Create(0))).Should().Throw<ArgumentOutOfRangeException>();
    }
}
