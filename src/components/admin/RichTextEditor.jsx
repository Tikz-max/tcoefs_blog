import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Code2,
  Columns3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Subscript,
  Superscript,
  Table2,
  Trash2,
  Underline,
  Undo2,
  Video,
  X,
} from "lucide-react";
import { buildExtensions } from "./editor/extensions";
import { cloudinary } from "../../lib/supabase";
import { sanitiseHtml } from "../../lib/content";

const BLOCKS = [
  { value: "p", label: "Body text" },
  { value: "lead", label: "Opening paragraph" },
  { value: "h2", label: "Section heading" },
  { value: "h3", label: "Sub-heading" },
  { value: "h4", label: "Small label" },
];

const CALLOUTS = [
  { variant: "note", label: "Note" },
  { variant: "takeaways", label: "Key takeaways" },
  { variant: "data", label: "By the numbers" },
  { variant: "references", label: "Notes and references" },
];

const Btn = ({ onClick, active, disabled, label, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    aria-pressed={active}
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-35 ${
      active ? "bg-brand-soft text-brand" : "text-ink-2 hover:bg-muted hover:text-ink"
    }`}
  >
    {children}
  </button>
);

const Sep = () => <span className="mx-1 h-5 w-px shrink-0 bg-line" aria-hidden="true" />;

const RichTextEditor = ({ value, onChange, wordCount: onWordCount }) => {
  const [sourceMode, setSourceMode] = useState(false);
  const [source, setSource] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const fileRef = useRef(null);
  const lastEmitted = useRef(value);

  const editor = useEditor({
    extensions: buildExtensions(),
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose-article focus:outline-none",
        "aria-label": "Article body",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.isEmpty ? "" : ed.getHTML();
      lastEmitted.current = html;
      onChange(html);
      onWordCount?.(ed.storage.characterCount.words());
    },
  });

  // Accept content that arrives after mount (loading an existing story).
  useEffect(() => {
    if (!editor || value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(value || "", { emitUpdate: false });
    onWordCount?.(editor.storage.characterCount.words());
  }, [value, editor, onWordCount]);

  const state = useEditorState({
    editor,
    selector: ({ editor: ed }) => {
      if (!ed) return {};
      const heading = [2, 3, 4].find((l) => ed.isActive("heading", { level: l }));
      return {
        block: heading
          ? `h${heading}`
          : ed.isActive("paragraph", { lead: true })
            ? "lead"
            : "p",
        bold: ed.isActive("bold"),
        italic: ed.isActive("italic"),
        underline: ed.isActive("underline"),
        strike: ed.isActive("strike"),
        highlight: ed.isActive("highlight"),
        sup: ed.isActive("superscript"),
        sub: ed.isActive("subscript"),
        link: ed.isActive("link"),
        bullet: ed.isActive("bulletList"),
        ordered: ed.isActive("orderedList"),
        quote: ed.isActive("blockquote", { pull: false }) || (ed.isActive("blockquote") && !ed.isActive("blockquote", { pull: true })),
        pull: ed.isActive("blockquote", { pull: true }),
        callout: ed.isActive("callout") ? ed.getAttributes("callout").variant : "",
        center: ed.isActive({ textAlign: "center" }),
        inTable: ed.isActive("table"),
        figure: ed.isActive("figure"),
        figureAttrs: ed.isActive("figure") ? ed.getAttributes("figure") : null,
        canUndo: ed.can().undo(),
        canRedo: ed.can().redo(),
        words: ed.storage.characterCount.words(),
      };
    },
  });

  const flash = useCallback((msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  }, []);

  if (!editor) {
    return <div className="skeleton h-[480px] w-full" />;
  }

  const setBlock = (v) => {
    const chain = editor.chain().focus();
    if (v === "p") chain.setParagraph().updateAttributes("paragraph", { lead: false }).run();
    else if (v === "lead") chain.setParagraph().updateAttributes("paragraph", { lead: true }).run();
    else chain.setHeading({ level: Number(v[1]) }).run();
  };

  const toggleQuote = () => {
    if (state.pull) {
      editor.chain().focus().updateAttributes("blockquote", { pull: false }).run();
    } else {
      editor.chain().focus().toggleBlockquote().run();
    }
  };

  const togglePull = () => {
    if (state.pull) {
      editor.chain().focus().toggleBlockquote().run();
    } else if (state.quote) {
      editor.chain().focus().updateAttributes("blockquote", { pull: true }).run();
    } else {
      editor.chain().focus().toggleBlockquote().updateAttributes("blockquote", { pull: true }).run();
    }
  };

  const applyLink = (e) => {
    e.preventDefault();
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const href = /^(https?:|mailto:|\/|#)/i.test(url) ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const openLink = () => {
    setLinkUrl(editor.getAttributes("link").href || "");
    setVideoOpen(false);
    setLinkOpen((v) => !v);
  };

  const applyVideo = (e) => {
    e.preventDefault();
    const url = videoUrl.trim();
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      flash("Paste a YouTube link, for example https://www.youtube.com/watch?v=...");
      return;
    }
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
    setVideoUrl("");
    setVideoOpen(false);
  };

  const insertImages = async (files) => {
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setUploading(true);
    for (const file of images) {
      if (file.size > 10 * 1024 * 1024) {
        flash(`${file.name} is larger than 10 MB and was skipped.`);
        continue;
      }
      const { data, error } = await cloudinary.uploadImage(file);
      if (error) {
        flash(error.message || "Image upload failed.");
        continue;
      }
      editor.chain().focus().setFigure({ src: data.url, alt: "", caption: "" }).run();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleSource = () => {
    if (!sourceMode) {
      setSource(editor.isEmpty ? "" : editor.getHTML());
      setSourceMode(true);
    } else {
      const clean = sanitiseHtml(source);
      editor.commands.setContent(clean, { emitUpdate: true });
      setSourceMode(false);
    }
  };

  const figure = state.figureAttrs;

  return (
    <div className="panel overflow-hidden">
      {/* Toolbar */}
      <div className="sticky top-[var(--editor-top,0px)] z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
          <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo || sourceMode}>
            <Undo2 size={16} />
          </Btn>
          <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo || sourceMode}>
            <Redo2 size={16} />
          </Btn>
          <Sep />

          <select
            value={state.block}
            onChange={(e) => setBlock(e.target.value)}
            disabled={sourceMode}
            aria-label="Text style"
            className="h-8 rounded-md border border-line bg-surface px-2 text-[13px] font-medium text-ink disabled:opacity-40"
          >
            {BLOCKS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          <Sep />

          <Btn label="Bold (Ctrl+B)" active={state.bold} disabled={sourceMode} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={16} />
          </Btn>
          <Btn label="Italic (Ctrl+I)" active={state.italic} disabled={sourceMode} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={16} />
          </Btn>
          <Btn label="Underline (Ctrl+U)" active={state.underline} disabled={sourceMode} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <Underline size={16} />
          </Btn>
          <Btn label="Strikethrough" active={state.strike} disabled={sourceMode} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough size={16} />
          </Btn>
          <Btn label="Highlight" active={state.highlight} disabled={sourceMode} onClick={() => editor.chain().focus().toggleHighlight().run()}>
            <Highlighter size={16} />
          </Btn>
          <Btn label="Superscript" active={state.sup} disabled={sourceMode} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            <Superscript size={16} />
          </Btn>
          <Btn label="Subscript" active={state.sub} disabled={sourceMode} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            <Subscript size={16} />
          </Btn>
          <Btn label="Link" active={state.link} disabled={sourceMode} onClick={openLink}>
            <Link2 size={16} />
          </Btn>
          <Sep />

          <Btn label="Bulleted list" active={state.bullet} disabled={sourceMode} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List size={16} />
          </Btn>
          <Btn label="Numbered list" active={state.ordered} disabled={sourceMode} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered size={16} />
          </Btn>
          <Btn label="Quote" active={state.quote} disabled={sourceMode} onClick={toggleQuote}>
            <Quote size={16} />
          </Btn>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={togglePull}
            disabled={sourceMode}
            aria-pressed={state.pull}
            title="Pull quote: a short line set large"
            className={`h-8 shrink-0 rounded-md px-2 text-[12px] font-semibold transition-colors disabled:opacity-35 ${
              state.pull ? "bg-brand-soft text-brand" : "text-ink-2 hover:bg-muted hover:text-ink"
            }`}
          >
            Pull quote
          </button>
          <Btn label="Centre text" active={state.center} disabled={sourceMode} onClick={() => editor.chain().focus().setTextAlign(state.center ? "left" : "center").run()}>
            {state.center ? <AlignCenter size={16} /> : <AlignLeft size={16} />}
          </Btn>
          <Sep />

          <select
            value={state.callout || ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) editor.chain().focus().lift("callout").run();
              else editor.chain().focus().toggleCallout(v).run();
            }}
            disabled={sourceMode}
            aria-label="Callout box"
            className="h-8 rounded-md border border-line bg-surface px-2 text-[13px] font-medium text-ink disabled:opacity-40"
          >
            <option value="">Callout box…</option>
            {CALLOUTS.map((c) => (
              <option key={c.variant} value={c.variant}>
                {c.label}
              </option>
            ))}
            {state.callout && <option value="">Remove callout</option>}
          </select>
          <Sep />

          <Btn label="Insert image" disabled={sourceMode || uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          </Btn>
          <Btn label="Insert table" disabled={sourceMode} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <Table2 size={16} />
          </Btn>
          <Btn label="Embed YouTube video" disabled={sourceMode} onClick={() => { setLinkOpen(false); setVideoOpen((v) => !v); }}>
            <Video size={16} />
          </Btn>
          <Btn label="Divider" disabled={sourceMode} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus size={16} />
          </Btn>
          <Btn label="Clear formatting" disabled={sourceMode} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
            <RemoveFormatting size={16} />
          </Btn>

          <span className="flex-1" />
          <Btn label={sourceMode ? "Back to visual editor" : "Edit HTML source"} active={sourceMode} onClick={toggleSource}>
            <Code2 size={16} />
          </Btn>
        </div>

        {/* Table controls */}
        {state.inTable && !sourceMode && (
          <div className="flex flex-wrap items-center gap-1 border-t border-line bg-muted px-3 py-1.5 text-[12.5px]">
            <Columns3 size={14} className="text-ink-3" />
            <span className="mr-1 font-semibold text-ink-2">Table</span>
            {[
              ["Add row below", () => editor.chain().focus().addRowAfter().run()],
              ["Add column right", () => editor.chain().focus().addColumnAfter().run()],
              ["Header row", () => editor.chain().focus().toggleHeaderRow().run()],
              ["Delete row", () => editor.chain().focus().deleteRow().run()],
              ["Delete column", () => editor.chain().focus().deleteColumn().run()],
            ].map(([label, fn]) => (
              <button key={label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={fn} className="rounded px-2 py-1 font-medium text-ink-2 hover:bg-surface hover:text-ink">
                {label}
              </button>
            ))}
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().deleteTable().run()} className="ml-auto flex items-center gap-1 rounded px-2 py-1 font-medium text-danger hover:bg-surface">
              <Trash2 size={13} /> Delete table
            </button>
          </div>
        )}

        {/* Image controls */}
        {figure && !sourceMode && (
          <div className="grid gap-2 border-t border-line bg-muted px-3 py-2.5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label !mb-1">Caption (shown under the image)</span>
              <input
                className="field !h-9"
                value={figure.caption || ""}
                onChange={(e) => editor.chain().updateFigure({ caption: e.target.value }).run()}
                placeholder="Describe the image and credit the photographer"
              />
            </label>
            <label className="block">
              <span className="field-label !mb-1">Alt text (for screen readers)</span>
              <input
                className="field !h-9"
                value={figure.alt || ""}
                onChange={(e) => editor.chain().updateFigure({ alt: e.target.value }).run()}
                placeholder="What the image shows"
              />
            </label>
          </div>
        )}

        {/* Link and video prompts */}
        {linkOpen && !sourceMode && (
          <form onSubmit={applyLink} className="flex items-center gap-2 border-t border-line bg-muted px-3 py-2">
            <input autoFocus className="field !h-9" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.org  (leave empty to remove the link)" />
            <button type="submit" className="btn btn-primary btn-sm">Apply</button>
            <button type="button" onClick={() => setLinkOpen(false)} className="icon-btn !h-8 !w-8" aria-label="Cancel"><X size={16} /></button>
          </form>
        )}
        {videoOpen && !sourceMode && (
          <form onSubmit={applyVideo} className="flex items-center gap-2 border-t border-line bg-muted px-3 py-2">
            <input autoFocus className="field !h-9" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            <button type="submit" className="btn btn-primary btn-sm">Embed</button>
            <button type="button" onClick={() => setVideoOpen(false)} className="icon-btn !h-8 !w-8" aria-label="Cancel"><X size={16} /></button>
          </form>
        )}
        {notice && (
          <p role="status" className="border-t border-line bg-danger-soft px-3 py-2 text-[13px] text-danger">
            {notice}
          </p>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => insertImages(e.target.files)} />

      {/* Canvas: same typography as the published article */}
      {sourceMode ? (
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          spellCheck={false}
          aria-label="HTML source"
          className="block min-h-[520px] w-full resize-y bg-surface p-5 font-mono text-[13px] leading-relaxed text-ink outline-none"
        />
      ) : (
        <div
          className="editor-canvas bg-surface px-5 py-8 md:px-10"
          onDrop={(e) => {
            if (e.dataTransfer?.files?.length) {
              e.preventDefault();
              insertImages(e.dataTransfer.files);
            }
          }}
        >
          <div className="mx-auto max-w-[720px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-line bg-muted px-4 py-2 text-[12.5px] text-ink-3">
        <span>
          {state.words ?? 0} words · about {Math.max(1, Math.round((state.words ?? 0) / 220))} min read
        </span>
        <span className="hidden sm:inline">Tip: paste from Word or Docs, or drop images straight into the page.</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
