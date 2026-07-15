global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.Events;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchIndexAdditionalTests
{
    [Fact]
    public void Enable_Should_Set_IsEnabled_True()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        index.Disable();
        index.ClearDomainEvents();

        index.Enable();

        index.IsEnabled.Should().BeTrue();
    }

    [Fact]
    public void Disable_Should_Set_IsEnabled_False()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.Disable();

        index.IsEnabled.Should().BeFalse();
    }

    [Fact]
    public void SetRebuilding_Should_Set_IsRebuilding()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.SetRebuilding(true);

        index.IsRebuilding.Should().BeTrue();
    }

    [Fact]
    public void SetLastBuiltAt_Should_Update_Date()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        var rebuiltAt = DateTime.UtcNow;

        index.SetLastBuiltAt(rebuiltAt);

        index.LastBuiltAt.Should().Be(rebuiltAt);
    }

    [Fact]
    public void SetSettings_Should_Update_Settings()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.SetSettings("{\"analyzer\":\"standard\"}");

        index.Settings.Should().Be("{\"analyzer\":\"standard\"}");
    }

    [Fact]
    public void Update_Should_Change_Name_And_Code()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.Update("Updated", "updated");

        index.Name.Should().Be("Updated");
        index.Code.Should().Be("updated");
    }

    [Fact]
    public void AddFacet_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        var facet = index.AddFacet("category", "category", "terms");

        index.Facets.Should().ContainSingle();
        facet.Name.Should().Be("category");
    }

    [Fact]
    public void AddHighlight_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        var highlight = index.AddHighlight("title", "<mark>...</mark>");

        index.Highlights.Should().ContainSingle();
        highlight.FieldName.Should().Be("title");
    }

    [Fact]
    public void AddField_Should_Raise_Domain_Event()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        index.ClearDomainEvents();

        index.AddField("title", "text");

        index.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void Create_Should_Throw_When_Name_Is_NullOrWhiteSpace()
    {
        var act = () => SearchIndex.Create(Guid.NewGuid(), "  ", "main");

        act.Should().Throw<ArgumentException>().WithMessage("*Name is required*");
    }

    [Fact]
    public void Create_Should_Throw_When_Code_Is_NullOrWhiteSpace()
    {
        var act = () => SearchIndex.Create(Guid.NewGuid(), "Main", "  ");

        act.Should().Throw<ArgumentException>().WithMessage("*Code is required*");
    }

    [Fact]
    public void Create_Should_Set_Defaults()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.IsEnabled.Should().BeTrue();
        index.IsRebuilding.Should().BeFalse();
        index.LastBuiltAt.Should().BeNull();
        index.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchIndexCreatedEvent>();
    }
}
