namespace Sathus.MediaRelations.Domain.Enums;

/// <summary>
/// The kind of node participating in the usage/relationship graph. Assets and content
/// nodes are modelled uniformly so the graph can be traversed recursively.
/// </summary>
public enum GraphNodeType
{
    Asset = 0,
    Content = 1
}
