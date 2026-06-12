using MediatR;

namespace BuildSaathi.Application.Features.Documents.Commands.DeleteDocument;

public record DeleteDocumentCommand(Guid DocumentId) : IRequest;
