namespace Sathus.MediaRelations.Tests.Domain;

public class ValueObjectTests
{
    [Theory]
    [InlineData("page")]
    [InlineData("Product")]
    [InlineData("  BLOG  ")]
    public void ReferenceType_Create_NormalizesKnownValues(string input)
    {
        var type = ReferenceType.Create(input);
        type.Value.Should().Be(input.Trim().ToLowerInvariant());
    }

    [Fact]
    public void ReferenceType_WellKnown_AreFlagged()
    {
        ReferenceType.Page.IsWellKnown.Should().BeTrue();
        ReferenceType.Create("custom-module").IsWellKnown.Should().BeFalse();
        ReferenceType.Supported.Should().HaveCount(10);
    }

    [Fact]
    public void ReferenceType_Create_Empty_Throws()
    {
        Action act = () => ReferenceType.Create("  ");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ReferenceType_Equality_ByValue()
    {
        ReferenceType.Create("page").Should().Be(ReferenceType.Page);
    }

    [Theory]
    [InlineData("featured-image")]
    [InlineData("Gallery")]
    [InlineData("logo")]
    public void UsageType_Create_Works(string input)
    {
        UsageType.Create(input).Value.Should().Be(input.ToLowerInvariant());
    }

    [Fact]
    public void UsageType_Supported_HasTwelveTypes()
    {
        UsageType.Supported.Should().HaveCount(12);
    }

    [Fact]
    public void UsageType_Create_Empty_Throws()
    {
        Action act = () => UsageType.Create("");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ReferenceId_Create_Trims()
    {
        ReferenceId.Create("  abc ").Value.Should().Be("abc");
    }

    [Fact]
    public void ReferenceId_Create_TooLong_Throws()
    {
        Action act = () => ReferenceId.Create(new string('a', ReferenceId.MaxLength + 1));
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ReferencePath_Empty_ReturnsRoot()
    {
        ReferencePath.Create(null).IsRoot.Should().BeTrue();
        ReferencePath.Create("   ").Value.Should().Be("$");
    }

    [Theory]
    [InlineData("$", 0)]
    [InlineData("body", 1)]
    [InlineData("body.blocks[2].image", 3)]
    public void ReferencePath_Depth_IsComputed(string path, int depth)
    {
        ReferencePath.Create(path).Depth.Should().Be(depth);
    }

    [Fact]
    public void ReferencePath_TooLong_Throws()
    {
        Action act = () => ReferencePath.Create(new string('a', ReferencePath.MaxLength + 1));
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void DependencyLevel_DirectAndTransitive()
    {
        DependencyLevel.Direct.IsDirect.Should().BeTrue();
        DependencyLevel.Direct.Next().IsTransitive.Should().BeTrue();
        DependencyLevel.Create(3).Value.Should().Be(3);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(DependencyLevel.MaxValue + 1)]
    public void DependencyLevel_OutOfRange_Throws(int value)
    {
        Action act = () => DependencyLevel.Create(value);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void ReferenceVersion_NextIncrements()
    {
        ReferenceVersion.Initial.Value.Should().Be(1);
        ReferenceVersion.Initial.Next().Value.Should().Be(2);
    }

    [Fact]
    public void ReferenceVersion_BelowOne_Throws()
    {
        Action act = () => ReferenceVersion.Create(0);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Theory]
    [InlineData("published", true)]
    [InlineData("scheduled", true)]
    [InlineData("draft", false)]
    [InlineData("archived", false)]
    public void ReferenceScope_IsActive_Reflects(string scope, bool active)
    {
        ReferenceScope.Create(scope).IsActive.Should().Be(active);
    }

    [Fact]
    public void ReferenceScope_Custom_IsAllowed()
    {
        ReferenceScope.Create("preview").Value.Should().Be("preview");
    }
}
