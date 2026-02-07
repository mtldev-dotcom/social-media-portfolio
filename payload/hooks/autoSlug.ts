import type { CollectionBeforeChangeHook } from 'payload';
import { formatSlug } from './formatSlug';

export const autoGenerateSlug: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  const title = data?.title as string | undefined;

  const shouldGenerate =
    (operation === 'create' && !data?.slug) ||
    (operation === 'update' && !data?.slug && !originalDoc?.slug);

  if (shouldGenerate && title && title.trim()) {
    return { ...data, slug: formatSlug(title) };
  }
  return data;
};
