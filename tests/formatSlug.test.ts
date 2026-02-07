import { describe, it, expect } from 'vitest';
import { formatSlug } from '../payload/hooks/formatSlug';

describe('formatSlug', () => {
  it('converts to lowercase', () => {
    expect(formatSlug('HELLO WORLD')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(formatSlug('hello world')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(formatSlug('hello!@#$world')).toBe('helloworld');
  });

  it('normalizes accented characters', () => {
    expect(formatSlug('café résumé')).toBe('cafe-resume');
  });

  it('removes duplicate hyphens', () => {
    expect(formatSlug('hello---world')).toBe('hello-world');
  });

  it('trims leading/trailing hyphens', () => {
    expect(formatSlug('---hello---')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(formatSlug('')).toBe('');
  });
});
