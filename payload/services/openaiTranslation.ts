import OpenAI from 'openai';

export type SupportedLocale = 'en' | 'fr';

const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'French',
};

// Lazy initialization of OpenRouter client (OpenAI-compatible)
let openrouter: OpenAI | null = null;

function getOpenRouter(): OpenAI {
  if (!openrouter) {
    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPEN_ROUTER_API_KEY environment variable is required for translation');
    }
    openrouter = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
        'X-Title': 'Social Media Blog Translation',
      },
    });
  }
  return openrouter;
}

/**
 * Translates text using OpenRouter API (GPT-4o-mini via OpenRouter).
 */
export async function translateText(
  text: string,
  targetLocale: SupportedLocale
): Promise<string> {
  if (!text || !text.trim()) return text;

  const response = await getOpenRouter().chat.completions.create({
    model: 'openai/gpt-4o-mini', // OpenRouter model format
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the following text to ${LOCALE_NAMES[targetLocale]}. 
Preserve all formatting, markdown, and line breaks exactly. 
Only output the translated text, nothing else.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content ?? text;
}

/**
 * Translates multiple fields at once.
 */
export async function translateFields(
  fields: Record<string, string | undefined>,
  targetLocale: SupportedLocale
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value && value.trim()) {
      result[key] = await translateText(value, targetLocale);
    }
  }

  return result;
}
