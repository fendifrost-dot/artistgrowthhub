import { describe, expect, it, vi } from 'vitest';
import { normalizeConnectedHandle } from '@/lib/normalizeConnectedHandle';

describe('normalizeConnectedHandle', () => {
  it('returns empty string for falsy input', () => {
    expect(normalizeConnectedHandle('')).toBe('');
  });

  it('returns token friendly label for facebook access tokens', () => {
    expect(normalizeConnectedHandle('EAA123')).toBe('Access Token Connected');
  });

  it('returns raw input for handles without protocol', () => {
    expect(normalizeConnectedHandle('artistname')).toBe('artistname');
  });

  it('extracts handle from standard profile URL', () => {
    expect(normalizeConnectedHandle('https://instagram.com/artistname')).toBe('artistname');
  });

  it('extracts handle from URL with trailing slash and query', () => {
    expect(normalizeConnectedHandle('https://www.instagram.com/artistname/?hl=en')).toBe('artistname');
  });

  it('falls back to hostname when no path segments exist', () => {
    expect(normalizeConnectedHandle('https://www.example.com')).toBe('example.com');
  });

  it('returns trimmed input when URL parsing fails', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(normalizeConnectedHandle('http:///not-valid')).toBe('http:///not-valid');

    consoleSpy.mockRestore();
  });
});
