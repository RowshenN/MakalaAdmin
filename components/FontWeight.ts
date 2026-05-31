import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontWeight: {
      setFontWeight: (weight: string) => ReturnType;
      unsetFontWeight: () => ReturnType;
    };
  }
}

export const FontWeight = Extension.create({
  name: "fontWeight",

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
          fontWeight: {
            default: null,
            parseHTML: (el) => el.style.fontWeight,
            renderHTML: (attrs) => {
              if (!attrs.fontWeight) return {};
              return {
                style: `font-weight: ${attrs.fontWeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontWeight:
        (weight: string) =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontWeight: weight })
            .run();
        },

      unsetFontWeight:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontWeight: null })
            .run();
        },
    };
  },
});
