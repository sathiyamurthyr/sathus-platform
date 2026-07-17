using FluentAssertions;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Enums;
using Sathus.Content.Domain.Exceptions;
using Sathus.Content.Domain.ValueObjects;
using Xunit;

namespace Sathus.Content.Tests.Domain;

public class ContentItemTests
{
    private static ContentItem CreateItem(string title = "Test Page", string slug = "test-page", ContentType type = ContentType.Page)
    {
        return new ContentItem(title, Slug.Create(slug), "Body content", type);
    }

    [Fact]
    public void Constructor_SetsDefaults()
    {
        var item = CreateItem();

        item.Id.Should().NotBe(Guid.Empty);
        item.Title.Should().Be("Test Page");
        item.Slug.Value.Should().Be("test-page");
        item.Body.Should().Be("Body content");
        item.ContentType.Should().Be(ContentType.Page);
        item.Status.Should().Be(ContentStatus.Draft);
        item.PublishedAt.Should().BeNull();
        item.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Constructor_RejectsEmptyTitle()
    {
        var act = () => new ContentItem("", Slug.Create("test"), "body", ContentType.Page);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Publish_SetsStatusAndTimestamp()
    {
        var item = CreateItem();
        var before = DateTime.UtcNow;

        item.Publish(before.AddMinutes(1));

        item.Status.Should().Be(ContentStatus.Published);
        item.PublishedAt.Should().BeCloseTo(before.AddMinutes(1), TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Unpublish_ClearsPublishedAt()
    {
        var item = CreateItem();
        item.Publish(DateTime.UtcNow);

        item.Unpublish();

        item.Status.Should().Be(ContentStatus.Draft);
        item.PublishedAt.Should().BeNull();
    }

    [Fact]
    public void Archive_SetsStatusToArchived()
    {
        var item = CreateItem();

        item.Archive();

        item.Status.Should().Be(ContentStatus.Archived);
    }
}
