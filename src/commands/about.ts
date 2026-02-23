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
      textLine("  options before pivoting to building software."),
      emptyLine(),
      textLine("  Currently building back up his development chops."),
      emptyLine(),
    ],
  }),
};
