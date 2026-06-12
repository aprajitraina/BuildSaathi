using FluentValidation;

namespace BuildSaathi.Modules.Estimation.Application.Commands.UploadEstimateFile;

public class UploadEstimateFileValidator : AbstractValidator<UploadEstimateFileCommand>
{
    public UploadEstimateFileValidator()
    {
        RuleFor(x => x.FileName).NotEmpty();
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FileContent).NotNull();
    }
}
