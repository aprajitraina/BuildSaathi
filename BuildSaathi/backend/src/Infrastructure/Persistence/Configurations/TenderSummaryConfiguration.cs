using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class TenderSummaryConfiguration : IEntityTypeConfiguration<TenderSummary>
{
    public void Configure(EntityTypeBuilder<TenderSummary> builder)
    {
        builder.ToTable("TenderSummaries");
        builder.HasKey(ts => ts.Id);

        builder.Property(ts => ts.ScopeOfWork).IsRequired().HasMaxLength(2000);
        builder.Property(ts => ts.Recommendation).HasMaxLength(10);
        builder.Property(ts => ts.RecommendationReason).HasMaxLength(1000);
        builder.Property(ts => ts.ContentHash).HasMaxLength(100);

        // Store lists as JSON — MySQL 8.0 supports JSON columns
        builder.Property(ts => ts.KeyRequirements)
            .HasConversion(
                v => string.Join("|||", v),
                v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries).ToList())
            .HasMaxLength(4000);

        builder.Property(ts => ts.EligibilityCriteria)
            .HasConversion(
                v => string.Join("|||", v),
                v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries).ToList())
            .HasMaxLength(4000);

        builder.Property(ts => ts.KeyRisks)
            .HasConversion(
                v => string.Join("|||", v),
                v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries).ToList())
            .HasMaxLength(2000);

        builder.HasIndex(ts => ts.TenderId).IsUnique();

        builder.HasOne(ts => ts.Tender)
            .WithMany(t => t.Summaries)
            .HasForeignKey(ts => ts.TenderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
