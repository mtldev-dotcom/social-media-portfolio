import type { Field } from 'payload';

/**
 * A UI-only field that renders the TranslateButtons component in the sidebar.
 * This field has no data storage - it's purely for UI purposes.
 */
export const translateButtonsField: Field = {
    name: 'translateActions',
    type: 'ui',
    admin: {
        position: 'sidebar',
        components: {
            Field: '/payload/admin/components/TranslateButtons#TranslateButtons',
        },
    },
};
