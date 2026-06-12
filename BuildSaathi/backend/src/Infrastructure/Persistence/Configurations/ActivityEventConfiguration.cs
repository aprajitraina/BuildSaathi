using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class ActivityEventConfiguration : IEntityTypeConfiguration<ActivityEvent>
{
    public void Configure(EntityTypeBuilder<ActivityEvent> builder)
    {
        builder.ToTable("ActivityEvents");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.EventType).IsRequired().HasMaxLength(64);
        builder.Property(a => a.Description).IsRequired().HasMaxLength(500);
        builder.Property(a => a.EntityType).IsRequired().HasMaxLength(64);
        builder.Property(a => a.MetadataJson).HasMaxLength(2000);

        builder.HasIndex(a => new { a.ContractorId, a.CreatedAt });
        builder.HasIndex(a => new { a.ContractorId, a.EventType });
        builder.HasIndex(a => new { a.EntityType, a.EntityId });
    }
}
