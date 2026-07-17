using FluentValidation;

namespace Sathus.Processing.Application.Validators;

public sealed class RetryProcessingCommandValidator : AbstractValidator<RetryProcessingCommand>
{
    public RetryProcessingCommandValidator()
    {
        RuleFor(x => x.AssetId).NotEmpty();
    }
}
