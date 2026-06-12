using BuildSaathi.Domain.Enums;

namespace BuildSaathi.Domain.Entities;

/// <summary>
/// The primary tenant entity. Every contractor gets their own isolated data space.
/// A Contractor maps 1:1 to a SaaS account (org-level, not user-level).
/// </summary>
public class Contractor : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public string CompanyName { get; private set; } = string.Empty;
    public string? GstNumber { get; private set; }
    public string? PanNumber { get; private set; }
    public string City { get; private set; } = string.Empty;
    public string State { get; private set; } = string.Empty;
    public string? Address { get; private set; }

    public ContractorPlan Plan { get; private set; } = ContractorPlan.Free;
    public bool IsActive { get; private set; } = true;

    // Preferred work categories for tender recommendations
    public List<string> PreferredCategories { get; private set; } = [];

    // Navigation
    public ICollection<User> Users { get; private set; } = [];
    public ICollection<Project> Projects { get; private set; } = [];
    public ICollection<TenderMatch> TenderMatches { get; private set; } = [];
    public ICollection<BOQ> BOQs { get; private set; } = [];
    public ICollection<Invoice> Invoices { get; private set; } = [];

    // EF Core constructor
    protected Contractor() { }

    public static Contractor Create(
        string name, string email, string phone,
        string companyName, string city, string state)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(phone);
        ArgumentException.ThrowIfNullOrWhiteSpace(companyName);

        return new Contractor
        {
            Name = name,
            Email = email.ToLowerInvariant(),
            Phone = phone,
            CompanyName = companyName,
            City = city,
            State = state,
        };
    }

    public void UpdateProfile(
        string name,
        string phone,
        string companyName,
        string? gstNumber,
        string? panNumber,
        string city,
        string state,
        string? address,
        IEnumerable<string>? preferredCategories = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(phone);
        ArgumentException.ThrowIfNullOrWhiteSpace(companyName);
        ArgumentException.ThrowIfNullOrWhiteSpace(city);
        ArgumentException.ThrowIfNullOrWhiteSpace(state);

        Name = name;
        Phone = phone;
        CompanyName = companyName;
        GstNumber = gstNumber;
        PanNumber = panNumber;
        City = city;
        State = state;
        Address = address;
        if (preferredCategories is not null)
        {
            PreferredCategories = preferredCategories
                .Select(c => c.Trim())
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        UpdatedAt = DateTime.UtcNow;
    }

    public void SetPlan(ContractorPlan plan)
    {
        Plan = plan;
        UpdatedAt = DateTime.UtcNow;
    }
}
