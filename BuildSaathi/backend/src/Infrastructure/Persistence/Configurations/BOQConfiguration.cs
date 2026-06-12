using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class BOQConfiguration : IEntityTypeConfiguration<BOQ>
{
    public void Configure(EntityTypeBuilder<BOQ> builder)
    {
        builder.ToTable("BOQs");
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Title).IsRequired().HasMaxLength(300);
        builder.Property(b => b.State).IsRequired().HasMaxLength(100);
        builder.Property(b => b.WorkCategory).IsRequired().HasMaxLength(100);
        builder.Property(b => b.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(b => b.OverheadPercent).HasPrecision(5, 2);
        builder.Property(b => b.ContingencyPercent).HasPrecision(5, 2);

        // Computed properties — not mapped to columns
        builder.Ignore(b => b.BaseTotal);
        builder.Ignore(b => b.OverheadAmount);
        builder.Ignore(b => b.ContingencyAmount);
        builder.Ignore(b => b.TotalEstimatedCost);

        builder.HasIndex(b => b.ContractorId);
        builder.HasIndex(b => b.TenderId);

        builder.HasOne(b => b.Contractor)
            .WithMany(c => c.BOQs)
            .HasForeignKey(b => b.ContractorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(b => b.LineItems)
            .WithOne(li => li.BOQ)
            .HasForeignKey(li => li.BOQId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class BOQLineItemConfiguration : IEntityTypeConfiguration<BOQLineItem>
{
    public void Configure(EntityTypeBuilder<BOQLineItem> builder)
    {
        builder.ToTable("BOQLineItems");
        builder.HasKey(li => li.Id);

        builder.Property(li => li.Description).IsRequired().HasMaxLength(500);
        builder.Property(li => li.Unit).IsRequired().HasMaxLength(30);
        builder.Property(li => li.Quantity).HasPrecision(18, 3);
        builder.Property(li => li.UnitRate).HasPrecision(18, 2);
        builder.Property(li => li.DsrCode).HasMaxLength(50);
        builder.Property(li => li.Category).IsRequired().HasMaxLength(100);
        builder.Property(li => li.Remarks).HasMaxLength(500);

        // Amount is computed — not stored
        builder.Ignore(li => li.Amount);

        builder.HasIndex(li => li.BOQId);
    }
}
