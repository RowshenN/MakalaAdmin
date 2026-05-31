import { Node } from "@tiptap/core";


export const PageBreak = Node.create({
  name: "pageBreak",
  group: "block",

  parseHTML() {
    return [{ tag: "div[data-page-break]" }];
  },

  renderHTML() {
    return ["div", { "data-page-break": "" }];
  },
});
