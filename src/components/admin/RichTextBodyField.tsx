"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { looksLikeHtml } from "@/lib/html";

type Mode = "rich" | "markdown";

const noopSubscribe = () => () => {};

export function RichTextBodyField({
  name = "body",
  defaultValue = "",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="space-y-2">
        <input type="hidden" name={name} value={defaultValue} />
        <textarea
          readOnly
          value={defaultValue}
          rows={6}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/40 px-3 py-2 text-sm text-[var(--text-muted)]"
          placeholder="Loading editor…"
        />
      </div>
    );
  }

  return <RichTextBodyEditor name={name} defaultValue={defaultValue} />;
}

function RichTextBodyEditor({ name, defaultValue }: { name: string; defaultValue: string }) {
  const initialMode: Mode = looksLikeHtml(defaultValue) ? "rich" : "markdown";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [markdown, setMarkdown] = useState(
    initialMode === "markdown" ? defaultValue : defaultValue.replace(/<[^>]+>/g, " ").trim(),
  );
  const [html, setHtml] = useState(initialMode === "rich" ? defaultValue : `<p>${defaultValue}</p>`);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write something worth revisiting in 2031…" }),
    ],
    content: looksLikeHtml(defaultValue) ? defaultValue : defaultValue ? `<p>${defaultValue}</p>` : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] rounded-b-xl border border-t-0 border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-3 text-sm outline-none prose prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor: ed }) => setHtml(ed.getHTML()),
  });

  useEffect(() => {
    if (mode === "rich" && editor && !looksLikeHtml(editor.getHTML())) {
      editor.commands.setContent(html || "<p></p>");
    }
  }, [mode, editor, html]);

  const submittedValue = mode === "rich" ? html : markdown;

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={submittedValue} />
      <input type="hidden" name="body_format" value={mode === "rich" ? "html" : "markdown"} />
      <div className="flex gap-2">
        <ModeButton active={mode === "rich"} onClick={() => setMode("rich")}>
          Rich text
        </ModeButton>
        <ModeButton active={mode === "markdown"} onClick={() => setMode("markdown")}>
          Markdown
        </ModeButton>
      </div>
      {mode === "rich" && editor ? (
        <div>
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      ) : (
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={14}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-2.5 font-mono text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent-violet)]"
        />
      )}
      <p className="text-xs text-[var(--text-muted)]">
        Rich text saves sanitized HTML. Markdown saves plain text with GFM on the public site.
      </p>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        active
          ? "border-[var(--border-strong)] bg-[var(--bg-elevated)]"
          : "border-transparent text-[var(--text-muted)]",
      )}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {
  const btn = "rounded-md px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]";
  return (
    <div className="flex flex-wrap gap-1 rounded-t-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5">
      <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button type="button" className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>
      <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </button>
      <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        List
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        Link
      </button>
    </div>
  );
}