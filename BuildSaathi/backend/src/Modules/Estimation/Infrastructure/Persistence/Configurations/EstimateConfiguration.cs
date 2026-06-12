using BuildSaathi.Modules.Estimation.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Modules.Estimation.Infrastructure.Persistence.Configurations;

public class EstimateConfiguration : IEntityTypeConfiguration<Estimate>
{
    public void Configure(EntityTypeBuilder<Estimate> builder)
    {
        builder.ToTable("Estimates");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Location).IsRequired().HasMaxLength(200);
        builder.Property(e => e.FinishType).HasMaxLength(100);
        builder.Property(e => e.ProjectType).HasConversion<string>().HasMaxLength(32);
        builder.Property(e => e.EstimateType).HasConversion<string>().HasMaxLength(32);
        builder.Property(e => e.SourceType).HasConversion<string>().HasMaxLength(32);
        builder.Property(e => e.AreaSqFt).HasPrecision(18, 3);

        builder.Ignore(e => e.TotalAmount);

        builder.HasIndex(e => e.ContractorId);
        builder.HasIndex(e => e.TenderId);

        builder.HasMany(e => e.Items)
            .WithOne(i => i.Estimate)
            .HasForeignKey(i => i.EstimateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Warnings)
            .WithOne(w => w.Estimate)
            .HasForeignKey(w => w.EstimateId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class EstimateItemConfiguration : IEntityTypeConfiguration<EstimateItem>
{
    public void Configure(EntityTypeBuilder<EstimateItem> builder)
    {
        builder.ToTable("EstimateItems");
        builder.HasKey(i => i.Id);

        builder.Property(i => i.ItemName).IsRequired().HasMaxLength(500);
        builder.Property(i => i.NormalizedName).HasMaxLength(500);
        builder.Property(i => i.Unit).IsRequired().HasMaxLength(50);
        builder.Property(i => i.Quantity).HasPrecision(18, 3);
        builder.Property(i => i.Rate).HasPrecision(18, 2);
        builder.Property(i => i.Amount).HasPrecision(18, 2);

        builder.HasIndex(i => i.EstimateId);
    }
}

public class EstimateWarningConfiguration : IEntityTypeConfiguration<EstimateWarning>
{
    public void Configure(EntityTypeBuilder<EstimateWarning> builder)
    {
        builder.ToTable("EstimateWarnings");
        builder.HasKey(w => w.Id);

        builder.Property(w => w.Level).HasConversion<string>().HasMaxLength(20);
        builder.Property(w => w.Message).IsRequired().HasMaxLength(2000);
        builder.Property(w => w.Code).HasMaxLength(64);

        builder.HasIndex(w => w.EstimateId);
    }
}

public class RateMasterConfiguration : IEntityTypeConfiguration<RateMaster>
{
    public void Configure(EntityTypeBuilder<RateMaster> builder)
    {
        builder.ToTable("RateMaster");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.ItemCode).IsRequired().HasMaxLength(64);
        builder.Property(r => r.DisplayName).IsRequired().HasMaxLength(200);
        builder.Property(r => r.Unit).IsRequired().HasMaxLength(50);
        builder.Property(r => r.Rate).HasPrecision(18, 2);
        builder.Property(r => r.State).HasMaxLength(100);

        builder.HasIndex(r => r.ItemCode);
        builder.HasIndex(r => new { r.ItemCode, r.State });
    }
}
