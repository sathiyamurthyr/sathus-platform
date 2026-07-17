global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.SharedKernel.Specifications;

namespace Sathus.Search.Tests.SharedKernel;

public class SpecificationTests
{
    private sealed class TestSpecification : Specification<SearchIndex>
    {
        public TestSpecification()
        {
            AddCriteria(i => i.IsEnabled);
            AddInclude(i => i.Fields);
            AddInclude("Facets");
            ApplyOrderBy(i => i.Name);
            ApplyOrderByDescending(i => i.Code);
            ApplyGroupBy(i => i.Code);
            ApplyPaging(5, 10);
            AsNoTracking = false;
        }
    }

    [Fact]
    public void Criteria_Should_Be_Set_By_AddCriteria()
    {
        var spec = new TestSpecification();
        var enabled = SearchIndex.Create(Guid.NewGuid(), "Enabled", "EN");
        var disabled = SearchIndex.Create(Guid.NewGuid(), "Disabled", "DI");
        disabled.Disable();

        spec.Criteria.Should().NotBeNull();
        var compiled = spec.Criteria!.Compile();
        compiled(enabled).Should().BeTrue();
        compiled(disabled).Should().BeFalse();
    }

    [Fact]
    public void Includes_Should_Contain_Added_Includes()
    {
        var spec = new TestSpecification();

        spec.Includes.Should().HaveCount(1);
        spec.IncludeStrings.Should().ContainSingle().Which.Should().Be("Facets");
    }

    [Fact]
    public void Ordering_Should_Be_Set()
    {
        var spec = new TestSpecification();

        spec.OrderByDescending.Should().NotBeNull();
    }

    [Fact]
    public void GroupBy_Should_Be_Set()
    {
        var spec = new TestSpecification();

        spec.GroupBy.Should().NotBeNull();
    }

    [Fact]
    public void Paging_Should_Be_Set()
    {
        var spec = new TestSpecification();

        spec.Take.Should().Be(10);
        spec.Skip.Should().Be(5);
        spec.IsPagingEnabled.Should().BeTrue();
    }

    [Fact]
    public void AsNoTracking_Should_Be_Set()
    {
        var spec = new TestSpecification();

        spec.AsNoTracking.Should().BeFalse();
    }
}
