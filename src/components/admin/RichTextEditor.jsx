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
  Upload,
} from "lucide-react";
import { cloudinary } from "../../lib/supabase";

const RichTextEditor = ({ value, onChange, label = "Content" }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Upload to Cloudinary
      const { data, error } = await cloudinary.uploadImage(file);

      if (error) {
        throw new Error(error.message);
      }

      // Insert image tag at cursor position
      const imageTag = `\n<img src="${data.url}" alt="Article image" class="w-full rounded-lg my-6" />\n`;
      insertAtCursor(imageTag, "");

      // Clear file input
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-primary">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerImageUpload}
            disabled={uploadingImage}
            className="flex items-center gap-2 text-sm bg-sage-light hover:bg-sage-medium text-primary px-3 py-1.5 rounded-lg transition-quick disabled:opacity-50"
          >
            {uploadingImage ? (
              <>
                <Upload className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Image
              </>
            )}
          </button>
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
      </div>

      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

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
          💡 <strong>Tip:</strong> Click "Upload Image" button above to insert
          images directly into your article.
        </p>
        <p>
          <strong>Common tags:</strong>{" "}
          {`<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <ul>, <ol>, <li>, <a>, <img>`}
        </p>
        <p>
          <strong>For images:</strong> Click the "Upload Image" button, select
          your image, and it will be inserted automatically at cursor position.
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;
