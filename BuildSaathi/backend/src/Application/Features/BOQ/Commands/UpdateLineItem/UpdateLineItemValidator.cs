using FluentValidation;

namespace BuildSaathi.Application.Features.BOQ.Commands.UpdateLineItem;

public class UpdateLineItemValidator : AbstractValidator<UpdateLineItemCommand>
{
    public UpdateLineItemValidator()
    {
        RuleFor(x => x.BOQId).NotEmpty();
        RuleFor(x => x.LineItemId).NotEmpty();
        RuleFor(x => x.Description).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Unit).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.UnitRate).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Category).NotEmpty().MaximumLength(100);
        RuleFor(x => x.DsrCode).MaximumLength(50).When(x => !string.IsNullOrWhiteSpace(x.DsrCode));
        RuleFor(x => x.Remarks).MaximumLength(500).When(x => !string.IsNullOrWhiteSpace(x.Remarks));
    }
}
