'use client';

import { useDocumentInfo } from '@payloadcms/ui';
import { useState } from 'react';

type TranslationDirection = 'en-to-fr' | 'fr-to-en';

/**
 * Custom admin component that provides translation buttons in the sidebar.
 * Allows translating content between English and French in both directions.
 */
export const TranslateButtons: React.FC = () => {
    const { id, collectionSlug } = useDocumentInfo();
    const [loading, setLoading] = useState<TranslationDirection | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleTranslate = async (direction: TranslationDirection) => {
        if (!id || !collectionSlug) {
            setMessage({ type: 'error', text: 'Please save the document first' });
            return;
        }

        const sourceLocale = direction === 'en-to-fr' ? 'en' : 'fr';
        const targetLocale = direction === 'en-to-fr' ? 'fr' : 'en';

        setLoading(direction);
        setMessage(null);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collection: collectionSlug,
                    docId: id,
                    sourceLocale,
                    targetLocale,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: `Translated to ${targetLocale === 'fr' ? 'French' : 'English'}! Refresh to see changes.`
                });
                // Optional: reload after short delay
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Translation failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(null);
        }
    };

    // Don't render if document hasn't been saved yet
    if (!id) {
        return (
            <div style={styles.container}>
                <p style={styles.hint}>Save the document to enable translation</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Auto-Translate</h4>

            <button
                onClick={() => handleTranslate('en-to-fr')}
                disabled={loading !== null}
                style={{
                    ...styles.button,
                    ...(loading === 'en-to-fr' ? styles.buttonLoading : {}),
                }}
            >
                {loading === 'en-to-fr' ? 'Translating...' : '🇬🇧 → 🇫🇷 Generate French'}
            </button>

            <button
                onClick={() => handleTranslate('fr-to-en')}
                disabled={loading !== null}
                style={{
                    ...styles.button,
                    ...(loading === 'fr-to-en' ? styles.buttonLoading : {}),
                }}
            >
                {loading === 'fr-to-en' ? 'Translating...' : '🇫🇷 → 🇬🇧 Generate English'}
            </button>

            {message && (
                <p style={{
                    ...styles.message,
                    color: message.type === 'success' ? '#22c55e' : '#ef4444',
                }}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        padding: '16px',
        borderTop: '1px solid var(--theme-elevation-150)',
        marginTop: '16px',
    },
    title: {
        margin: '0 0 12px 0',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--theme-elevation-800)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    button: {
        display: 'block',
        width: '100%',
        padding: '10px 12px',
        marginBottom: '8px',
        border: '1px solid var(--theme-elevation-250)',
        borderRadius: '4px',
        backgroundColor: 'var(--theme-elevation-50)',
        color: 'var(--theme-elevation-800)',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    },
    buttonLoading: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
    message: {
        margin: '12px 0 0 0',
        fontSize: '12px',
        lineHeight: 1.4,
    },
    hint: {
        margin: 0,
        fontSize: '12px',
        color: 'var(--theme-elevation-500)',
        fontStyle: 'italic',
    },
};

export default TranslateButtons;
