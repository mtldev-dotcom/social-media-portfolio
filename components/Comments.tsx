import { getCommentsForPost, getCommentsForNote } from "@/lib/payload";
import type { BlogComment } from "@/lib/payload";

type CommentsProps = {
  postId?: string;
  noteId?: string;
  locale: string;
};

/**
 * Comments — lists approved comments for a post or note.
 * Fetches from Payload; postId or noteId required.
 */
export async function Comments({ postId, noteId, locale }: CommentsProps) {
  const comments: BlogComment[] = postId
    ? await getCommentsForPost(postId)
    : noteId
      ? await getCommentsForNote(noteId)
      : [];

  if (comments.length === 0) {
    return (
      <div className="border-t border-divider pt-6">
        <h3 className="mb-3 font-display text-sm font-semibold text-foreground/80">
          Comments
        </h3>
        <p className="text-sm text-muted-2">No comments yet.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-divider pt-6">
      <h3 className="mb-3 font-display text-sm font-semibold text-foreground/80">
        Comments ({comments.length})
      </h3>
      <ul className="space-y-4">
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-divider bg-surface-2/50 p-4"
          >
            <p className="text-xs text-muted-2">
              <span className="font-medium text-foreground/80">{c.authorName}</span>
              {" · "}
              {new Date(c.createdAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {c.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
