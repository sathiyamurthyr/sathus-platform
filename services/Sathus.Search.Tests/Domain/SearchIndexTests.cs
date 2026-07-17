global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.Events;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain;

public class SearchIndexTests
{
    [Fact]
    public void Create_Should_Set_Defaults()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main Index", "main");

        index.Should().NotBeNull();
        index.Name.Should().Be("Main Index");
        index.Code.Should().Be("main");
        index.IsEnabled.Should().BeTrue();
        index.IsRebuilding.Should().BeFalse();
        index.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchIndexCreatedEvent>();
    }

    [Fact]
    public void AddField_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        index.ClearDomainEvents();

        var field = index.AddField("title", "text");

        index.Fields.Should().ContainSingle();
        field.Name.Should().Be("title");
    }

    [Fact]
    public void AddSynonym_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        var synonym = index.AddSynonym("phone", "mobile");

        index.Synonyms.Should().ContainSingle();
        synonym.From.Should().Be("phone");
        synonym.To.Should().Be("mobile");
    }

    [Fact]
    public void AddRanking_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        var ranking = index.AddRanking("Boost Featured", "featured");

        index.Rankings.Should().ContainSingle();
        ranking.Boost.Should().Be(1.0);
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
    public void Disable_Should_Set_IsEnabled_False()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.Disable();

        index.IsEnabled.Should().BeFalse();
    }

    [Fact]
    public void SetRebuilding_Should_Update_Flag()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.SetRebuilding(true);

        index.IsRebuilding.Should().BeTrue();
    }

    [Fact]
    public void SetSettings_Should_Update_Settings()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        index.SetSettings("{\"analyzer\":\"standard\"}");

        index.Settings.Should().Be("{\"analyzer\":\"standard\"}");
    }

    [Fact]
    public void RemoveDomainEvent_Should_Remove_Specific_Event()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        var evt = index.DomainEvents.Single();
        index.ClearDomainEvents();
        index.AddDomainEvent(new SearchIndexCreatedEvent(index.Id, index.Name, index.Code));

        index.RemoveDomainEvent(evt);

        index.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void AddHighlight_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");

        var highlight = index.AddHighlight("title");

        index.Highlights.Should().ContainSingle();
        highlight.FieldName.Should().Be("title");
    }
}
