using FluentValidation;
using MediatR;
using Sathus.Upload.Application.Behaviors;
using Sathus.Upload.Application.Commands.StartUpload;
using Sathus.Upload.Application.Validators;
using Sathus.Upload.Tests.Application.Commands;
using Xunit;

namespace Sathus.Upload.Tests.Application.Behaviors;

public class ValidationBehaviorTests
{
    [Fact]
    public async Task Handle_ValidationFails_ThrowsValidationException()
    {
        var validators = new List<IValidator<StartUploadCommand>>
        {
            new StartUploadCommandValidator()
        };

        var behavior = new ValidationBehavior<StartUploadCommand, UploadSessionResponse>(validators);
        var next = new RequestHandlerDelegate<UploadSessionResponse>(() => Task.FromResult<UploadSessionResponse>(null!));

        var request = new StartUploadCommand(
            FileName: "",
            FileExtension: "pdf",
            MimeType: "application/pdf",
            Size: 1024);

        await Assert.ThrowsAsync<ValidationException>(() => behavior.Handle(request, next, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_NoValidators_CallsNext()
    {
        var validators = new List<IValidator<StartUploadCommand>>();
        var behavior = new ValidationBehavior<StartUploadCommand, UploadSessionResponse>(validators);

        var called = false;
        var next = new RequestHandlerDelegate<UploadSessionResponse>(() =>
        {
            called = true;
            return Task.FromResult<UploadSessionResponse>(null!);
        });

        var request = new StartUploadCommand(
            FileName: "test.pdf",
            FileExtension: "pdf",
            MimeType: "application/pdf",
            Size: 1024);

        await behavior.Handle(request, next, CancellationToken.None);

        called.Should().BeTrue();
    }
}
