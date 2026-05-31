"use client";

import {
  useEditor,
  EditorContent,
  // NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
// import { mergeAttributes } from "@tiptap/core";
import { FontSize } from "./FontSize";
import { FontFamily } from "./FontFamily";
import { LineHeight } from "./LineHeight";
import { FontWeight } from "./FontWeight";

import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa";
import { ImageComponent } from "./ImageComponent";
import { PageBreak } from "./PageBreak";
import { useEffect, useState } from "react";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

const PAGE_HEIGHT = 1122; // A4 height

// ✅ CUSTOM IMAGE WITH DELETE BUTTON
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});

const TipTapEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      CustomImage,
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      LineHeight,
      FontWeight,
      Highlight.configure({ multicolor: true }),
      PageBreak,
    ],
    content: content || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      const el = document.querySelector(".ProseMirror");
      if (!el) return;

      const height = el.scrollHeight;

      // count existing page breaks
      const breaks = html.match(/data-page-break/g)?.length || 0;

      // expected pages based on height
      const expectedPages = Math.floor(height / PAGE_HEIGHT);

      // insert break only if needed
      if (expectedPages > breaks) {
        editor
          .chain()
          .focus()
          .insertContent("<div data-page-break></div>")
          .run();
      }
    },
  });

  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("default");

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const size = editor.getAttributes("textStyle")?.fontSize;
      setFontSize(size ? parseInt(size) : 16);

      const font = editor.getAttributes("textStyle")?.fontFamily;
      setFontFamily(font || "default");
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-3 py-1 rounded text-sm border ${
      active ? "bg-black text-white" : "bg-white"
    }`;

  // ✅ IMAGE UPLOAD HANDLER
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://72.62.243.185/" + "upload", {
      // const res = await fetch("http://localhost:5000/" + "upload", {

        method: "POST",
        body: formData,
      });

      const data = await res.json();

      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="border w-full h-[550px] mb-10 rounded-lg shadow-sm overflow-y-auto">
      {/* TOOLBAR */}
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

          <option value="Arial" style={{ fontFamily: "Arial" }}>
            Arial
          </option>

          <option
            value="Times New Roman"
            style={{ fontFamily: "Times New Roman" }}
          >
            Times New Roman
          </option>

          <option value="Georgia" style={{ fontFamily: "Georgia" }}>
            Georgia
          </option>

          <option value="Courier New" style={{ fontFamily: "Courier New" }}>
            Courier New
          </option>

          <option value="Verdana" style={{ fontFamily: "Verdana" }}>
            Verdana
          </option>

          <option value="Tahoma" style={{ fontFamily: "Tahoma" }}>
            Tahoma
          </option>
        </select>

        {/* font size */}
        <div className="flex items-center gap-1 border px-2 py-1 rounded">
          {/* - BUTTON */}
          <button
            type="button"
            onClick={() => {
              const newSize = Math.max(8, fontSize - 1);
              setFontSize(newSize);
              editor.chain().focus().setFontSize(`${newSize}px`).run();
            }}
          >
            -
          </button>

          {/* INPUT */}
          <input
            type="number"
            value={fontSize}
            onChange={(e) => {
              const value = Number(e.target.value);
              setFontSize(value);
              editor.chain().focus().setFontSize(`${value}px`).run();
            }}
            className="w-12 text-center border rounded"
          />

          {/* + BUTTON */}
          <button
            type="button"
            onClick={() => {
              const newSize = Math.min(100, fontSize + 1);
              setFontSize(newSize);
              editor.chain().focus().setFontSize(`${newSize}px`).run();
            }}
          >
            +
          </button>
        </div>
        {/* line height */}
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
          <option value="1">1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
        </select>

        {/* font-weight */}
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

          <option value="300">Light</option>
          <option value="400">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi-Bold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
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

        <button
          type="button"
          className={btn(editor.isActive("textStyle", { color: "#ff0000" }))}
          onClick={() => editor.chain().focus().setColor("#ff0000").run()}
        >
          Red
        </button>

        <button
          type="button"
          className={btn(editor.isActive("textStyle", { color: "#0000ff" }))}
          onClick={() => editor.chain().focus().setColor("#0000ff").run()}
        >
          Blue
        </button>

        <button
          type="button"
          className={btn(editor.isActive("textStyle", { color: "#2E6F40" }))}
          onClick={() => editor.chain().focus().setColor("#2E6F40").run()}
        >
          Green
        </button>

        <button
          type="button"
          className={btn(!editor.isActive("textStyle"))}
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Clear
        </button>

        <button
          type="button"
          className={btn(editor.isActive("highlight", { color: "#ffff00" }))}
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ffff00" }).run()
          }
        >
          Yellow BG
        </button>

        <button
          type="button"
          className={btn(editor.isActive("highlight", { color: "#90ee90" }))}
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#90ee90" }).run()
          }
        >
          Green BG
        </button>

        <label className="cursor-pointer border px-2 py-1 rounded">
          Img
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
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

      <div className="flex justify-center bg-gray-200 py-10">
        <div className="bg-white w-[794px] min-h-[1122px] shadow-md p-10">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;
