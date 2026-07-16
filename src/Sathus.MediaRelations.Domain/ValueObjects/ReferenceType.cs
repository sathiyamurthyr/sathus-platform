namespace Sathus.MediaRelations.Domain.ValueObjects;

/// <summary>
/// Describes the type of content (module surface) that references an asset. Ships with
/// the currently supported surfaces but is intentionally open for future modules via
/// <see cref="Create"/>/<see cref="FromName"/>. No hardcoded per-module behaviour is applied.
/// </summary>
public sealed record ReferenceType
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 128;

    public const string PageValue = "page";
    public const string ProductValue = "product";
    public const string BlogValue = "blog";
    public const string DocumentationValue = "documentation";
    public const string LearningValue = "learning";
    public const string TrustCenterValue = "trust-center";
    public const string CareersValue = "careers";
    public const string NavigationValue = "navigation";
    public const string EmailTemplateValue = "email-template";
    public const string AiKnowledgeBaseValue = "ai-knowledge-base";

    public static readonly ReferenceType Page = new(PageValue);
    public static readonly ReferenceType Product = new(ProductValue);
    public static readonly ReferenceType Blog = new(BlogValue);
    public static readonly ReferenceType Documentation = new(DocumentationValue);
    public static readonly ReferenceType Learning = new(LearningValue);
    public static readonly ReferenceType TrustCenter = new(TrustCenterValue);
    public static readonly ReferenceType Careers = new(CareersValue);
    public static readonly ReferenceType Navigation = new(NavigationValue);
    public static readonly ReferenceType EmailTemplate = new(EmailTemplateValue);
    public static readonly ReferenceType AiKnowledgeBase = new(AiKnowledgeBaseValue);

    /// <summary>Well-known surfaces. New modules simply create their own value.</summary>
    public static IReadOnlyList<ReferenceType> Supported { get; } = new[]
    {
        Page, Product, Blog, Documentation, Learning,
        TrustCenter, Careers, Navigation, EmailTemplate, AiKnowledgeBase
    };

    public ReferenceType()
    {
    }

    private ReferenceType(string value) => Value = value;

    public static ReferenceType Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Reference type is required.", nameof(value));
        }

        return FromName(value);
    }

    public static ReferenceType FromName(string value)
    {
        var normalized = Normalize(value);
        if (normalized.Length > MaxLength)
        {
            throw new ArgumentException($"Reference type must be at most {MaxLength} characters.", nameof(value));
        }

        return normalized switch
        {
            PageValue => new ReferenceType(normalized),
            ProductValue => new ReferenceType(normalized),
            BlogValue => new ReferenceType(normalized),
            DocumentationValue => new ReferenceType(normalized),
            LearningValue => new ReferenceType(normalized),
            TrustCenterValue => new ReferenceType(normalized),
            CareersValue => new ReferenceType(normalized),
            NavigationValue => new ReferenceType(normalized),
            EmailTemplateValue => new ReferenceType(normalized),
            AiKnowledgeBaseValue => new ReferenceType(normalized),
            _ => new ReferenceType(normalized)
        };
    }

    private static string Normalize(string value) => value.Trim().ToLowerInvariant();

    public bool IsWellKnown => Supported.Any(t => t.Value == Value);

    public override string ToString() => Value;
}
