using FluentValidation;

namespace BuildSaathi.Application.Features.Projects.Commands.Progress;

public class UpdateProjectProgressValidator : AbstractValidator<UpdateProjectProgressCommand>
{
    public UpdateProjectProgressValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.CompletionPercent).InclusiveBetween(0, 100);
    }
}
