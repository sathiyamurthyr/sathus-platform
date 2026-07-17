using FluentValidation;
using Sathus.Media.Application.Queries.GetMediaById;

namespace Sathus.Media.Application.Validators;

public sealed class GetMediaByIdQueryValidator : AbstractValidator<GetMediaByIdQuery>
{
    public GetMediaByIdQueryValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Asset id is required.");
    }
}
