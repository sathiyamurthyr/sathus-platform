using MediatR;
using Sathus.Processing.Application.DTOs;

namespace Sathus.Processing.Application.Commands.RetryProcessing;

public sealed record RetryProcessingCommand(Guid AssetId)
    : IRequest<RetryProcessingResponse>;
