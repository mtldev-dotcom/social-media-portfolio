import ReactMarkdown from "react-markdown";

/**
 * Markdown — renders a Markdown string as styled HTML.
 * Used on detail pages for entry.body content.
 *
 * Preconditions: content is a valid Markdown string.
 * Postconditions: renders as semantic HTML with neutral styling.
 */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
