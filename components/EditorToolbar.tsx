"use client";

import type { Editor } from "@tiptap/core";
import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  HIGHLIGHT_COLORS,
  LINE_HEIGHTS,
  TEXT_COLORS,
} from "@/constants/editor";

interface ToolbarProps {
  editor: Editor;
  fontSize: number;
  fontFamily: string;
  onFontSizeChange: (size: number) => void;
  onImageUpload: (file: File) => void;
}

export const EditorToolbar = ({
  editor,
  fontSize,
  fontFamily,
  onFontSizeChange,
  onImageUpload,
}: ToolbarProps) => {
  const btn = (active: boolean) =>
    `px-3 py-1 rounded text-sm border ${
      active ? "bg-black text-white" : "bg-white"
    }`;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap gap-2 p-2 border-b bg-gray-50">
      <select
        className="border px-2 py-1 rounded text-sm"
        value={fontFamily}
        onChange={(e) => {
          const font = e.target.value;
          if (font === "default") {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(font).run();
          }
        }}
      >
        <option value="default">Font</option>
        {FONT_FAMILIES.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1 border px-2 py-1 rounded">
        <button
          type="button"
          onClick={() => {
            const newSize = Math.max(8, fontSize - 1);
            onFontSizeChange(newSize);
            editor.chain().focus().setFontSize(`${newSize}px`).run();
          }}
        >
          -
        </button>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => {
            const value = Number(e.target.value);
            onFontSizeChange(value);
            editor.chain().focus().setFontSize(`${value}px`).run();
          }}
          className="w-12 text-center border rounded"
        />
        <button
          type="button"
          onClick={() => {
            const newSize = Math.min(100, fontSize + 1);
            onFontSizeChange(newSize);
            editor.chain().focus().setFontSize(`${newSize}px`).run();
          }}
        >
          +
        </button>
      </div>

      <select
        className="border px-2 py-1 rounded text-sm"
        onChange={(e) => {
          const val = e.target.value;
          if (val === "default") {
            editor.chain().focus().unsetLineHeight().run();
          } else {
            editor.chain().focus().setLineHeight(val).run();
          }
        }}
      >
        <option value="default">Line</option>
        {LINE_HEIGHTS.map((lh) => (
          <option key={lh} value={lh}>
            {lh}
          </option>
        ))}
      </select>

      <select
        className="border px-2 py-1 rounded text-sm"
        onChange={(e) => {
          const val = e.target.value;
          if (val === "default") {
            editor.chain().focus().unsetFontWeight().run();
          } else {
            editor.chain().focus().setFontWeight(val).run();
          }
        }}
      >
        <option value="default">Weight</option>
        {FONT_WEIGHTS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={btn(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>

      <button
        type="button"
        className={btn(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>

      <button
        type="button"
        className={btn(editor.isActive("heading", { level: 1 }))}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </button>

      <button
        type="button"
        className={btn(editor.isActive("heading", { level: 2 }))}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </button>

      <button
        type="button"
        className={btn(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </button>

      <button
        type="button"
        className={btn(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </button>

      <button
        type="button"
        className={btn(editor.isActive({ textAlign: "left" }))}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <FaAlignLeft />
      </button>

      <button
        type="button"
        className={btn(editor.isActive({ textAlign: "center" }))}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <FaAlignCenter />
      </button>

      <button
        type="button"
        className={btn(editor.isActive({ textAlign: "right" }))}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <FaAlignRight />
      </button>

      {TEXT_COLORS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          className={btn(editor.isActive("textStyle", { color: value }))}
          onClick={() => editor.chain().focus().setColor(value).run()}
        >
          {label}
        </button>
      ))}

      <button
        type="button"
        className={btn(!editor.isActive("textStyle"))}
        onClick={() => editor.chain().focus().unsetColor().run()}
      >
        Clear
      </button>

      {HIGHLIGHT_COLORS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          className={btn(editor.isActive("highlight", { color: value }))}
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: value }).run()
          }
        >
          {label}
        </button>
      ))}

      <label className="cursor-pointer border px-2 py-1 rounded">
        Img
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpload(file);
          }}
        />
      </label>

      <button
        type="button"
        className="px-3 py-1 rounded text-sm border"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent("<div data-page-break></div>")
            .run()
        }
      >
        Page Break
      </button>
    </div>
  );
};
