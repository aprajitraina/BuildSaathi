using BuildSaathi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildSaathi.Infrastructure.Persistence.Configurations;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("Documents");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.FileName).IsRequired().HasMaxLength(300);
        builder.Property(d => d.OriginalFileName).IsRequired().HasMaxLength(300);
        builder.Property(d => d.ContentType).IsRequired().HasMaxLength(100);
        builder.Property(d => d.StorageKey).IsRequired().HasMaxLength(500);
        builder.Property(d => d.DocumentType).IsRequired().HasMaxLength(50);
        builder.Property(d => d.EntityType).HasMaxLength(50);
        builder.Property(d => d.Tags).HasMaxLength(500);

        builder.HasIndex(d => d.ContractorId);
        builder.HasIndex(d => new { d.ContractorId, d.EntityType, d.EntityId });

        builder.HasOne(d => d.Contractor)
            .WithMany()
            .HasForeignKey(d => d.ContractorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
