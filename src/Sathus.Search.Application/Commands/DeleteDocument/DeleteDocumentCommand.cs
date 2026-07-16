using MediatR;

namespace Sathus.Search.Application.Commands.DeleteDocument;

public sealed record DeleteDocumentCommand(Guid DocumentId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand, Unit>
{
    private readonly ISearchRepository _repository;

    public DeleteDocumentCommandHandler(ISearchRepository repository) => _repository = repository;

    public async Task<Unit> Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await _repository.GetByIdAsync(request.DocumentId, cancellationToken)
            ?? throw new SearchDocumentNotFoundException(request.DocumentId);

        document.Delete(request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
