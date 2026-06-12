using FluentValidation;

namespace BuildSaathi.Application.Features.Documents.Commands.UploadDocument;

public class UploadDocumentValidator : AbstractValidator<UploadDocumentCommand>
{
    public UploadDocumentValidator()
    {
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(300);
        RuleFor(x => x.OriginalFileName).NotEmpty().MaximumLength(300);
        RuleFor(x => x.StorageKey).NotEmpty().MaximumLength(500);
        RuleFor(x => x.ContentType).NotEmpty().MaximumLength(100);
        RuleFor(x => x.FileSizeBytes).GreaterThan(0);
        RuleFor(x => x.DocumentType).NotEmpty().MaximumLength(50);
        RuleFor(x => x.EntityType)
            .Must(v => v is null || v is "project" or "tender" or "invoice" or "boq")
            .WithMessage("EntityType must be one of: project, tender, invoice, boq.");
        RuleFor(x => x)
            .Must(x => x.EntityType is not null || !x.EntityId.HasValue)
            .WithMessage("EntityType is required when EntityId is provided.");
    }
}
