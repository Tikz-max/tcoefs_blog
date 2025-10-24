import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  EyeOff,
} from "lucide-react";

const RichTextEditor = ({ value, onChange, label = "Content" }) => {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

  const insertAtCursor = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertAtCursor("<h1>", "</h1>"),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertAtCursor("<h2>", "</h2>"),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertAtCursor("<h3>", "</h3>"),
    },
    {
      icon: Bold,
      label: "Bold",
      action: () => insertAtCursor("<strong>", "</strong>"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertAtCursor("<em>", "</em>"),
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertAtCursor("<u>", "</u>"),
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: () => insertAtCursor('<a href="URL">', "</a>"),
    },
    {
      icon: List,
      label: "Unordered List",
      action: () => insertAtCursor("<ul>\n  <li>", "</li>\n</ul>"),
    },
    {
      icon: ListOrdered,
      label: "Ordered List",
      action: () => insertAtCursor("<ol>\n  <li>", "</li>\n</ol>"),
    },
    {
      icon: Quote,
      label: "Blockquote",
      action: () => insertAtCursor("<blockquote>", "</blockquote>"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertAtCursor("<code>", "</code>"),
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: () =>
        insertAtCursor(
          '<img src="IMAGE_URL" alt="Description" class="w-full rounded-lg my-6" />',
        ),
    },
  ];

  const insertParagraph = () => {
    insertAtCursor("<p>", "</p>");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-primary">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent-dark transition-quick"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Preview
            </>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-sage-light rounded-t-lg p-2 flex flex-wrap gap-1">
        {formatButtons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.label}
              type="button"
              onClick={button.action}
              className="p-2 hover:bg-sage-light rounded transition-quick"
              title={button.label}
            >
              <Icon className="w-5 h-5 text-primary" />
            </button>
          );
        })}
        <div className="border-l border-sage-light mx-1" />
        <button
          type="button"
          onClick={insertParagraph}
          className="px-3 py-2 hover:bg-sage-light rounded transition-quick text-sm font-medium text-primary"
          title="Paragraph"
        >
          P
        </button>
      </div>

      {/* Editor Area */}
      <div className="relative">
        {!showPreview ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[500px] p-4 border border-t-0 border-sage-light rounded-b-lg focus:outline-none focus:border-accent transition-quick font-mono text-sm"
            placeholder="Write your article content here using HTML tags..."
          />
        ) : (
          <div className="min-h-[500px] p-4 border border-t-0 border-sage-light rounded-b-lg bg-white overflow-auto">
            <div
              className="article-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-secondary space-y-1">
        <p>
          💡 <strong>Tip:</strong> You can write HTML directly or use the
          toolbar buttons to insert tags.
        </p>
        <p>
          <strong>Common tags:</strong>{" "}
          {`<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <ul>, <ol>, <li>, <a>, <img>`}
        </p>
        <p>
          <strong>For images:</strong> Upload images using Cloudinary first,
          then insert the URL.
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;
