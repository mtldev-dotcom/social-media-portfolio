import type { Field } from 'payload';

export const translationStatusField: Field = {
  name: 'translationStatus',
  type: 'select',
  options: [
    { label: 'Original', value: 'original' },
    { label: 'Pending', value: 'pending' },
    { label: 'Auto-Translated', value: 'auto' },
    { label: 'Reviewed', value: 'reviewed' },
  ],
  defaultValue: 'original',
  localized: true,
  admin: {
    position: 'sidebar',
    description: 'Translation status for this locale.',
  },
};
