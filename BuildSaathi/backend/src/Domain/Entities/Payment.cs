namespace BuildSaathi.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid InvoiceId { get; private set; }
    public decimal Amount { get; private set; }
    public DateTime PaidDate { get; private set; }
    public string? PaymentMethod { get; private set; }
    public string? ReferenceNumber { get; private set; }
    public string? Notes { get; private set; }

    public Invoice Invoice { get; private set; } = null!;

    protected Payment() { }

    public static Payment Create(Guid invoiceId, decimal amount, DateTime paidDate,
        string? paymentMethod = null, string? referenceNumber = null) =>
        new()
        {
            InvoiceId = invoiceId,
            Amount = amount,
            PaidDate = paidDate,
            PaymentMethod = paymentMethod,
            ReferenceNumber = referenceNumber,
        };
}
