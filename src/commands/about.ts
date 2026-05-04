import type { CommandHandler } from "./types";
import { textLine, emptyLine } from "./types";

export const aboutCommand: CommandHandler = {
  name: "about",
  description: "Who is Joshua Lane?",
  execute: () => ({
    lines: [
      emptyLine(),
      textLine("  Joshua D. Lane"),
      textLine("  ─────────────────────────────────"),
      emptyLine(),
      textLine("  Studied Finance with a side of Mandarin Chinese, then"),
      textLine("  Computer Science at UNSW. Spent 3 years trading crypto"),
      textLine("  options at Akuna."),
      emptyLine(),
      textLine("  Currently gardening."),
      emptyLine(),
    ],
  }),
};
