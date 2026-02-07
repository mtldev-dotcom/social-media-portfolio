import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { translateText } from '@/payload/services/openaiTranslation';
import type { SupportedLocale } from '@/payload/services/openaiTranslation';

type TranslateRequest = {
  collection: 'posts' | 'notes' | 'experiments';
  docId: string;
  sourceLocale: SupportedLocale;
  targetLocale: SupportedLocale;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TranslateRequest;
    const { collection, docId, sourceLocale, targetLocale } = body;

    // Validate
    if (!collection || !docId || !sourceLocale || !targetLocale) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Get source document
    const doc = await payload.findByID({
      collection,
      id: docId,
      locale: sourceLocale,
    });

    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Translate fields
    const translatedTitle = doc.title
      ? await translateText(doc.title as string, targetLocale)
      : undefined;
    const translatedSummary = doc.summary
      ? await translateText(doc.summary as string, targetLocale)
      : undefined;
    const translatedBody = doc.body
      ? await translateText(doc.body as string, targetLocale)
      : undefined;

    // Update target locale
    await payload.update({
      collection,
      id: docId,
      locale: targetLocale,
      data: {
        ...(translatedTitle && { title: translatedTitle }),
        ...(translatedSummary && { summary: translatedSummary }),
        ...(translatedBody && { body: translatedBody }),
        translationStatus: 'auto',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Translated to ${targetLocale}`,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
