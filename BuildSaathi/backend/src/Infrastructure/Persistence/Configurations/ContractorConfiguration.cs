using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class ContractorConfiguration : IEntityTypeConfiguration<Contractor>
{
    public void Configure(EntityTypeBuilder<Contractor> builder)
    {
        builder.ToTable("Contractors");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Email).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Phone).IsRequired().HasMaxLength(20);
        builder.Property(c => c.CompanyName).IsRequired().HasMaxLength(300);
        builder.Property(c => c.GstNumber).HasMaxLength(15);
        builder.Property(c => c.PanNumber).HasMaxLength(10);
        builder.Property(c => c.City).IsRequired().HasMaxLength(100);
        builder.Property(c => c.State).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Address).HasMaxLength(500);
        builder.Property(c => c.Plan).HasConversion<string>().HasMaxLength(20);

        // PreferredCategories stored as JSON array
        builder.Property(c => c.PreferredCategories)
            .HasConversion(
                v => string.Join(",", v),
                v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList())
            .HasMaxLength(1000);

        builder.HasIndex(c => c.Email).IsUnique();
        builder.HasIndex(c => c.State);
    }
}
