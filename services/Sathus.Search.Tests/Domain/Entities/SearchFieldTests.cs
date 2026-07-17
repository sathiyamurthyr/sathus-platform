global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchFieldTests
{
    [Fact]
    public void Constructor_Should_Throw_When_Name_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchField(SearchFieldId.CreateUnique(), Guid.NewGuid(), "  ", "text", null);

        act.Should().Throw<ArgumentException>().WithMessage("*Name is required*");
    }

    [Fact]
    public void Constructor_Should_Throw_When_FieldType_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchField(SearchFieldId.CreateUnique(), Guid.NewGuid(), "name", "  ", null);

        act.Should().Throw<ArgumentException>().WithMessage("*FieldType is required*");
    }

    [Fact]
    public void Constructor_Should_Set_Properties()
    {
        var id = SearchFieldId.CreateUnique();
        var indexId = Guid.NewGuid();

        var field = new SearchField(id, indexId, "title", "text", "{\"analyzer\":\"standard\"}");

        field.Id.Should().Be(id);
        field.IndexId.Should().Be(indexId);
        field.Name.Should().Be("title");
        field.FieldType.Should().Be("text");
        field.Properties.Should().Be("{\"analyzer\":\"standard\"}");
    }

    [Fact]
    public void Create_Should_Return_New_Field()
    {
        var field = SearchField.Create(SearchFieldId.CreateUnique(), Guid.NewGuid(), "body", "text");

        field.Should().NotBeNull();
        field.Name.Should().Be("body");
    }

    [Fact]
    public void CreateUnique_Should_Generate_New_Id()
    {
        var field = SearchField.CreateUnique(Guid.NewGuid(), "body", "text");

        field.Id.Value.Should().NotBe(Guid.Empty);
        field.Name.Should().Be("body");
    }

    [Fact]
    public void Update_Should_Change_Fields()
    {
        var field = SearchField.CreateUnique(Guid.NewGuid(), "old", "text");

        field.Update("new", "keyword", "{}");

        field.Name.Should().Be("new");
        field.FieldType.Should().Be("keyword");
        field.Properties.Should().Be("{}");
    }

    [Fact]
    public void Update_Should_Keep_Original_When_Empty()
    {
        var field = SearchField.CreateUnique(Guid.NewGuid(), "title", "text");

        field.Update("  ", "  ", null);

        field.Name.Should().Be("title");
        field.FieldType.Should().Be("text");
        field.Properties.Should().BeNull();
    }

    [Fact]
    public void MarkDeleted_Should_Set_Deleted_Flags()
    {
        var field = SearchField.CreateUnique(Guid.NewGuid(), "title", "text");
        var actor = Guid.NewGuid();
        var now = DateTime.UtcNow;

        field.MarkDeleted(actor, now);

        field.IsDeleted.Should().BeTrue();
        field.DeletedAt.Should().Be(now);
        field.DeletedBy.Should().Be(actor);
        field.UpdatedAt.Should().Be(now);
    }

    [Fact]
    public void Restore_Should_Undelete()
    {
        var field = SearchField.CreateUnique(Guid.NewGuid(), "title", "text");
        field.MarkDeleted(Guid.NewGuid(), DateTime.UtcNow);

        field.Restore(Guid.NewGuid(), DateTime.UtcNow);

        field.IsDeleted.Should().BeFalse();
        field.DeletedAt.Should().BeNull();
        field.DeletedBy.Should().BeNull();
    }

    [Fact]
    public void SetCreationAudit_Should_Set_Timestamps()
    {
        var field = SearchField.CreateUnique(Guid.NewGuid(), "title", "text");
        var actor = Guid.NewGuid();
        var now = DateTime.UtcNow;

        field.SetCreationAudit(actor, now);

        field.CreatedAt.Should().Be(now);
        field.CreatedBy.Should().Be(actor);
    }

    [Fact]
    public void SetUpdateAudit_Should_Set_UpdatedAt()
    {
        var field = SearchField.CreateUnique(Guid.NewGuid(), "title", "text");
        var actor = Guid.NewGuid();
        var now = DateTime.UtcNow;

        field.SetUpdateAudit(actor, now);

        field.UpdatedAt.Should().Be(now);
        field.UpdatedBy.Should().Be(actor);
    }
}
