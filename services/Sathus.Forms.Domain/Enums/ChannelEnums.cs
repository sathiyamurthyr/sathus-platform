namespace Sathus.Forms.Domain.Enums;

/// <summary>Notification delivery channels for the automation engine.</summary>
public enum NotificationChannel
{
    Email = 0,
    Webhook = 1,
    Internal = 2,
    Sms = 3,
    Slack = 4
}

/// <summary>Kinds of external Sathus resources a Reference or Repeater field can point to.</summary>
public enum ReferenceKind
{
    None = 0,
    Content = 1,
    Product = 2,
    Blog = 3,
    Doc = 4,
    Page = 5,
    Media = 6,
    User = 7
}
