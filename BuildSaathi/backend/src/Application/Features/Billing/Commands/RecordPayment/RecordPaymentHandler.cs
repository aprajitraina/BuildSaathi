using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Billing.Commands.RecordPayment;

public class RecordPaymentHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<RecordPaymentCommand>
{
    public async Task Handle(RecordPaymentCommand request, CancellationToken cancellationToken)
    {
        var invoice = await db.Invoices
            .FirstOrDefaultAsync(i => i.Id == request.InvoiceId && i.ContractorId == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Invoice", request.InvoiceId);

        invoice.RecordPayment(request.Amount);
        var payment = Domain.Entities.Payment.Create(
            request.InvoiceId,
            request.Amount,
            request.PaidDate ?? DateTime.UtcNow,
            request.PaymentMethod,
            request.ReferenceNumber
        );

        db.Payments.Add(payment);
        activityLogger.Log(
            "invoice_payment_recorded",
            $"Payment recorded for {invoice.InvoiceNumber}: INR {request.Amount:N2}",
            "invoice",
            invoice.Id);
        await db.SaveChangesAsync(cancellationToken);
    }
}
