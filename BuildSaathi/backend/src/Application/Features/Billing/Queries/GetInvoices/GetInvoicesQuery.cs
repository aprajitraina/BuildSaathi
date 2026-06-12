using BuildSaathi.Application.Common.Models;
using MediatR;

namespace BuildSaathi.Application.Features.Billing.Queries.GetInvoices;

public record GetInvoicesQuery(
    int PageNumber = 1,
    int PageSize = 20,
    string? Status = null,
    string? Search = null) : IRequest<PagedResult<InvoiceDto>>;
public record GetOverdueInvoicesQuery : IRequest<IEnumerable<InvoiceDto>>;

public record InvoiceDto(
    Guid Id,
    string InvoiceNumber,
    string ClientName,
    decimal Amount,
    decimal PaidAmount,
    decimal BalanceDue,
    string Status,
    DateTime? DueDate,
    DateTime CreatedAt
);
