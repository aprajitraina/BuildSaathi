using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Common.Models;
using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Billing.Queries.GetInvoices;

public class GetInvoicesHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetInvoicesQuery, PagedResult<InvoiceDto>>
{
    public async Task<PagedResult<InvoiceDto>> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        var pageNumber = Math.Max(1, request.PageNumber);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var query = db.Invoices
            .Where(i => i.ContractorId == contractorId);

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var normalized = request.Status.Trim().ToLowerInvariant();
            var status = normalized switch
            {
                "draft" => InvoiceStatus.Draft,
                "sent" => InvoiceStatus.Sent,
                "partiallypaid" or "partially_paid" => InvoiceStatus.PartiallyPaid,
                "paid" => InvoiceStatus.Paid,
                "overdue" => InvoiceStatus.Overdue,
                "cancelled" or "canceled" => InvoiceStatus.Cancelled,
                _ => (InvoiceStatus?)null
            };

            if (status.HasValue)
            {
                query = query.Where(i => i.Status == status.Value);
            }
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.Trim();
            query = query.Where(i => i.InvoiceNumber.Contains(term) || i.ClientName.Contains(term));
        }

        query = query.OrderByDescending(i => i.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var invoices = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<InvoiceDto>(
            invoices.Select(MapInvoice).ToList(),
            totalCount,
            pageNumber,
            pageSize
        );
    }

    internal static InvoiceDto MapInvoice(Domain.Entities.Invoice i) => new(
        i.Id,
        i.InvoiceNumber,
        i.ClientName,
        i.Amount,
        i.PaidAmount,
        i.BalanceDue,
        i.Status.ToString().ToLowerInvariant(),
        i.DueDate,
        i.CreatedAt
    );
}

public class GetOverdueInvoicesHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetOverdueInvoicesQuery, IEnumerable<InvoiceDto>>
{
    public async Task<IEnumerable<InvoiceDto>> Handle(GetOverdueInvoicesQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        var today = DateTime.UtcNow.Date;

        var overdue = await db.Invoices
            .Where(i => i.ContractorId == contractorId
                        && i.DueDate.HasValue
                        && i.DueDate.Value.Date < today
                        && i.Status != InvoiceStatus.Paid
                        && i.Status != InvoiceStatus.Cancelled)
            .OrderBy(i => i.DueDate)
            .ToListAsync(cancellationToken);

        return overdue.Select(GetInvoicesHandler.MapInvoice);
    }
}
