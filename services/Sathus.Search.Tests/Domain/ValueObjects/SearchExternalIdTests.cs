global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.ValueObjects;

public class SearchExternalIdTests
{
    [Fact]
    public void Create_Should_Set_Value()
    {
        var id = SearchExternalId.Create("ext-123");

        id.Value.Should().Be("ext-123");
    }

    [Fact]
    public void Create_Should_Throw_When_Value_Is_NullOrWhiteSpace()
    {
        var act = () => SearchExternalId.Create("  ");

        act.Should().Throw<ArgumentException>().WithMessage("*ExternalId is required*");
    }

    [Fact]
    public void Implicit_Conversion_To_String_Should_Work()
    {
        SearchExternalId id = SearchExternalId.Create("ext-123");

        string value = id;

        value.Should().Be("ext-123");
    }
}
