using BuildSaathi.Domain.Entities;

namespace BuildSaathi.Application.Common.Interfaces;

public interface IReportPdfService
{
    byte[] GenerateBoqPdf(BOQ boq);
    byte[] GenerateInvoicePdf(Invoice invoice, IReadOnlyCollection<Payment> payments);
}
