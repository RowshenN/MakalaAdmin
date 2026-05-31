"use client";

import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { FontSize } from "./FontSize";
import { FontFamily } from "./FontFamily";
import { LineHeight } from "./LineHeight";
import { FontWeight } from "./FontWeight";
import { ImageComponent } from "./ImageComponent";
import { PageBreak } from "./PageBreak";
import { useEffect, useState } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { PAGE_HEIGHT } from "@/constants/editor";
import { API_URL } from "@/services/config";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

const CustomImage = Image.extend({
  addAttributes() {
    return { ...this.parent?.(), align: { default: "center" } };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});

const TipTapEditor = ({ content, onChange }: Props) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("default");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
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

      const breaks = html.match(/data-page-break/g)?.length || 0;
      const expectedPages = Math.floor(el.scrollHeight / PAGE_HEIGHT);

      if (expectedPages > breaks) {
        editor
          .chain()
          .focus()
          .insertContent("<div data-page-break></div>")
          .run();
      }
    },
  });

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

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_URL}upload`, {
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
      <EditorToolbar
        editor={editor}
        fontSize={fontSize}
        fontFamily={fontFamily}
        onFontSizeChange={setFontSize}
        onImageUpload={handleImageUpload}
      />
      <div className="flex justify-center bg-gray-200 py-10">
        <div className="bg-white w-[794px] min-h-[1122px] shadow-md p-10">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;
