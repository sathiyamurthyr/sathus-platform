global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.ValueObjects;

public class SearchDocumentIdTests
{
    [Fact]
    public void Create_Should_Set_Value()
    {
        var guid = Guid.NewGuid();

        var id = SearchDocumentId.Create(guid);

        id.Value.Should().Be(guid);
    }

    [Fact]
    public void CreateUnique_Should_Generate_NonEmpty_Guid()
    {
        var id = SearchDocumentId.CreateUnique();

        id.Value.Should().NotBe(Guid.Empty);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Value_Is_Empty()
    {
        var act = () => new SearchDocumentId(Guid.Empty);

        act.Should().Throw<ArgumentException>().WithMessage("*ID cannot be empty*");
    }

    [Fact]
    public void ToString_Should_Return_Guid_String()
    {
        var guid = Guid.NewGuid();
        var id = SearchDocumentId.Create(guid);

        id.ToString().Should().Be(guid.ToString());
    }
}
