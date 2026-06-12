using MediatR;

namespace BuildSaathi.Application.Features.Billing.Commands.CreateInvoice;

public record CreateInvoiceCommand(
    string InvoiceNumber,
    string ClientName,
    decimal Amount,
    DateTime? DueDate = null,
    Guid? ProjectId = null
) : IRequest<InvoiceCreateResponse>;

public record InvoiceCreateResponse(Guid Id, string InvoiceNumber, string Status);
