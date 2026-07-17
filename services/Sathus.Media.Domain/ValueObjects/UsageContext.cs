namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Describes where a media asset is consumed across Sathus products. Supports the
/// current surfaces (website, products, blog, docs, learning, trust, AI knowledge)
/// and is open for future extensions via <see cref="FromName"/>.
/// </summary>
public sealed record UsageContext
{
    public string Value { get; }

    public const string WebsiteValue = "website";
    public const string ProductsValue = "products";
    public const string BlogValue = "blog";
    public const string DocumentationValue = "documentation";
    public const string LearningCenterValue = "learning-center";
    public const string TrustCenterValue = "trust-center";
    public const string AiKnowledgeBaseValue = "ai-knowledge-base";

    public static readonly UsageContext Website = new(WebsiteValue);
    public static readonly UsageContext Products = new(ProductsValue);
    public static readonly UsageContext Blog = new(BlogValue);
    public static readonly UsageContext Documentation = new(DocumentationValue);
    public static readonly UsageContext LearningCenter = new(LearningCenterValue);
    public static readonly UsageContext TrustCenter = new(TrustCenterValue);
    public static readonly UsageContext AiKnowledgeBase = new(AiKnowledgeBaseValue);

    public static IReadOnlyList<UsageContext> Supported { get; } =
        new[] { Website, Products, Blog, Documentation, LearningCenter, TrustCenter, AiKnowledgeBase };

    private UsageContext(string value) => Value = value;

    public static UsageContext Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Usage context is required.", nameof(value));
        }

        return FromName(value);
    }

    public static UsageContext FromName(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        return normalized switch
        {
            WebsiteValue => Website,
            ProductsValue => Products,
            BlogValue => Blog,
            DocumentationValue => Documentation,
            LearningCenterValue => LearningCenter,
            TrustCenterValue => TrustCenter,
            AiKnowledgeBaseValue => AiKnowledgeBase,
            _ => new UsageContext(normalized)
        };
    }

    public override string ToString() => Value;
}
