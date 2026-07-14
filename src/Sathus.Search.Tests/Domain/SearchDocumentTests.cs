namespace Sathus.Search.Tests.Domain;

public class SearchDocumentTests
{
    [Fact]
    public void Create_Should_Set_Defaults()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");

        doc.Should().NotBeNull();
        doc.Status.Should().Be(DocumentStatus.Published);
        doc.Language.Should().Be("en");
        doc.Score.Should().Be(SearchScore.Zero);
        doc.IsFeatured.Should().BeFalse();
        doc.PermissionScope.Should().Be(PermissionScope.Public);
        doc.RequiredRoles.Should().BeNull();
        doc.AllowedUsers.Should().BeNull();
        doc.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void Create_Should_Lowercase_Language()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", language: "EN");

        doc.Language.Should().Be("en");
    }

    [Fact]
    public void Create_Should_Throw_On_Empty_ExternalId()
    {
        var act = () => SearchDocument.Create(Guid.NewGuid(), "", IndexSourceType.Page, "Title", "Content");

        act.Should().Throw<ArgumentException>().WithMessage("ExternalId is required.*");
    }

    [Fact]
    public void Create_Should_Throw_On_Empty_Title()
    {
        var act = () => SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "", "Content");

        act.Should().Throw<ArgumentException>().WithMessage("Title is required.*");
    }

    [Fact]
    public void Update_Should_Change_Fields_And_Raise_Event()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Old", "Old content");
        doc.ClearDomainEvents();

        doc.Update("New Title", "New content", "http://new", "http://img", Guid.NewGuid());

        doc.Title.Should().Be("New Title");
        doc.Content.Should().Be("New content");
        doc.Url.Should().Be("http://new");
        doc.ImageUrl.Should().Be("http://img");
        doc.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchDocumentUpdatedEvent>();
    }

    [Fact]
    public void Publish_Should_Set_Status_And_Raise_Event()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");
        doc.ClearDomainEvents();
        var publishedAt = DateTime.UtcNow;

        doc.Publish(publishedAt, Guid.NewGuid());

        doc.Status.Should().Be(DocumentStatus.Published);
        doc.PublishedAt.Should().Be(publishedAt);
        doc.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchDocumentStatusChangedEvent>();
    }

    [Fact]
    public void Archive_Should_Set_Archived_And_Raise_Event()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");
        doc.ClearDomainEvents();

        doc.Archive(Guid.NewGuid());

        doc.Status.Should().Be(DocumentStatus.Archived);
        doc.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchDocumentStatusChangedEvent>();
    }

    [Fact]
    public void Expire_Should_Set_Expired()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");
        doc.ClearDomainEvents();

        doc.Expire(Guid.NewGuid());

        doc.Status.Should().Be(DocumentStatus.Expired);
        doc.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchDocumentStatusChangedEvent>();
    }

    [Fact]
    public void SetPermissionScope_Should_Set_Scope_And_Roles()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");

        doc.SetPermissionScope(PermissionScope.RoleBased, "admin,editor", "user-1", Guid.NewGuid());

        doc.PermissionScope.Should().Be(PermissionScope.RoleBased);
        doc.RequiredRoles.Should().Be("admin,editor");
        doc.AllowedUsers.Should().Be("user-1");
    }

    [Fact]
    public void SetScore_Should_Set_Positive_Score()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");

        doc.SetScore(5.5, Guid.NewGuid());

        doc.Score.Value.Should().Be(5.5);
    }

    [Fact]
    public void SetScore_Should_Throw_On_Negative()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");

        var act = () => doc.SetScore(-1.0, Guid.NewGuid());

        act.Should().Throw<ArgumentException>().WithMessage("Score cannot be negative.*");
    }

    [Fact]
    public void SetMetadata_Should_Set_Json()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");

        doc.SetMetadata("{\"key\":\"value\"}", Guid.NewGuid());

        doc.Metadata.Should().Be("{\"key\":\"value\"}");
    }
}
