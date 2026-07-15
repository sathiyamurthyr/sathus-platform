using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Infrastructure.Persistence.Configurations;

public sealed class SearchIndexConfiguration : IEntityTypeConfiguration<SearchIndex>
{
    public void Configure(EntityTypeBuilder<SearchIndex> builder)
    {
        builder.ToTable("indexes", "search");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Name).HasMaxLength(256).IsRequired();
        builder.Property(i => i.Code).HasMaxLength(128).IsRequired();
        builder.Property(i => i.IsEnabled).IsRequired();
        builder.Property(i => i.IsRebuilding).IsRequired();
        builder.Property(i => i.LastBuiltAt);
        builder.Property(i => i.Settings).HasColumnType("jsonb").IsRequired();
        builder.HasQueryFilter(i => !i.IsDeleted);
        builder.HasIndex(i => i.Code).IsUnique();
        builder.HasMany(i => i.Fields).WithOne().HasForeignKey(f => f.IndexId);
        builder.HasMany(i => i.Facets).WithOne().HasForeignKey(f => f.IndexId);
        builder.HasMany(i => i.Synonyms).WithOne().HasForeignKey(s => s.IndexId);
        builder.HasMany(i => i.Rankings).WithOne().HasForeignKey(r => r.IndexId);
        builder.HasMany(i => i.Highlights).WithOne().HasForeignKey(h => h.IndexId);
    }
}

public sealed class SearchDocumentConfiguration : IEntityTypeConfiguration<SearchDocument>
{
    public void Configure(EntityTypeBuilder<SearchDocument> builder)
    {
        builder.ToTable("documents", "search");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.IndexId).IsRequired();
        builder.Property(d => d.ExternalId).HasMaxLength(256).IsRequired();
        builder.Property(d => d.SourceType).HasConversion<string>().IsRequired();
        builder.Property(d => d.Status).HasConversion<string>().IsRequired();
        builder.Property(d => d.Title).HasMaxLength(1024).IsRequired();
        builder.Property(d => d.Content).HasColumnType("text").IsRequired();
        builder.Property(d => d.Url).HasMaxLength(2048);
        builder.Property(d => d.ImageUrl).HasMaxLength(2048);
        builder.Property(d => d.AuthorId);
        builder.Property(d => d.AuthorName).HasMaxLength(256);
        builder.Property(d => d.Language).HasMaxLength(10).IsRequired();
        builder.Property(d => d.IsFeatured).IsRequired();
        builder.Property(d => d.Score)
            .HasConversion(
                s => s.Value,
                v => new SearchScore(v))
            .HasColumnName("score");
        builder.Property(d => d.Metadata).HasColumnType("jsonb").IsRequired();
        builder.Property(d => d.IndexedAt).IsRequired();
        builder.Property(d => d.PublishedAt);
        builder.Property(d => d.ExpiresAt);
        builder.Property(d => d.PermissionScope).HasConversion<string>().IsRequired();
        builder.Property(d => d.RequiredRoles).HasColumnType("text");
        builder.Property(d => d.AllowedUsers).HasColumnType("text");
        builder.HasQueryFilter(d => !d.IsDeleted);
        builder.HasIndex(d => new { d.ExternalId, d.SourceType });
        builder.HasIndex(d => d.IndexId);
        builder.HasIndex(d => d.Status);
    }
}

public sealed class SearchFieldConfiguration : IEntityTypeConfiguration<SearchField>
{
    public void Configure(EntityTypeBuilder<SearchField> builder)
    {
        builder.ToTable("fields", "search");
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id).HasConversion(
            v => v.Value,
            v => new SearchFieldId(v));
        builder.Property(f => f.IndexId).IsRequired();
        builder.Property(f => f.Name).HasMaxLength(256).IsRequired();
        builder.Property(f => f.FieldType).HasConversion<string>().IsRequired();
        builder.Property(f => f.Properties).HasColumnType("jsonb");
        builder.HasQueryFilter(f => !f.IsDeleted);
        builder.HasIndex(f => new { f.IndexId, f.Name }).IsUnique();
    }
}

public sealed class SearchFacetConfiguration : IEntityTypeConfiguration<SearchFacet>
{
    public void Configure(EntityTypeBuilder<SearchFacet> builder)
    {
        builder.ToTable("facets", "search");
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id).HasConversion(
            v => v.Value,
            v => new SearchFacetId(v));
        builder.Property(f => f.IndexId).IsRequired();
        builder.Property(f => f.Name).HasMaxLength(256).IsRequired();
        builder.Property(f => f.FieldName).HasMaxLength(256).IsRequired();
        builder.Property(f => f.FacetType).HasConversion<string>().IsRequired();
        builder.Property(f => f.Settings).HasColumnType("jsonb");
        builder.HasQueryFilter(f => !f.IsDeleted);
        builder.HasIndex(f => new { f.IndexId, f.FieldName });
    }
}

public sealed class SearchSynonymConfiguration : IEntityTypeConfiguration<SearchSynonym>
{
    public void Configure(EntityTypeBuilder<SearchSynonym> builder)
    {
        builder.ToTable("synonyms", "search");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasConversion(
            v => v.Value,
            v => new SearchSynonymId(v));
        builder.Property(s => s.IndexId).IsRequired();
        builder.Property(s => s.From).HasMaxLength(256).IsRequired();
        builder.Property(s => s.To).HasMaxLength(256).IsRequired();
        builder.HasQueryFilter(s => !s.IsDeleted);
        builder.HasIndex(s => new { s.IndexId, s.From }).IsUnique();
    }
}

public sealed class SearchRankingConfiguration : IEntityTypeConfiguration<SearchRanking>
{
    public void Configure(EntityTypeBuilder<SearchRanking> builder)
    {
        builder.ToTable("rankings", "search");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasConversion(
            v => v.Value,
            v => new SearchRankingId(v));
        builder.Property(r => r.IndexId).IsRequired();
        builder.Property(r => r.Name).HasMaxLength(256).IsRequired();
        builder.Property(r => r.Query).HasMaxLength(1024).IsRequired();
        builder.Property(r => r.Boost).IsRequired();
        builder.HasQueryFilter(r => !r.IsDeleted);
        builder.HasIndex(r => new { r.IndexId, r.Name });
    }
}

public sealed class SearchSuggestionConfiguration : IEntityTypeConfiguration<SearchSuggestion>
{
    public void Configure(EntityTypeBuilder<SearchSuggestion> builder)
    {
        builder.ToTable("search_suggestions", "search");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasConversion(
            v => v.Value,
            v => new SearchSuggestionId(v));
        builder.Property(s => s.IndexId).IsRequired();
        builder.Property(s => s.Text).HasMaxLength(256).IsRequired();
        builder.HasQueryFilter(s => !s.IsDeleted);
        builder.HasIndex(s => new { s.IndexId, s.Text });
    }
}

public sealed class SearchHighlightConfiguration : IEntityTypeConfiguration<SearchHighlight>
{
    public void Configure(EntityTypeBuilder<SearchHighlight> builder)
    {
        builder.ToTable("highlights", "search");
        builder.HasKey(h => h.Id);
        builder.Property(h => h.Id).HasConversion(
            v => v.Value,
            v => new SearchHighlightId(v));
        builder.Property(h => h.IndexId).IsRequired();
        builder.Property(h => h.FieldName).HasMaxLength(256).IsRequired();
        builder.Property(h => h.Options).HasColumnType("jsonb");
        builder.HasQueryFilter(h => !h.IsDeleted);
        builder.HasIndex(h => new { h.IndexId, h.FieldName }).IsUnique();
    }
}
