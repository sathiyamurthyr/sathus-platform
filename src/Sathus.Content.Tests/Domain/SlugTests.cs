using FluentAssertions;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Exceptions;
using Sathus.Content.Domain.ValueObjects;
using Xunit;

namespace Sathus.Content.Tests.Domain;

public class SlugTests
{
    [Fact]
    public void Create_FromLowercase_ReturnsSameValue()
    {
        var slug = Slug.Create("hello-world");

        slug.Value.Should().Be("hello-world");
    }

    [Fact]
    public void Create_FromSpaces_ConvertsToHyphens()
    {
        var slug = Slug.Create("hello world test");

        slug.Value.Should().Be("hello-world-test");
    }

    [Fact]
    public void Create_RemovesSpecialCharacters()
    {
        var slug = Slug.Create("hello!@#$%world");

        slug.Value.Should().Be("helloworld");
    }

    [Fact]
    public void Create_Empty_ThrowsArgumentException()
    {
        var act = () => Slug.Create("");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_TooLong_TruncatesTo256()
    {
        var longString = new string('a', 300);
        var slug = Slug.Create(longString);

        slug.Value.Length.Should().Be(256);
    }
}
