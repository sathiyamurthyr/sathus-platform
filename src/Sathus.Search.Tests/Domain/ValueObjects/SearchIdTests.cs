global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.ValueObjects;

public class SearchIdTests
{
    [Fact]
    public void Create_Should_Set_Value()
    {
        var guid = Guid.NewGuid();

        var id = SearchId.Create(guid);

        id.Value.Should().Be(guid);
    }

    [Fact]
    public void CreateUnique_Should_Generate_NonEmpty_Guid()
    {
        var id = SearchId.CreateUnique();

        id.Value.Should().NotBe(Guid.Empty);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Value_Is_Empty()
    {
        var act = () => new SearchId(Guid.Empty);

        act.Should().Throw<ArgumentException>().WithMessage("*ID cannot be empty*");
    }

    [Fact]
    public void Implicit_Conversion_To_Guid_Should_Work()
    {
        SearchId id = SearchId.Create(Guid.NewGuid());

        Guid value = id;

        value.Should().Be(id.Value);
    }
}
