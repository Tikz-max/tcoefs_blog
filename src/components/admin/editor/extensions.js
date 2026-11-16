import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Blockquote from "@tiptap/extension-blockquote";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";

/** Opening paragraph set slightly larger: <p class="lead"> */
const LeadParagraph = Paragraph.extend({
  addAttributes() {
    return {
      lead: {
        default: false,
        parseHTML: (el) => el.classList.contains("lead"),
        renderHTML: (attrs) => (attrs.lead ? { class: "lead" } : {}),
      },
    };
  },
});

/** Large quotable line: <blockquote class="pull-quote"> */
const PullQuote = Blockquote.extend({
  addAttributes() {
    return {
      pull: {
        default: false,
        parseHTML: (el) => el.classList.contains("pull-quote"),
        renderHTML: (attrs) => (attrs.pull ? { class: "pull-quote" } : {}),
      },
    };
  },
});

/** Image with an optional caption: <figure><img><figcaption></figure> */
export const Figure = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (el) => {
          const img = el.querySelector("img");
          if (!img) return false;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") || "",
            caption: el.querySelector("figcaption")?.textContent || "",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (el) => ({
          src: el.getAttribute("src"),
          alt: el.getAttribute("alt") || "",
          caption: "",
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const { src, alt, caption } = node.attrs;
    const children = [["img", { src, alt }]];
    if (caption) children.push(["figcaption", {}, caption]);
    return ["figure", {}, ...children];
  },

  addCommands() {
    return {
      setFigure:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
      updateFigure:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },
});

/** Highlighted box: <aside class="callout" data-variant="..."> */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "note",
        parseHTML: (el) => el.getAttribute("data-variant") || "note",
        renderHTML: (attrs) => ({ "data-variant": attrs.variant }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "aside.callout" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes({ class: "callout" }, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setCallout:
        (variant = "note") =>
        ({ commands }) =>
          commands.wrapIn(this.name, { variant }),
      toggleCallout:
        (variant = "note") =>
        ({ commands, editor }) =>
          editor.isActive(this.name, { variant })
            ? commands.lift(this.name)
            : editor.isActive(this.name)
              ? commands.updateAttributes(this.name, { variant })
              : commands.wrapIn(this.name, { variant }),
    };
  },
});

export const buildExtensions = () => [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    paragraph: false,
    blockquote: false,
    link: {
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer" },
    },
  }),
  LeadParagraph,
  PullQuote,
  Figure,
  Callout,
  Highlight,
  Subscript,
  Superscript,
  Typography,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Youtube.configure({
    nocookie: true,
    controls: true,
    HTMLAttributes: { class: "video-embed" },
  }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  Placeholder.configure({
    placeholder: "Start writing, or paste from Word or Google Docs…",
  }),
  CharacterCount,
];
