using System.Text.Json;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.Events;
using Sathus.Forms.Domain.Exceptions;
using Sathus.Forms.Domain.ValueObjects;

namespace Sathus.Forms.Domain.Entities;

/// <summary>
/// A no-code form definition. Owns its live editable structure (sections &rarr; fields &rarr;
/// options/validation rules) and a history of immutable <see cref="FormVersion"/> snapshots.
/// Supports draft/edit/publish/archive lifecycle plus rollback to any past version.
/// </summary>
public sealed class Form : AggregateRoot
{
    public string Key { get; private set; } = string.Empty;

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public string Category { get; private set; } = "General";

    public FormStatus Status { get; private set; } = FormStatus.Draft;

    public Guid? CurrentVersionId { get; private set; }

    public Guid? PublishedVersionId { get; private set; }

    public int VersionCounter { get; private set; }

    public ICollection<FormSection> Sections { get; } = new List<FormSection>();

    public ICollection<FormVersion> Versions { get; } = new List<FormVersion>();

    public FormId FormId => new(Id);

    private Form()
    {
    }

    public static Form Create(
        string key,
        string title,
        string? description = null,
        string? category = null,
        Guid? createdBy = null)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ArgumentException("Form key is required.", nameof(key));
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Form title is required.", nameof(title));
        }

        return new Form
        {
            Id = Guid.NewGuid(),
            Key = key.Trim(),
            Title = title.Trim(),
            Description = description?.Trim() switch { "" => null, var v => v },
            Category = (category ?? "General").Trim(),
            Status = FormStatus.Draft,
            VersionCounter = 0,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Rename(string title, Guid? updatedBy)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Form title is required.", nameof(title));
        }

        Title = title.Trim();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetDescription(string? description, Guid? updatedBy)
    {
        Description = description?.Trim() switch { "" => null, var v => v };
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetCategory(string category, Guid? updatedBy)
    {
        Category = (category ?? "General").Trim();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void Archive(Guid? actorId)
    {
        if (Status == FormStatus.Archived)
        {
            return;
        }

        Status = FormStatus.Archived;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        AddDomainEvent(new FormArchivedEvent(Id));
    }

    public void Restore(Guid? actorId)
    {
        if (Status != FormStatus.Archived)
        {
            return;
        }

        Status = PublishedVersionId.HasValue ? FormStatus.Published : FormStatus.Draft;
        SetUpdateAudit(actorId, DateTime.UtcNow);
    }

    // ----- Section management -----

    public FormSection AddSection(
        string key,
        string title,
        string? description = null,
        bool collapsible = false,
        Guid? createdBy = null)
    {
        if (Status == FormStatus.Published)
        {
            throw new FormInvalidOperationException("Cannot modify a published form. Create a new version first.");
        }

        var order = Sections.Count == 0 ? 0 : Sections.Max(s => s.Order) + 1;
        var section = FormSection.Create(Id, key, title, order, description, collapsible, createdBy);
        Sections.Add(section);
        SetUpdateAudit(createdBy, DateTime.UtcNow);
        AddDomainEvent(new FormSectionCreatedEvent(Id, section.Id));
        return section;
    }

    public void UpdateSection(Guid sectionId, string title, string? description, bool collapsible, Guid? updatedBy)
    {
        var section = GetSection(sectionId) ?? throw new FormSectionNotFoundException(sectionId);
        section.Update(title, description, collapsible, updatedBy);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void RemoveSection(Guid sectionId, Guid? updatedBy)
    {
        if (Status == FormStatus.Published)
        {
            throw new FormInvalidOperationException("Cannot modify a published form. Create a new version first.");
        }

        var section = GetSection(sectionId) ?? throw new FormSectionNotFoundException(sectionId);
        Sections.Remove(section);
        ReindexSections();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void ReorderSection(Guid sectionId, int newOrder, Guid? updatedBy)
    {
        var section = GetSection(sectionId) ?? throw new FormSectionNotFoundException(sectionId);
        section.SetOrder(newOrder);
        ReindexSections();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    // ----- Field management -----

    public FormField AddField(
        Guid sectionId,
        string key,
        string label,
        FieldType type,
        string? placeholder = null,
        string? helpText = null,
        string? defaultValue = null,
        bool isRequired = false,
        int width = 12,
        Enums.ReferenceKind referenceKind = Enums.ReferenceKind.None,
        Guid? referenceId = null,
        Guid? createdBy = null)
    {
        if (Status == FormStatus.Published)
        {
            throw new FormInvalidOperationException("Cannot modify a published form. Create a new version first.");
        }

        var section = GetSection(sectionId) ?? throw new FormSectionNotFoundException(sectionId);
        var order = section.Fields.Count == 0 ? 0 : section.Fields.Max(f => f.Order) + 1;
        var field = section.AddField(key, label, type, order, placeholder, helpText,
            defaultValue, isRequired, width, referenceKind, referenceId, createdBy);
        SetUpdateAudit(createdBy, DateTime.UtcNow);
        AddDomainEvent(new FormFieldCreatedEvent(Id, sectionId, field.Id));
        return field;
    }

    public void UpdateField(Guid fieldId, string label, FieldType type, string? placeholder,
        string? helpText, string? defaultValue, bool isRequired, int width,
        Enums.ReferenceKind referenceKind, Guid? referenceId, Guid? updatedBy)
    {
        var (section, field) = FindField(fieldId);
        field.Update(label, type, placeholder, helpText, defaultValue, isRequired, width, referenceKind, referenceId, updatedBy);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public FormField DuplicateField(Guid fieldId, Guid? updatedBy)
    {
        if (Status == FormStatus.Published)
        {
            throw new FormInvalidOperationException("Cannot modify a published form. Create a new version first.");
        }

        var (section, source) = FindField(fieldId);
        var copy = section.AddField(
            $"{source.Key}_copy_{Guid.NewGuid().ToString("N")[..6]}",
            $"{source.Label} (copy)",
            source.Type,
            source.Order + 1,
            source.Placeholder,
            source.HelpText,
            source.DefaultValue,
            source.IsRequired,
            source.Width,
            source.ReferenceKind,
            source.ReferenceId,
            updatedBy);

        foreach (var option in source.Options.OrderBy(o => o.Order))
        {
            copy.AddOption(option.Value, option.Label, option.Order);
        }

        foreach (var rule in source.ValidationRules)
        {
            copy.AddValidationRule(rule.Type, rule.Value, rule.Message);
        }

        var condition = source.GetVisibilityCondition();
        if (condition is not null)
        {
            copy.SetVisibilityCondition(condition, updatedBy);
        }

        // Shift subsequent fields down to make room for the copy.
        foreach (var f in section.Fields.Where(f => f.Id != copy.Id && f.Order > source.Order))
        {
            f.SetOrder(f.Order + 1);
        }

        copy.SetOrder(source.Order + 1);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        return copy;
    }

    public void RemoveField(Guid fieldId, Guid? updatedBy)
    {
        if (Status == FormStatus.Published)
        {
            throw new FormInvalidOperationException("Cannot modify a published form. Create a new version first.");
        }

        var (section, field) = FindField(fieldId);
        section.Fields.Remove(field);
        ReindexFields(section);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void ReorderField(Guid fieldId, int newOrder, Guid? updatedBy)
    {
        var (section, field) = FindField(fieldId);
        field.SetOrder(newOrder);
        ReindexFields(section);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void MoveField(Guid fieldId, Guid toSectionId, int newOrder, Guid? updatedBy)
    {
        if (Status == FormStatus.Published)
        {
            throw new FormInvalidOperationException("Cannot modify a published form. Create a new version first.");
        }

        var (fromSection, field) = FindField(fieldId);
        var toSection = GetSection(toSectionId) ?? throw new FormSectionNotFoundException(toSectionId);
        fromSection.Fields.Remove(field);
        field.SectionId = toSectionId;
        field.SetOrder(newOrder);
        toSection.Fields.Add(field);
        ReindexFields(fromSection);
        ReindexFields(toSection);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    // ----- Versioning -----

    public FormVersion CreateVersion(string? label, Guid? actorId)
    {
        var snapshot = BuildSnapshot();
        var version = FormVersion.Create(Id, ++VersionCounter, label ?? $"v{VersionCounter}", snapshot, actorId);
        Versions.Add(version);
        foreach (var existing in Versions)
        {
            existing.MarkCurrent(existing.Id == version.Id);
        }

        CurrentVersionId = version.Id;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        return version;
    }

    public void Publish(Guid versionId, Guid? actorId)
    {
        var version = Versions.FirstOrDefault(v => v.Id == versionId)
            ?? throw new FormVersionNotFoundException(versionId);

        version.MarkPublished(DateTime.UtcNow, actorId);
        foreach (var other in Versions.Where(v => v.Id != version.Id))
        {
            other.MarkCurrent(false);
        }

        version.MarkCurrent(true);
        Status = FormStatus.Published;
        CurrentVersionId = version.Id;
        PublishedVersionId = version.Id;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        AddDomainEvent(new FormPublishedEvent(Id, version.Id));
    }

    public FormVersion Rollback(Guid toVersionId, Guid? actorId)
    {
        var target = Versions.FirstOrDefault(v => v.Id == toVersionId)
            ?? throw new FormVersionNotFoundException(toVersionId);

        if (PublishedVersionId is null)
        {
            throw new FormInvalidOperationException("Cannot rollback a form that has never been published.");
        }

        RebuildFromSnapshot(target.Snapshot);
        Status = FormStatus.Draft;
        CurrentVersionId = target.Id;
        PublishedVersionId = null;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        AddDomainEvent(new FormRolledBackEvent(Id, target.Id));
        return target;
    }

    // ----- Helpers -----

    public FormSection? GetSection(Guid sectionId) => Sections.FirstOrDefault(s => s.Id == sectionId);

    public (FormSection Section, FormField Field) FindField(Guid fieldId)
    {
        foreach (var section in Sections)
        {
            var field = section.Fields.FirstOrDefault(f => f.Id == fieldId);
            if (field is not null)
            {
                return (section, field);
            }
        }

        throw new FormFieldNotFoundException(fieldId);
    }

    public void ReindexSections()
    {
        var ordered = Sections.OrderBy(s => s.Order).ToList();
        for (var i = 0; i < ordered.Count; i++)
        {
            ordered[i].SetOrder(i);
        }
    }

    public void ReindexFields(FormSection section)
    {
        var ordered = section.Fields.OrderBy(f => f.Order).ToList();
        for (var i = 0; i < ordered.Count; i++)
        {
            ordered[i].SetOrder(i);
        }
    }

    public string BuildSnapshot()
    {
        var flat = new List<SnapshotSection>();
        foreach (var section in Sections.OrderBy(s => s.Order))
        {
            flat.Add(new SnapshotSection
            {
                Id = section.Id,
                Key = section.Key,
                Title = section.Title,
                Description = section.Description,
                Order = section.Order,
                Collapsible = section.Collapsible,
                IsVisible = section.IsVisible,
                VisibilityConditionJson = section.VisibilityConditionJson,
                Fields = section.Fields.OrderBy(f => f.Order).Select(f => new SnapshotField
                {
                    Id = f.Id,
                    Key = f.Key,
                    Label = f.Label,
                    Type = f.Type,
                    Placeholder = f.Placeholder,
                    HelpText = f.HelpText,
                    DefaultValue = f.DefaultValue,
                    IsRequired = f.IsRequired,
                    Order = f.Order,
                    Width = f.Width,
                    ReferenceKind = f.ReferenceKind,
                    ReferenceId = f.ReferenceId,
                    VisibilityConditionJson = f.VisibilityConditionJson,
                    Options = f.Options.OrderBy(o => o.Order).Select(o => new SnapshotOption(o.Value, o.Label, o.Order)).ToList(),
                    ValidationRules = f.ValidationRules.Select(r => new SnapshotValidationRule(r.Type, r.Value, r.Message)).ToList()
                }).ToList()
            });
        }

        return JsonSerializer.Serialize(flat);
    }

    public void RebuildFromSnapshot(string snapshot)
    {
        var flat = JsonSerializer.Deserialize<List<SnapshotSection>>(snapshot) ?? new List<SnapshotSection>();
        Sections.Clear();
        foreach (var s in flat)
        {
            var section = FormSection.Create(Id, s.Key, s.Title, s.Order, s.Description, s.Collapsible);
            section.SetVisibility(s.IsVisible);
            if (s.VisibilityConditionJson is not null)
            {
                section.SetVisibilityCondition(JsonSerializer.Deserialize<VisibilityCondition>(s.VisibilityConditionJson), null);
            }

            foreach (var f in s.Fields)
            {
                var field = section.AddField(f.Key, f.Label, f.Type, f.Order, f.Placeholder, f.HelpText,
                    f.DefaultValue, f.IsRequired, f.Width, f.ReferenceKind, f.ReferenceId);
                foreach (var o in f.Options)
                {
                    field.AddOption(o.Value, o.Label, o.Order);
                }

                foreach (var r in f.ValidationRules)
                {
                    field.AddValidationRule(r.Type, r.Value, r.Message);
                }

                if (f.VisibilityConditionJson is not null)
                {
                    field.SetVisibilityCondition(JsonSerializer.Deserialize<VisibilityCondition>(f.VisibilityConditionJson), null);
                }
            }

            Sections.Add(section);
        }
    }

    private sealed class SnapshotSection
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public bool Collapsible { get; set; }
        public bool IsVisible { get; set; } = true;
        public string? VisibilityConditionJson { get; set; }
        public List<SnapshotField> Fields { get; set; } = new();
    }

    private sealed class SnapshotField
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public FieldType Type { get; set; }
        public string? Placeholder { get; set; }
        public string? HelpText { get; set; }
        public string? DefaultValue { get; set; }
        public bool IsRequired { get; set; }
        public int Order { get; set; }
        public int Width { get; set; } = 12;
        public Enums.ReferenceKind ReferenceKind { get; set; }
        public Guid? ReferenceId { get; set; }
        public string? VisibilityConditionJson { get; set; }
        public List<SnapshotOption> Options { get; set; } = new();
        public List<SnapshotValidationRule> ValidationRules { get; set; } = new();
    }

    private sealed record SnapshotOption(string Value, string Label, int Order);

    private sealed record SnapshotValidationRule(ValidationRuleType Type, string? Value, string? Message);
}
