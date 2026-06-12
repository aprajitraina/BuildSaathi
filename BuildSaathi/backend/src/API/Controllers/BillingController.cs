using BuildSaathi.Application.Features.Billing.Commands.CreateInvoice;
using BuildSaathi.Application.Features.Billing.Commands.RecordPayment;
using BuildSaathi.Application.Features.Billing.Queries.ExportInvoicePdf;
using BuildSaathi.Application.Features.Billing.Queries.GetInvoices;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/billing")]
[Authorize]
public class BillingController(ISender mediator) : ControllerBase
{
    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetInvoicesQuery(pageNumber, pageSize, status, search), ct);
        return Ok(result);
    }

    [HttpGet("invoices/{invoiceId:guid}/export-pdf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportInvoicePdf(Guid invoiceId, CancellationToken ct)
    {
        var result = await mediator.Send(new ExportInvoicePdfQuery(invoiceId), ct);
        return File(result.Content, "application/pdf", result.FileName);
    }

    [HttpGet("overdue")]
    public async Task<IActionResult> GetOverdue(CancellationToken ct)
    {
        var result = await mediator.Send(new GetOverdueInvoicesQuery(), ct);
        return Ok(result);
    }

    [HttpPost("invoices")]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpPost("invoices/{invoiceId:guid}/payments")]
    public async Task<IActionResult> RecordPayment(Guid invoiceId, [FromBody] RecordPaymentRequest request, CancellationToken ct)
    {
        await mediator.Send(new RecordPaymentCommand(
            invoiceId, request.Amount, request.PaidDate, request.PaymentMethod, request.ReferenceNumber), ct);
        return NoContent();
    }
}

public record RecordPaymentRequest(decimal Amount, DateTime? PaidDate = null, string? PaymentMethod = null, string? ReferenceNumber = null);
