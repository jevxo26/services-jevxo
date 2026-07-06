"use client";

import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

// ─── Custom FontSize Extension ───────────────────────────────────────────────
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize?.replace("px", "") || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}px` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    } as any;
  },
});

// ─── Font sizes list ─────────────────────────────────────────────────────────
const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 28, 32, 36, 48];

// ─── Icons ───────────────────────────────────────────────────────────────────
const BoldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5S13.83 9.5 13 9.5h-3V6.5zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5S14.33 15.5 13.5 15.5z" />
  </svg>
);
const ItalicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
  </svg>
);
const UnderlineIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
  </svg>
);
const BulletListIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
  </svg>
);
const OrderedListIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
  </svg>
);
const AlignLeftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
  </svg>
);
const AlignCenterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
  </svg>
);
const HighlightIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M6 14l3 3v4h6v-4l3-3V9H6v5zm2-3h8v2.17L13.83 16h-3.66L8 13.17V11zm3-8H9.5l-4 4 1 1 .5-.5V9h7V7.5l.5.5 1-1-4-4z" />
  </svg>
);

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded-lg transition-all duration-150 flex items-center justify-center ${
        active
          ? "bg-[#FF6014]/15 text-[#FF6014] shadow-inner"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Separator ───────────────────────────────────────────────────────────────
function Sep() {
  return <div className="w-px h-5 bg-slate-200 mx-1 self-center" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = 120,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: `outline-none px-3 py-2.5 text-sm text-slate-800 leading-relaxed focus:outline-none`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Track the last value we pushed into the editor ourselves
  const lastSyncedRef = React.useRef<string>(value || "");

  // Sync external value changes ONLY when editor is not focused (e.g. loading saved data for edit)
  useEffect(() => {
    if (!editor) return;
    // Don't override user's active typing
    if (editor.isFocused) return;
    // Don't re-sync if it was us who caused the update
    if (value === lastSyncedRef.current) return;
    const current = editor.getHTML();
    if (value !== current) {
      lastSyncedRef.current = value || "";
      editor.commands.setContent(value || "", false as any);
    }
  }, [value, editor]);

  const setColor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      editor?.chain().focus().setColor(e.target.value).run();
    },
    [editor]
  );

  const setHighlight = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      editor?.chain().focus().setHighlight({ color: e.target.value }).run();
    },
    [editor]
  );

  // Get active font size from selection
  const activeFontSize = editor?.getAttributes("textStyle")?.fontSize ?? "";

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      (editor?.chain().focus() as any).unsetFontSize().run();
    } else {
      (editor?.chain().focus() as any).setFontSize(val).run();
    }
  };

  if (!editor) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:border-[#FF6014]/50 focus-within:ring-2 focus-within:ring-[#FF6014]/10 transition-all duration-200">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50/80">

        {/* ── Font Size Selector ── */}
        <select
          value={activeFontSize}
          onChange={handleFontSizeChange}
          onMouseDown={(e) => e.stopPropagation()}
          title="Font Size"
          className="h-7 px-1.5 pr-5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold cursor-pointer appearance-none focus:outline-none focus:border-[#FF6014]/60 hover:border-slate-300 transition-all min-w-[56px]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
        >
          <option value="">Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={String(s)}>
              {s}
            </option>
          ))}
        </select>

        <Sep />

        {/* Bold / Italic / Underline */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <BoldIcon />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <ItalicIcon />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
          <UnderlineIcon />
        </ToolbarBtn>

        <Sep />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
          <BulletListIcon />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
          <OrderedListIcon />
        </ToolbarBtn>

        <Sep />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
          <AlignLeftIcon />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
          <AlignCenterIcon />
        </ToolbarBtn>

        <Sep />

        {/* Text Color */}
        <label title="Text Color" className="relative flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500" fill="currentColor">
            <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm.92-5.42c-.2.28-.43.54-.67.79-.45.46-.9.94-1.24 1.63h-2c.11-.64.44-1.21.88-1.69.31-.34.67-.63 1-.92.43-.37.84-.71 1.13-1.15.28-.43.43-.92.43-1.43 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .87-.32 1.67-.86 2.29-.02.03-.45.48-.67.48z" />
          </svg>
          <div
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-sm"
            style={{ backgroundColor: editor.getAttributes("textStyle").color || "#000000" }}
          />
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onChange={setColor}
            title="Text Color"
          />
        </label>

        {/* Highlight Color */}
        <label title="Highlight Color" className="relative flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
          <HighlightIcon />
          <div
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-sm"
            style={{ backgroundColor: editor.getAttributes("highlight").color || "#FFFF00" }}
          />
          <input
            type="color"
            defaultValue="#FFFF00"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onChange={setHighlight}
            title="Highlight Color"
          />
        </label>

        <Sep />

        {/* Clear Formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} active={false} title="Clear Formatting">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z" />
          </svg>
        </ToolbarBtn>
      </div>

      {/* ── Editor Area ── */}
      <div
        className="cursor-text"
        style={{ minHeight }}
        onClick={() => editor.commands.focus()}
      >
        <EditorContent
          editor={editor}
          placeholder={placeholder}
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[inherit] [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2.5 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-slate-800 [&_.ProseMirror]:leading-relaxed [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
        />
      </div>
    </div>
  );
}
