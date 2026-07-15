global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.Events;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchDocumentAdditionalTests
{
    [Fact]
    public void Create_Should_Accept_All_Parameters()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", Guid.NewGuid(), "Author", "fr", PermissionScope.Private);

        doc.Title.Should().Be("Title");
        doc.Url.Should().Be("http://url");
        doc.ImageUrl.Should().Be("http://img");
        doc.AuthorId.Should().NotBeNull();
        doc.AuthorName.Should().Be("Author");
        doc.Language.Should().Be("fr");
        doc.PermissionScope.Should().Be(PermissionScope.Private);
    }

    [Fact]
    public void Create_Should_Use_English_As_Default_Language()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        doc.Language.Should().Be("en");
    }

    [Fact]
    public void SetMetadata_Should_Update_Metadata()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        doc.SetMetadata("{\"key\":\"value\"}", Guid.NewGuid());

        doc.Metadata.Should().Be("{\"key\":\"value\"}");
    }

    [Fact]
    public void Expire_Should_Set_Status_To_Expired()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        doc.Expire(Guid.NewGuid());

        doc.Status.Should().Be(DocumentStatus.Expired);
    }

    [Fact]
    public void SetPermissionScope_Should_Update_Scope_And_Roles()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        doc.SetPermissionScope(PermissionScope.RoleBased, "admin,editor", "user-1", Guid.NewGuid());

        doc.PermissionScope.Should().Be(PermissionScope.RoleBased);
        doc.RequiredRoles.Should().Be("admin,editor");
        doc.AllowedUsers.Should().Be("user-1");
    }

    [Fact]
    public void Publish_Should_Set_Status_And_PublishedAt()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);
        var publishedAt = DateTime.UtcNow;

        doc.Publish(publishedAt, Guid.NewGuid());

        doc.Status.Should().Be(DocumentStatus.Published);
        doc.PublishedAt.Should().Be(publishedAt);
    }

    [Fact]
    public void Delete_Should_Set_Deleted_And_Raise_Event()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);
        doc.ClearDomainEvents();

        doc.Delete(Guid.NewGuid());

        doc.IsDeleted.Should().BeTrue();
        doc.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchDocumentDeletedEvent>();
    }

    [Fact]
    public void SetScore_Should_Throw_On_NaN()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        var act = () => doc.SetScore(double.NaN, Guid.NewGuid());

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void SetScore_Should_Set_Positive_Score()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        doc.SetScore(5.5, Guid.NewGuid());

        doc.Score.Value.Should().Be(5.5);
    }

    [Fact]
    public void Update_Should_Change_Fields()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Old", "Old content", null, null);

        doc.Update("New Title", "New content", "http://new", "http://img", Guid.NewGuid());

        doc.Title.Should().Be("New Title");
        doc.Url.Should().Be("http://new");
        doc.ImageUrl.Should().Be("http://img");
    }

    [Fact]
    public void Update_Should_Not_Change_Url_When_Null()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://original", null);

        doc.Update("New Title", "New content", null, null, Guid.NewGuid());

        doc.Url.Should().Be("http://original");
    }

    [Fact]
    public void Create_Should_Set_Defaults()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        doc.Status.Should().Be(DocumentStatus.Draft);
        doc.Language.Should().Be("en");
        doc.Score.Value.Should().Be(0);
        doc.IsFeatured.Should().BeFalse();
        doc.PermissionScope.Should().Be(PermissionScope.Public);
        doc.DomainEvents.Should().BeEmpty();
    }
}
