namespace Sathus.Search.Tests.Domain;

public class SearchIndexTests
{
    [Fact]
    public void Create_Should_Set_Defaults()
    {
        var index = SearchIndex.Create("Main Index", "MAIN", SearchProviderType.Elasticsearch);

        index.Should().NotBeNull();
        index.Code.Should().Be("main");
        index.IsEnabled.Should().BeTrue();
        index.Provider.Should().Be(SearchProviderType.Elasticsearch);
        index.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchIndexCreatedEvent>();
    }

    [Fact]
    public void AddField_Should_Add_And_Raise_Event()
    {
        var index = SearchIndex.Create("Main", "MAIN", SearchProviderType.Elasticsearch);
        index.ClearDomainEvents();

        var field = index.AddField("title", SearchFieldType.Text);

        index.Fields.Should().ContainSingle();
        field.Name.Should().Be("title");
        index.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchFieldAddedEvent>();
    }

    [Fact]
    public void AddSynonym_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create("Main", "MAIN", SearchProviderType.Elasticsearch);

        var synonym = index.AddSynonym("phone", "mobile");

        index.Synonyms.Should().ContainSingle();
        synonym.From.Should().Be("phone");
        synonym.To.Should().Be("mobile");
    }

    [Fact]
    public void AddRanking_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create("Main", "MAIN", SearchProviderType.Elasticsearch);

        var ranking = index.AddRanking("Boost Featured", "featured", 2.0, 1);

        index.Rankings.Should().ContainSingle();
        ranking.Name.Should().Be("Boost Featured");
        ranking.Query.Should().Be("featured");
        ranking.Boost.Should().Be(2.0);
        ranking.Priority.Should().Be(1);
    }

    [Fact]
    public void AddFacet_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create("Main", "MAIN", SearchProviderType.Elasticsearch);

        var facet = index.AddFacet("Categories", "category", FacetType.Terms);

        index.Facets.Should().ContainSingle();
        facet.FieldName.Should().Be("category");
    }

    [Fact]
    public void AddHighlight_Should_Add_To_Collection()
    {
        var index = SearchIndex.Create("Main", "MAIN", SearchProviderType.Elasticsearch);

        var highlight = index.AddHighlight("content", "<mark>", "</mark>");

        index.Highlights.Should().ContainSingle();
        highlight.FieldName.Should().Be("content");
    }

    [Fact]
    public void RecordRebuild_Should_Set_LastRebuildAt()
    {
        var index = SearchIndex.Create("Main", "MAIN", SearchProviderType.Elasticsearch);
        var rebuiltAt = DateTime.UtcNow;

        index.RecordRebuild(rebuiltAt, Guid.NewGuid());

        index.LastRebuildAt.Should().Be(rebuiltAt);
    }
}
