using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

public class Invoice : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public Guid? ProjectId { get; private set; }
    public string InvoiceNumber { get; private set; } = string.Empty;
    public string ClientName { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public decimal PaidAmount { get; private set; } = 0m;
    public decimal BalanceDue => Amount - PaidAmount;
    public InvoiceStatus Status { get; private set; } = InvoiceStatus.Draft;
    public DateTime? IssuedDate { get; private set; }
    public DateTime? DueDate { get; private set; }
    public string? Notes { get; private set; }

    public Contractor Contractor { get; private set; } = null!;
    public ICollection<Payment> Payments { get; private set; } = [];

    protected Invoice() { }

    public static Invoice Create(Guid contractorId, string invoiceNumber,
        string clientName, decimal amount, DateTime? dueDate = null, Guid? projectId = null)
    {
        return new Invoice
        {
            ContractorId = contractorId,
            InvoiceNumber = invoiceNumber,
            ClientName = clientName,
            Amount = amount,
            DueDate = dueDate,
            ProjectId = projectId,
        };
    }

    public void RecordPayment(decimal paymentAmount)
    {
        if (paymentAmount <= 0) throw new ArgumentException("Payment must be positive.");
        PaidAmount += paymentAmount;
        Status = PaidAmount >= Amount ? InvoiceStatus.Paid : InvoiceStatus.PartiallyPaid;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkSent()
    {
        Status = InvoiceStatus.Sent;
        IssuedDate = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
