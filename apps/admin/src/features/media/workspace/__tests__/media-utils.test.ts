import { describe, expect, it } from 'vitest';
import { formatFileSize, formatDuration, formatDate, getMediaTypeFromMime, getFileExtension, generatePreviewUrl, getMimeTypeCategory } from '../lib/media-utils';

describe('media-utils', () => {
  it('formats file sizes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(5368709120)).toBe('5 GB');
  });

  it('formats durations correctly', () => {
    expect(formatDuration(undefined)).toBe('--:--');
    expect(formatDuration(0)).toBe('--:--');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('formats dates correctly', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('detects media type from mime', () => {
    expect(getMediaTypeFromMime('image/jpeg')).toBe('Image');
    expect(getMediaTypeFromMime('video/mp4')).toBe('Video');
    expect(getMediaTypeFromMime('audio/mpeg')).toBe('Audio');
    expect(getMediaTypeFromMime('application/pdf')).toBe('Document');
    expect(getMediaTypeFromMime('application/zip')).toBe('Archive');
    expect(getMediaTypeFromMime('application/octet-stream')).toBe('Other');
  });

  it('extracts file extension', () => {
    expect(getFileExtension('photo.jpg')).toBe('jpg');
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
    expect(getFileExtension('README')).toBe('');
  });

  it('generates preview URLs', () => {
    expect(generatePreviewUrl('key-123', 'image/png')).toBe('/api/v1/media/preview/key-123');
    expect(generatePreviewUrl('key-456', 'video/mp4')).toBe('/api/v1/media/preview/key-456');
    expect(generatePreviewUrl('key-789', 'application/pdf')).toBe('/api/v1/media/download/key-789');
  });

  it('categorizes mime types', () => {
    expect(getMimeTypeCategory('image/jpeg')).toBe('Image');
    expect(getMimeTypeCategory('video/mp4')).toBe('Video');
    expect(getMimeTypeCategory('application/json')).toBe('Document');
    expect(getMimeTypeCategory('text/plain')).toBe('Text');
    expect(getMimeTypeCategory('application/x-custom')).toBe('Document');
  });
});
