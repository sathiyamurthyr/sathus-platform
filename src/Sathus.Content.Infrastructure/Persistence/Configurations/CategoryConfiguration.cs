namespace Sathus.Content.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Content.Domain.Entities;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(c => c.Slug)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(c => c.Description)
            .HasMaxLength(512);

        builder.HasIndex(c => c.Slug)
            .IsUnique();

        builder.HasMany(c => c.ContentItems)
            .WithOne(cc => cc.Category)
            .HasForeignKey(cc => cc.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
