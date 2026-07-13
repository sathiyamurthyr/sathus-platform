using FluentValidation;
using Sathus.Navigation.Application.Commands.CreateTree;
using Sathus.Navigation.Application.Commands.CreateMenu;
using Sathus.Navigation.Application.Commands.CreateNode;
using Sathus.Navigation.Application.Commands.UpdateNode;
using Sathus.Navigation.Application.Commands.MoveNode;
using Sathus.Navigation.Application.Commands.PublishMenu;
using Sathus.Navigation.Application.Commands.SchedulePublish;

namespace Sathus.Navigation.Application.Validators;

public sealed class CreateTreeCommandValidator : AbstractValidator<CreateTreeCommand>
{
    public CreateTreeCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        RuleFor(x => x.DefaultLocale).NotEmpty().Matches("^[a-z]{2}(-[a-z]{2})?$")
            .WithMessage("Default locale must be a valid ISO 639-1 code.");
        RuleFor(x => x.Platform).NotEmpty().WithMessage("Platform is required.");
    }
}

public sealed class CreateMenuCommandValidator : AbstractValidator<CreateMenuCommand>
{
    public CreateMenuCommandValidator()
    {
        RuleFor(x => x.TreeId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        RuleFor(x => x.MenuType).NotEmpty().Matches("^[a-z0-9\\-]+$")
            .WithMessage("Menu type must be lower-case alphanumeric with hyphens.");
    }
}

public sealed class CreateNodeCommandValidator : AbstractValidator<CreateNodeCommand>
{
    public CreateNodeCommandValidator()
    {
        RuleFor(x => x.MenuId).NotEmpty();
        RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(256);
        RuleFor(x => x.ItemType).NotEmpty();
        RuleFor(x => x.TargetType).NotEmpty();
        RuleFor(x => x).Must(HaveCoherentTarget)
            .WithMessage("External targets require a TargetUrl; reference items require a ReferenceId.");
    }

    private static bool HaveCoherentTarget(CreateNodeCommand cmd) =>
        cmd.TargetType == "External" ? !string.IsNullOrWhiteSpace(cmd.TargetUrl)
        : cmd.ReferenceKind is "None" or "External" or "" or null ? true
        : cmd.ReferenceId is not null;
}

public sealed class UpdateNodeCommandValidator : AbstractValidator<UpdateNodeCommand>
{
    public UpdateNodeCommandValidator()
    {
        RuleFor(x => x.MenuId).NotEmpty();
        RuleFor(x => x.NodeId).NotEmpty();
        RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(256);
    }
}

public sealed class MoveNodeCommandValidator : AbstractValidator<MoveNodeCommand>
{
    public MoveNodeCommandValidator()
    {
        RuleFor(x => x.MenuId).NotEmpty();
        RuleFor(x => x.NodeId).NotEmpty();
        RuleFor(x => x.NewOrder).GreaterThanOrEqualTo(0);
        RuleFor(x => x).Must(x => x.NewParentId != x.NodeId)
            .WithMessage("A node cannot be moved under itself.");
    }
}

public sealed class PublishMenuCommandValidator : AbstractValidator<PublishMenuCommand>
{
    public PublishMenuCommandValidator()
    {
        RuleFor(x => x.MenuId).NotEmpty();
        RuleFor(x => x.VersionId).NotEmpty();
    }
}

public sealed class SchedulePublishCommandValidator : AbstractValidator<SchedulePublishCommand>
{
    public SchedulePublishCommandValidator()
    {
        RuleFor(x => x.MenuId).NotEmpty();
        RuleFor(x => x.VersionId).NotEmpty();
        RuleFor(x => x.ScheduledAt).Must(s => s > DateTime.UtcNow)
            .WithMessage("Scheduled publish time must be in the future.");
    }
}
