using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;

namespace BuildSaathi.Application.Features.Billing.Commands.CreateInvoice;

public class CreateInvoiceHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<CreateInvoiceCommand, InvoiceCreateResponse>
{
    public async Task<InvoiceCreateResponse> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        var invoice = Domain.Entities.Invoice.Create(
            currentUser.ContractorId,
            request.InvoiceNumber,
            request.ClientName,
            request.Amount,
            request.DueDate,
            request.ProjectId
        );

        invoice.MarkSent();
        db.Invoices.Add(invoice);
        activityLogger.Log(
            "invoice_sent",
            $"Invoice sent: {invoice.InvoiceNumber} ({invoice.ClientName})",
            "invoice",
            invoice.Id);
        await db.SaveChangesAsync(cancellationToken);

        return new InvoiceCreateResponse(invoice.Id, invoice.InvoiceNumber, invoice.Status.ToString().ToLowerInvariant());
    }
}
