import { Extension } from "@tiptap/core";

export const LineHeight = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (el) => el.style.lineHeight,
            renderHTML: (attrs) => {
              if (!attrs.lineHeight) return {};
              return {
                style: `line-height: ${attrs.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (height: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { lineHeight: height }).run(),

      unsetLineHeight:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { lineHeight: null }).run(),
    };
  },
});
