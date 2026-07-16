global using FluentAssertions;
global using Xunit;
global using FluentValidation;
global using FluentValidation.Results;
global using MediatR;
global using Moq;
global using Sathus.Search.Application.Behaviors;
global using Sathus.Search.Application.Commands.IndexDocument;
global using Sathus.Search.Application.DTOs;

namespace Sathus.Search.Tests.Application;

public class ValidationBehaviorTests
{
    [Fact]
    public async Task Handle_Should_Call_Next_When_No_Validators()
    {
        var behavior = new ValidationBehavior<IndexDocumentCommand, SearchDocumentResponse>(Enumerable.Empty<IValidator<IndexDocumentCommand>>());
        var next = new Mock<RequestHandlerDelegate<SearchDocumentResponse>>();
        next.Setup(n => n()).ReturnsAsync(new SearchDocumentResponse(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", null, null, null, "en", "Draft", false, 0, DateTime.UtcNow, null, "Public"));

        var result = await behavior.Handle(new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C"), next.Object, CancellationToken.None);

        result.Should().NotBeNull();
        next.Verify(n => n(), Times.Once);
    }

    [Fact]
    public async Task Handle_Should_Throw_ValidationException_When_Validation_Fails()
    {
        var validator = new Mock<IValidator<IndexDocumentCommand>>();
        validator.Setup(v => v.ValidateAsync(It.IsAny<ValidationContext<IndexDocumentCommand>>(), It.IsAny<CancellationToken>())).ReturnsAsync(new ValidationResult(new[] { new ValidationFailure("Test", "error") }));
        var behavior = new ValidationBehavior<IndexDocumentCommand, SearchDocumentResponse>(new[] { validator.Object });
        var next = new Mock<RequestHandlerDelegate<SearchDocumentResponse>>();

        var act = async () => await behavior.Handle(new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C"), next.Object, CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>();
        next.Verify(n => n(), Times.Never);
    }

    [Fact]
    public async Task Handle_Should_Call_Next_When_Validation_Passes()
    {
        var validator = new Mock<IValidator<IndexDocumentCommand>>();
        validator.Setup(v => v.ValidateAsync(It.IsAny<ValidationContext<IndexDocumentCommand>>(), It.IsAny<CancellationToken>())).ReturnsAsync(new ValidationResult());
        var behavior = new ValidationBehavior<IndexDocumentCommand, SearchDocumentResponse>(new[] { validator.Object });
        var next = new Mock<RequestHandlerDelegate<SearchDocumentResponse>>();
        next.Setup(n => n()).ReturnsAsync(new SearchDocumentResponse(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", null, null, null, "en", "Draft", false, 0, DateTime.UtcNow, null, "Public"));

        var result = await behavior.Handle(new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C"), next.Object, CancellationToken.None);

        result.Should().NotBeNull();
        next.Verify(n => n(), Times.Once);
    }
}
