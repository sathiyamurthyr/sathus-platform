using FluentValidation;
using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Application.Validators;

public sealed class CreateReferenceCommandValidator : AbstractValidator<CreateReferenceCommand>
{
    public CreateReferenceCommandValidator()
    {
        RuleFor(x => x.AssetId)
            .NotEqual(Guid.Empty).WithMessage("Asset id is required.");

        RuleFor(x => x.Module)
            .NotEmpty().WithMessage("Module is required.")
            .MaximumLength(128).WithMessage("Module must be at most 128 characters.");

        RuleFor(x => x.ReferenceType)
            .NotEmpty().WithMessage("Reference type is required.")
            .Must(BeValid<ReferenceType>).WithMessage("Reference type is invalid.");

        RuleFor(x => x.SourceReferenceId)
            .NotEmpty().WithMessage("Source reference id is required.")
            .MaximumLength(ReferenceId.MaxLength);

        RuleFor(x => x.UsageType)
            .NotEmpty().WithMessage("Usage type is required.")
            .Must(BeValid<UsageType>).WithMessage("Usage type is invalid.");

        RuleFor(x => x.Path)
            .MaximumLength(ReferencePath.MaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.Path));

        RuleFor(x => x.Scope)
            .Must(v => BeValidScope(v)).When(x => !string.IsNullOrWhiteSpace(x.Scope))
            .WithMessage("Scope is invalid.");

        RuleFor(x => x.ScheduledFor)
            .NotNull()
            .When(x => string.Equals(x.Scope, ReferenceScope.ScheduledValue, StringComparison.OrdinalIgnoreCase))
            .WithMessage("ScheduledFor is required for scheduled references.");
    }

    private static bool BeValid<T>(string value) => value is not null && value.Trim().Length > 0;

    private static bool BeValidScope(string? value)
    {
        try
        {
            _ = ReferenceScope.Create(value!);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
