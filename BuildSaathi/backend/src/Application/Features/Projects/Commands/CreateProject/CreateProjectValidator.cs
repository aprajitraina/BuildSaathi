using FluentValidation;

namespace BuildSaathi.Application.Features.Projects.Commands.CreateProject;

public class CreateProjectValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(300);
        RuleFor(x => x.State).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ContractValue).GreaterThan(0);
    }
}
