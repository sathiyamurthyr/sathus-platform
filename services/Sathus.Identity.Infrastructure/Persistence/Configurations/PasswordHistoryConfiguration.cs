namespace Sathus.Identity.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Identity.Domain.Entities;

public class PasswordHistoryConfiguration : IEntityTypeConfiguration<PasswordHistory>
{
    public void Configure(EntityTypeBuilder<PasswordHistory> builder)
    {
        builder.ToTable("password_history");

        builder.HasKey(ph => ph.Id);

        builder.Property(ph => ph.UserId)
            .IsRequired();

        builder.Property(ph => ph.PasswordHash)
            .IsRequired();

        builder.Property(ph => ph.CreatedAt)
            .IsRequired();

        builder.HasIndex(ph => new { ph.UserId, ph.CreatedAt });

        builder.HasOne(ph => ph.User)
            .WithMany(u => u.PasswordHistory)
            .HasForeignKey(ph => ph.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
