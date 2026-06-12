using FluentValidation;

namespace BuildSaathi.Application.Features.Settings.Commands.UpdateSettingsProfile;

public class UpdateSettingsProfileValidator : AbstractValidator<UpdateSettingsProfileCommand>
{
    public UpdateSettingsProfileValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
        RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(300);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.State).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Address).MaximumLength(500);
        RuleFor(x => x.GstNumber).MaximumLength(15);
        RuleFor(x => x.PanNumber).MaximumLength(10);
        RuleForEach(x => x.PreferredCategories).MaximumLength(100);
    }
}
