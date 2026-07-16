using FluentValidation;
using Sathus.Search.Application.Commands.IndexDocument;
using Sathus.Search.Application.Commands.DeleteDocument;
using Sathus.Search.Application.Commands.RebuildIndex;
using Sathus.Search.Application.Commands.BulkIndex;
using Sathus.Search.Application.Queries.Search;
using Sathus.Search.Application.Queries.Suggest;

namespace Sathus.Search.Application.Validators;

public sealed class IndexDocumentCommandValidator : AbstractValidator<IndexDocumentCommand>
{
    public IndexDocumentCommandValidator()
    {
        RuleFor(x => x.IndexId).NotEmpty();
        RuleFor(x => x.ExternalId).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(512);
        RuleFor(x => x.Content).NotEmpty();
        RuleFor(x => x.Language).MaximumLength(10);
    }
}

public sealed class DeleteDocumentCommandValidator : AbstractValidator<DeleteDocumentCommand>
{
    public DeleteDocumentCommandValidator()
    {
        RuleFor(x => x.DocumentId).NotEmpty();
    }
}

public sealed class RebuildIndexCommandValidator : AbstractValidator<RebuildIndexCommand>
{
    public RebuildIndexCommandValidator()
    {
        RuleFor(x => x.IndexId).NotEmpty();
    }
}

public sealed class BulkIndexCommandValidator : AbstractValidator<BulkIndexCommand>
{
    public BulkIndexCommandValidator()
    {
        RuleFor(x => x.IndexId).NotEmpty();
        RuleFor(x => x.Items).NotEmpty();
        RuleForEach(x => x.Items).SetValidator(new BulkIndexItemValidator());
    }
}

public sealed class BulkIndexItemValidator : AbstractValidator<BulkIndexItem>
{
    public BulkIndexItemValidator()
    {
        RuleFor(x => x.ExternalId).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(512);
        RuleFor(x => x.Content).NotEmpty();
    }
}

public sealed class SearchQueryValidator : AbstractValidator<SearchQuery>
{
    public SearchQueryValidator()
    {
        RuleFor(x => x.Query).NotEmpty().MaximumLength(1024);
        RuleFor(x => x.Pagination!.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.Pagination!.PageSize).LessThanOrEqualTo(100);
    }
}

public sealed class SuggestQueryValidator : AbstractValidator<SuggestQuery>
{
    public SuggestQueryValidator()
    {
        RuleFor(x => x.Query).MaximumLength(1024);
        RuleFor(x => x.Limit).LessThanOrEqualTo(20);
    }
}
