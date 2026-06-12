using BuildSaathi.Application.Common.Models;
using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Queries.ExportBOQPdf;

public record ExportBOQPdfQuery(Guid BOQId) : IRequest<PdfFileResult>;
