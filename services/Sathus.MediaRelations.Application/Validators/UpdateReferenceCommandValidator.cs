using FluentValidation;
using Sathus.MediaRelations.Application.Commands.UpdateReference;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Application.Validators;

public sealed class UpdateReferenceCommandValidator : AbstractValidator<UpdateReferenceCommand>
{
    public UpdateReferenceCommandValidator()
    {
        RuleFor(x => x.ReferenceId)
            .NotEqual(Guid.Empty).WithMessage("Reference id is required.");

        RuleFor(x => x.NewAssetId)
            .NotEqual(Guid.Empty).When(x => x.NewAssetId.HasValue)
            .WithMessage("New asset id cannot be empty.");

        RuleFor(x => x.Path)
            .MaximumLength(ReferencePath.MaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.Path));

        RuleFor(x => x.Scope)
            .Must(BeValidScope).When(x => !string.IsNullOrWhiteSpace(x.Scope))
            .WithMessage("Scope is invalid.");
    }

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
