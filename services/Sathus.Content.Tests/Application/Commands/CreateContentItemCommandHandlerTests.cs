using FluentAssertions;
using Moq;
using Sathus.Content.Application.Commands.CreateContentItem;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Validators;
using Sathus.Content.Domain.Enums;
using Xunit;

namespace Sathus.Content.Tests.Application.Commands;

public class CreateContentItemCommandHandlerTests
{
    [Fact]
    public async Task Handle_ValidCommand_ReturnsResponse()
    {
        var contentItems = new Mock<IContentItemRepository>();
        contentItems.Setup(r => r.ExistsBySlugAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);
        var audit = new Mock<IAuditService>();

        var handler = new CreateContentItemCommandHandler(contentItems.Object, audit.Object);

        var result = await handler.Handle(
            new CreateContentItemCommand(
                Title: "Test Page",
                Slug: "test-page",
                Body: "Body content",
                ContentType: ContentType.Page),
            CancellationToken.None);

        result.Title.Should().Be("Test Page");
        result.Slug.Should().Be("test-page");
        result.ContentType.Should().Be(ContentType.Page);
        result.Status.Should().Be(ContentStatus.Draft);
        contentItems.Verify(r => r.AddAsync(It.IsAny<Sathus.Content.Domain.Entities.ContentItem>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_DuplicateSlug_ThrowsContentItemAlreadyExistsException()
    {
        var contentItems = new Mock<IContentItemRepository>();
        contentItems.Setup(r => r.ExistsBySlugAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var handler = new CreateContentItemCommandHandler(contentItems.Object, Mock.Of<IAuditService>());

        var act = async () => await handler.Handle(
            new CreateContentItemCommand("Test", "test-page", "body", ContentType.Page),
            CancellationToken.None);

        await act.Should().ThrowAsync<Sathus.Content.Application.Exceptions.ContentItemAlreadyExistsException>();
    }
}
