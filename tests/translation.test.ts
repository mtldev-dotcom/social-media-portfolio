import { describe, it, expect, vi } from 'vitest';

// Mock OpenAI
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Bonjour le monde' } }],
        }),
      },
    };
  },
}));

describe('translateText', () => {
  it('returns empty string for empty input', async () => {
    const { translateText } = await import('../payload/services/openaiTranslation');
    const result = await translateText('', 'fr');
    expect(result).toBe('');
  });
});
