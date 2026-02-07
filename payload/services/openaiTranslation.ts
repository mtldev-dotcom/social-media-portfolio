import OpenAI from 'openai';

export type SupportedLocale = 'en' | 'fr';

const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'French',
};

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required for translation');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

/**
 * Translates text using OpenAI GPT-4o-mini.
 */
export async function translateText(
  text: string,
  targetLocale: SupportedLocale
): Promise<string> {
  if (!text || !text.trim()) return text;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
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
