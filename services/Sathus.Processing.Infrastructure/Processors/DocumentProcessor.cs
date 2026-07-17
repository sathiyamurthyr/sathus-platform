using System.IO.Compression;
using System.Text;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Infrastructure.Processors;

/// <summary>
/// Processes document assets (PDF, DOCX, PPTX, XLSX, TXT). Extracts page/slide/sheet
/// counts and core metadata from real container/structure parsing.
/// </summary>
public sealed class DocumentProcessor : IAssetProcessor
{
    private readonly ILogger<DocumentProcessor> _logger;

    public DocumentProcessor(ILogger<DocumentProcessor> logger)
    {
        _logger = logger;
    }

    public string Name => "DocumentProcessor";

    public bool CanProcess(MediaType mediaType) => mediaType.Value == MediaType.Document.Value;

    public async Task<ProcessorOutput> ProcessAsync(ProcessingContext context, CancellationToken cancellationToken = default)
    {
        var metadata = new Dictionary<string, string>();
        var bytes = await ProcessorSupport.ReadAllBytesAsync(context.Source, cancellationToken);
        var mime = context.MimeType.ToLowerInvariant();
        var extension = Path.GetExtension(context.FileName)?.ToLowerInvariant();

        if (mime.Contains("pdf") || extension == ".pdf" || (bytes.Length > 5 && Encoding.ASCII.GetString(bytes, 0, 5) == "%PDF-"))
        {
            ParsePdf(bytes, metadata);
        }
        else if (mime.Contains("officedocument") || extension is ".docx" or ".xlsx" or ".pptx")
        {
            ParseOoxml(bytes, extension, metadata);
        }
        else if (mime.Contains("text/plain") || extension == ".txt")
        {
            ParseText(bytes, metadata);
        }
        else
        {
            throw new UnsupportedAssetException($"Unsupported document format for asset '{context.FileName}'.");
        }

        return ProcessorOutput.Create(metadata, new List<Rendition>());
    }

    private static void ParsePdf(byte[] bytes, Dictionary<string, string> metadata)
    {
        metadata["format"] = "pdf";
        var text = Encoding.ASCII.GetString(bytes, 0, Math.Min(bytes.Length, 1_000_000));
        var pages = 0;
        const string marker = "/Page";
        var index = 0;
        while ((index = text.IndexOf(marker, index, StringComparison.Ordinal)) >= 0)
        {
            var after = index + marker.Length;
            if (after < text.Length && text[after] != 's') // skip "/Pages"
            {
                pages++;
            }

            index += marker.Length;
        }

        if (pages > 0)
        {
            metadata["pageCount"] = pages.ToString();
        }
    }

    private static void ParseOoxml(byte[] bytes, string? extension, Dictionary<string, string> metadata)
    {
        try
        {
            using var archive = new ZipArchive(new MemoryStream(bytes), ZipArchiveMode.Read, leaveOpen: false);

            var core = archive.GetEntry("docProps/core.xml");
            if (core is not null)
            {
                using var stream = core.Open();
                var doc = XDocument.Load(stream);
                var ns = doc.Root?.Name.Namespace;
                metadata["format"] = extension?.TrimStart('.') ?? "ooxml";
                metadata["title"] = doc.Root?.Element(ns + "title")?.Value ?? string.Empty;
                metadata["author"] = doc.Root?.Element(ns + "creator")?.Value ?? string.Empty;
                metadata["created"] = doc.Root?.Element(ns + "created")?.Value ?? string.Empty;
                metadata["modified"] = doc.Root?.Element(ns + "modified")?.Value ?? string.Empty;
            }

            switch (extension)
            {
                case ".pptx":
                    metadata["slideCount"] = archive.Entries.Count(e => e.FullName.StartsWith("ppt/slides/slide") && e.FullName.EndsWith(".xml")).ToString();
                    break;
                case ".xlsx":
                    metadata["sheetCount"] = archive.Entries.Count(e => e.FullName.StartsWith("xl/worksheets/sheet") && e.FullName.EndsWith(".xml")).ToString();
                    break;
                case ".docx":
                    var document = archive.GetEntry("word/document.xml");
                    if (document is not null)
                    {
                        metadata["hasBody"] = "true";
                    }

                    break;
            }
        }
        catch (Exception ex)
        {
            metadata["format"] = extension?.TrimStart('.') ?? "ooxml";
            metadata["parseError"] = ex.Message;
        }
    }

    private static void ParseText(byte[] bytes, Dictionary<string, string> metadata)
    {
        metadata["format"] = "txt";
        var text = Encoding.UTF8.GetString(bytes);
        metadata["byteSize"] = bytes.Length.ToString();
        metadata["lineCount"] = text.Split('\n').Length.ToString();
        metadata["wordCount"] = text.Split((char[])[' ', '\n', '\r', '\t'], StringSplitOptions.RemoveEmptyEntries).Length.ToString();
    }
}
