using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class TenderMatchConfiguration : IEntityTypeConfiguration<TenderMatch>
{
    public void Configure(EntityTypeBuilder<TenderMatch> builder)
    {
        builder.ToTable("TenderMatches");
        builder.HasKey(tm => tm.Id);

        builder.Property(tm => tm.Status).HasConversion<string>().HasMaxLength(30);
        builder.Property(tm => tm.Notes).HasMaxLength(1000);

        // Unique: one contractor can save each tender only once
        builder.HasIndex(tm => new { tm.ContractorId, tm.TenderId }).IsUnique();
        builder.HasIndex(tm => tm.ContractorId);

        builder.HasOne(tm => tm.Contractor)
            .WithMany(c => c.TenderMatches)
            .HasForeignKey(tm => tm.ContractorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tm => tm.Tender)
            .WithMany(t => t.TenderMatches)
            .HasForeignKey(tm => tm.TenderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
