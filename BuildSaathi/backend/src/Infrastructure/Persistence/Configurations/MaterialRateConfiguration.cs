using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class MaterialRateConfiguration : IEntityTypeConfiguration<MaterialRate>
{
    public void Configure(EntityTypeBuilder<MaterialRate> builder)
    {
        builder.ToTable("MaterialRates");
        builder.HasKey(m => m.Id);

        builder.Property(m => m.MaterialName).IsRequired().HasMaxLength(200);
        builder.Property(m => m.Unit).IsRequired().HasMaxLength(30);
        builder.Property(m => m.Rate).HasPrecision(18, 2);
        builder.Property(m => m.State).IsRequired().HasMaxLength(100);
        builder.Property(m => m.District).HasMaxLength(100);
        builder.Property(m => m.Source).HasMaxLength(200);
        builder.Property(m => m.Category).IsRequired().HasMaxLength(50);

        builder.HasIndex(m => new { m.State, m.MaterialName, m.EffectiveDate });
        builder.HasIndex(m => m.Category);
    }
}

public class DSRRateConfiguration : IEntityTypeConfiguration<DSRRate>
{
    public void Configure(EntityTypeBuilder<DSRRate> builder)
    {
        builder.ToTable("DSRRates");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Code).IsRequired().HasMaxLength(50);
        builder.Property(d => d.Description).IsRequired().HasMaxLength(1000);
        builder.Property(d => d.Unit).IsRequired().HasMaxLength(30);
        builder.Property(d => d.Rate).HasPrecision(18, 2);
        builder.Property(d => d.State).IsRequired().HasMaxLength(100);
        builder.Property(d => d.Category).IsRequired().HasMaxLength(100);
        builder.Property(d => d.Source).IsRequired().HasMaxLength(100);

        builder.HasIndex(d => new { d.State, d.Category });
        builder.HasIndex(d => d.Code);
        builder.HasIndex(d => d.IsActive);
    }
}

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications");
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Title).IsRequired().HasMaxLength(200);
        builder.Property(n => n.Message).IsRequired().HasMaxLength(1000);
        builder.Property(n => n.Type).IsRequired().HasMaxLength(50);
        builder.Property(n => n.ActionUrl).HasMaxLength(500);
        builder.Property(n => n.EntityType).HasMaxLength(50);

        builder.HasIndex(n => new { n.ContractorId, n.IsRead });
        builder.HasIndex(n => n.ContractorId);

        builder.HasOne(n => n.Contractor)
            .WithMany()
            .HasForeignKey(n => n.ContractorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
