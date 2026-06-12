using FluentValidation;

namespace BuildSaathi.Modules.Estimation.Application.Commands.CreateEstimateFromForm;

public class CreateEstimateFromFormValidator : AbstractValidator<CreateEstimateFromFormCommand>
{
    public CreateEstimateFromFormValidator()
    {
        RuleFor(x => x.AreaSqFt).GreaterThan(0);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FinishType).MaximumLength(100);
    }
}
