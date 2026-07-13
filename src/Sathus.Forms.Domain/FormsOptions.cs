namespace Sathus.Forms.Domain;

public sealed record FormsOptions
{
    public string? DefaultLocale { get; set; }
    public bool EnableWorkflows { get; set; } = true;
    public bool EnableVersioning { get; set; } = true;
}
