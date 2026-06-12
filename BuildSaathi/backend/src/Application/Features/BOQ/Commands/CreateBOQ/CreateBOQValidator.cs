using FluentValidation;

namespace BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;

public class CreateBOQValidator : AbstractValidator<CreateBOQCommand>
{
    public CreateBOQValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.State).NotEmpty().MaximumLength(100);
        RuleFor(x => x.WorkCategory).NotEmpty().MaximumLength(100);
        RuleFor(x => x.OverheadPercent).InclusiveBetween(0, 100);
        RuleFor(x => x.ContingencyPercent).InclusiveBetween(0, 50);
    }
}
