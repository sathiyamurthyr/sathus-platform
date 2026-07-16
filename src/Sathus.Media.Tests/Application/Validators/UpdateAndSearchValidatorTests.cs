using FluentValidation.TestHelper;
using Sathus.Media.Application.Commands.UpdateMediaMetadata;
using Sathus.Media.Application.Queries.SearchMedia;
using Sathus.Media.Application.Validators;

namespace Sathus.Media.Tests.Application.Validators;

public class UpdateAndSearchValidatorTests
{
    [Fact]
    public void UpdateMetadata_EmptyId_Fails()
    {
        var validator = new UpdateMediaMetadataCommandValidator();
        validator.TestValidate(new UpdateMediaMetadataCommand(Guid.Empty))
            .ShouldHaveValidationErrorFor(x => x.Id);
    }

    [Fact]
    public void UpdateMetadata_BadLanguage_Fails()
    {
        var validator = new UpdateMediaMetadataCommandValidator();
        validator.TestValidate(new UpdateMediaMetadataCommand(Guid.NewGuid(), Language: "english"))
            .ShouldHaveValidationErrorFor(x => x.Language);
    }

    [Fact]
    public void Search_InvalidPage_Fails()
    {
        var validator = new SearchMediaQueryValidator();
        validator.TestValidate(new SearchMediaQuery { Page = 0 })
            .ShouldHaveValidationErrorFor(x => x.Page);
    }

    [Fact]
    public void Search_InvalidPageSize_Fails()
    {
        var validator = new SearchMediaQueryValidator();
        validator.TestValidate(new SearchMediaQuery { PageSize = 500 })
            .ShouldHaveValidationErrorFor(x => x.PageSize);
    }

    [Fact]
    public void Search_FutureType_Passes()
    {
        var validator = new SearchMediaQueryValidator();
        validator.TestValidate(new SearchMediaQuery { Types = new[] { "hologram" } })
            .ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Search_ValidPasses()
    {
        var validator = new SearchMediaQueryValidator();
        validator.TestValidate(new SearchMediaQuery { Term = "cat", Types = new[] { "image" }, PageSize = 10 })
            .ShouldNotHaveAnyValidationErrors();
    }
}
