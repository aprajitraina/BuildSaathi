using FluentValidation;

namespace BuildSaathi.Application.Features.Projects.Commands.Milestones;

public class AddMilestoneValidator : AbstractValidator<AddMilestoneCommand>
{
    public AddMilestoneValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
    }
}

public class UpdateMilestoneStatusValidator : AbstractValidator<UpdateMilestoneStatusCommand>
{
    public UpdateMilestoneStatusValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.MilestoneId).NotEmpty();
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(s =>
            {
                var v = s.Trim().ToLowerInvariant();
                return v is "notstarted" or "not_started" or "inprogress" or "in_progress" or "completed" or "delayed" or "cancelled" or "canceled";
            })
            .WithMessage("Invalid milestone status.");
    }
}
