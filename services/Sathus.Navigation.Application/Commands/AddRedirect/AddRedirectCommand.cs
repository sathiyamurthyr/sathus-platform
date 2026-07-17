using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.AddRedirect;

public sealed record AddRedirectCommand(
    Guid MenuId,
    string SourcePath,
    string TargetPath,
    int RedirectType,
    string? Locale = null,
    int Priority = 0,
    bool IsEnabled = true,
    Guid? ActorId = null)
    : IRequest<RedirectDto>;

public sealed class AddRedirectCommandHandler : IRequestHandler<AddRedirectCommand, RedirectDto>
{
    private readonly INavigationTreeRepository _repository;

    public AddRedirectCommandHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<RedirectDto> Handle(AddRedirectCommand request, CancellationToken cancellationToken)
    {
        var menu = await _repository.GetMenuAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var tree = await _repository.GetWithMenusAsync(menu.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(menu.TreeId);

        var type = Enum.IsDefined(typeof(RedirectType), request.RedirectType)
            ? (RedirectType)request.RedirectType
            : RedirectType.Permanent;

        var redirect = tree.AddRedirect(request.MenuId, request.SourcePath, request.TargetPath, type, request.Locale, request.Priority, request.IsEnabled);
        tree.RecordHistory(HistoryOperation.Edit, request.MenuId, request.ActorId, $"{{\"redirect\":\"{request.SourcePath}\"}}");

        await _repository.SaveChangesAsync(cancellationToken);

        return new RedirectDto(redirect.Id, redirect.MenuId, redirect.SourcePath, redirect.TargetPath,
            (int)redirect.RedirectType, redirect.Locale, redirect.Priority, redirect.IsEnabled);
    }
}

public sealed record DeleteRedirectCommand(Guid TreeId, Guid RedirectId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class DeleteRedirectCommandHandler : IRequestHandler<DeleteRedirectCommand, Unit>
{
    private readonly INavigationTreeRepository _repository;

    public DeleteRedirectCommandHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<Unit> Handle(DeleteRedirectCommand request, CancellationToken cancellationToken)
    {
        var tree = await _repository.GetByIdAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        tree.RemoveRedirect(request.RedirectId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
