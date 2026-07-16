global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.Events;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain;

public class SearchDocumentTests
{
    [Fact]
    public void Create_Should_Set_Defaults()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);

        doc.Should().NotBeNull();
        doc.Status.Should().Be(DocumentStatus.Draft);
        doc.Language.Should().Be("en");
        doc.Score.Value.Should().Be(0);
        doc.IsFeatured.Should().BeFalse();
        doc.PermissionScope.Should().Be(PermissionScope.Public);
        doc.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void Update_Should_Change_Fields()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Old", "Old content", url: null);

        doc.Update("New Title", "New content", "http://new", "http://img", Guid.NewGuid());

        doc.Title.Should().Be("New Title");
        doc.Url.Should().Be("http://new");
    }

    [Fact]
    public void Publish_Should_Set_Status()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        var publishedAt = DateTime.UtcNow;

        doc.Publish(publishedAt, Guid.NewGuid());

        doc.Status.Should().Be(DocumentStatus.Published);
    }

    [Fact]
    public void Delete_Should_Set_Deleted_And_Raise_Event()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        doc.ClearDomainEvents();

        doc.Delete(Guid.NewGuid());

        doc.IsDeleted.Should().BeTrue();
        doc.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchDocumentDeletedEvent>();
    }

    [Fact]
    public void SetScore_Should_Set_Positive_Score()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);

        doc.SetScore(5.5, Guid.NewGuid());

        doc.Score.Value.Should().Be(5.5);
    }

    [Fact]
    public void Restore_Should_Undelete_After_Delete()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        doc.Delete(Guid.NewGuid());

        doc.Restore(Guid.NewGuid(), DateTime.UtcNow);

        doc.IsDeleted.Should().BeFalse();
        doc.DeletedAt.Should().BeNull();
        doc.DeletedBy.Should().BeNull();
    }

    [Fact]
    public void SetCreationAudit_Should_Set_CreatedAt()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        var actor = Guid.NewGuid();
        var now = DateTime.UtcNow;

        doc.SetCreationAudit(actor, now);

        doc.CreatedAt.Should().Be(now);
        doc.CreatedBy.Should().Be(actor);
        doc.UpdatedAt.Should().Be(now);
        doc.UpdatedBy.Should().Be(actor);
    }

    [Fact]
    public void ClearDomainEvents_Should_Remove_All_Events()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        doc.Delete(Guid.NewGuid());

        doc.ClearDomainEvents();

        doc.DomainEvents.Should().BeEmpty();
    }
}
