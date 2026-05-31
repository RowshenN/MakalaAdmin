export const PAGE_HEIGHT = 1122;

export const FONT_FAMILIES = [
  "Arial",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Tahoma",
] as const;

export const TEXT_COLORS = [
  { label: "Red", value: "#ff0000" },
  { label: "Blue", value: "#0000ff" },
  { label: "Green", value: "#2E6F40" },
] as const;

export const HIGHLIGHT_COLORS = [
  { label: "Yellow BG", value: "#ffff00" },
  { label: "Green BG", value: "#90ee90" },
] as const;

export const FONT_WEIGHTS = [
  { label: "Light", value: "300" },
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi-Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
] as const;

export const LINE_HEIGHTS = ["1", "1.5", "2"] as const;
