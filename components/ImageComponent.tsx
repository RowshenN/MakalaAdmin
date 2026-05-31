import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

export const ImageComponent = ({ node, editor, getPos }: any) => {
  const remove = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  const setAlign = (align: string) => {
    editor.chain().focus().updateAttributes("image", { align }).run();
  };

  const alignClass =
    node.attrs.align === "left"
      ? "float-left mr-4"
      : node.attrs.align === "right"
        ? "float-right ml-4"
        : "mx-auto block";

  return (
    <NodeViewWrapper className={`relative group ${alignClass}`}>
      <img
        src={node.attrs.src}
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : "auto",
          height: node.attrs.height ? `${node.attrs.height}px` : "auto",
          display: "block",
          margin: "16px auto",
        }}
      />

      {/* ❌ DELETE */}
      <button
        onClick={remove}
        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 cursor-pointer rounded"
      >
        ✕
      </button>

      {/* 🔥 ALIGN BUTTONS */}
      <div className="absolute bottom-1 left-1 flex gap-1">
        <button
          type="button"
          onClick={() => setAlign("left")}
          className="bg-white px-1 h-6 w-6 cursor-pointer text-xs border"
        >
          L
        </button>
        <button
          type="button"
          onClick={() => setAlign("center")}
          className="bg-white px-1 h-6 w-6 cursor-pointer text-xs border"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => setAlign("right")}
          className="bg-white px-1 h-6 w-6 cursor-pointer text-xs border"
        >
          R
        </button>
      </div>
    </NodeViewWrapper>
  );
};
