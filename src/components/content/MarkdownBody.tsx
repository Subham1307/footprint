import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "isomorphic-dompurify";
import { looksLikeHtml } from "@/lib/html";

export function MarkdownBody({ content }: { content: string }) {
  if (looksLikeHtml(content)) {
    const safe = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
    });
    return (
      <article
        className="prose prose-invert max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-violet)]"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  const paragraphs = content.includes("\n\n") ? null : content.split("\n").filter(Boolean);

  if (paragraphs && paragraphs.length > 1 && !content.includes("#") && !content.includes("*")) {
    return (
      <div className="space-y-5 text-base leading-relaxed text-[var(--text-secondary)]">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-violet)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}