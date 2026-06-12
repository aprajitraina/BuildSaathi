using MediatR;

namespace BuildSaathi.Application.Features.Billing.Commands.RecordPayment;

public record RecordPaymentCommand(
    Guid InvoiceId,
    decimal Amount,
    DateTime? PaidDate = null,
    string? PaymentMethod = null,
    string? ReferenceNumber = null
) : IRequest;
