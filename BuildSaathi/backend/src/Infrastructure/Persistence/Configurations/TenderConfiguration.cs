using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class TenderConfiguration : IEntityTypeConfiguration<Tender>
{
    public void Configure(EntityTypeBuilder<Tender> builder)
    {
        builder.ToTable("Tenders");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title).IsRequired().HasMaxLength(500);
        builder.Property(t => t.ReferenceNumber).IsRequired().HasMaxLength(100);
        builder.Property(t => t.Department).IsRequired().HasMaxLength(300);
        builder.Property(t => t.Organization).IsRequired().HasMaxLength(300);
        builder.Property(t => t.State).IsRequired().HasMaxLength(100);
        builder.Property(t => t.District).HasMaxLength(100);
        builder.Property(t => t.Category).IsRequired().HasMaxLength(100);
        builder.Property(t => t.EstimatedValue).HasPrecision(18, 2);
        builder.Property(t => t.EmdAmount).HasPrecision(18, 2);
        builder.Property(t => t.DocumentFee).HasPrecision(18, 2);
        builder.Property(t => t.SourceUrl).HasMaxLength(1000);
        builder.Property(t => t.SourcePortal).IsRequired().HasMaxLength(100);

        builder.Property(t => t.Tags)
            .HasConversion(
                v => string.Join(",", v),
                v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList())
            .HasMaxLength(500);

        builder.HasIndex(t => t.State);
        builder.HasIndex(t => t.Category);
        builder.HasIndex(t => t.SubmissionDeadline);
        builder.HasIndex(t => t.IsActive);
        builder.HasIndex(t => t.ReferenceNumber).IsUnique();
    }
}
