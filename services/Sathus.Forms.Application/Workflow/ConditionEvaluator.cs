using System.Collections.Generic;
using System.Globalization;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.ValueObjects;

namespace Sathus.Forms.Application.Workflow;

/// <summary>
/// Evaluates conditional visibility / workflow conditions against submitted form data.
/// Mirrors the pluggable rule evaluator used by other bounded contexts.
/// </summary>
public static class ConditionEvaluator
{
    public static bool Evaluate(VisibilityCondition? condition, IReadOnlyDictionary<string, object?> data)
    {
        if (condition is null)
        {
            return true;
        }

        var result = EvaluateSingle(condition, data);

        if (condition.Children is { Count: > 0 })
        {
            var combine = condition.Combinator == ConditionOperator.Or
                ? condition.Children.Any(c => EvaluateSingle(c, data))
                : condition.Children.All(c => EvaluateSingle(c, data));

            return condition.Combinator == ConditionOperator.Or ? (result || combine) : (result && combine);
        }

        return result;
    }

    private static bool EvaluateSingle(VisibilityCondition condition, IReadOnlyDictionary<string, object?> data)
    {
        if (!data.TryGetValue(condition.Field, out var raw))
        {
            raw = null;
        }

        var left = raw is null ? string.Empty : raw switch
        {
            bool b => b ? "true" : "false",
            _ => raw.ToString()
        };

        var right = condition.Value ?? string.Empty;

        return condition.Operator switch
        {
            OperatorType.Equals => string.Equals(left, right, StringComparison.OrdinalIgnoreCase),
            OperatorType.NotEquals => !string.Equals(left, right, StringComparison.OrdinalIgnoreCase),
            OperatorType.Contains => left.Contains(right, StringComparison.OrdinalIgnoreCase),
            OperatorType.GreaterThan => TryNumber(left) > TryNumber(right),
            OperatorType.LessThan => TryNumber(left) < TryNumber(right),
            OperatorType.IsEmpty => string.IsNullOrWhiteSpace(left),
            OperatorType.IsNotEmpty => !string.IsNullOrWhiteSpace(left),
            OperatorType.In => right.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Any(v => string.Equals(v, left, StringComparison.OrdinalIgnoreCase)),
            _ => true
        };
    }

    private static double TryNumber(string value) =>
        double.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var n) ? n : 0;
}
