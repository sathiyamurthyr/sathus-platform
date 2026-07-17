using FluentValidation.TestHelper;
using Sathus.Media.Application.Commands.CreateMediaAsset;
using Sathus.Media.Application.Validators;

namespace Sathus.Media.Tests.Application.Validators;

public class CreateMediaAssetCommandValidatorTests
{
    private readonly CreateMediaAssetCommandValidator _validator = new();

    private static CreateMediaAssetCommand Valid(string type = "image", int? w = 1, int? h = 1, double? d = null) =>
        new("photo.png", "png", "image/png", 1024, "sha256:abc", "images/photo.png", type, "en",
            Width: w, Height: h, DurationSeconds: d);

    [Fact]
    public void ValidCommand_Passes()
    {
        _validator.TestValidate(Valid()).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void MissingFileName_Fails()
    {
        _validator.TestValidate(Valid() with { FileName = "" }).ShouldHaveValidationErrorFor(x => x.FileName);
    }

    [Fact]
    public void BadMimeType_Fails()
    {
        _validator.TestValidate(Valid() with { MimeType = "invalid" }).ShouldHaveValidationErrorFor(x => x.MimeType);
    }

    [Fact]
    public void ZeroSize_Fails()
    {
        _validator.TestValidate(Valid() with { Size = 0 }).ShouldHaveValidationErrorFor(x => x.Size);
    }

    [Fact]
    public void BadChecksum_Fails()
    {
        _validator.TestValidate(Valid() with { Checksum = "nohash" }).ShouldHaveValidationErrorFor(x => x.Checksum);
    }

    [Fact]
    public void UnknownFutureType_Passes()
    {
        _validator.TestValidate(Valid(type: "hologram")).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void ImageWithoutDimensions_Fails()
    {
        _validator.TestValidate(Valid(w: null, h: null)).ShouldHaveValidationErrorFor(x => x);
    }

    [Fact]
    public void AudioWithoutDuration_Fails()
    {
        _validator.TestValidate(Valid(type: "audio", w: null, h: null)).ShouldHaveValidationErrorFor(x => x);
    }

    [Fact]
    public void InvalidInitialStatus_Fails()
    {
        _validator.TestValidate(Valid() with { InitialStatus = "Archived" }).ShouldHaveValidationErrorFor(x => x.InitialStatus);
    }
}
