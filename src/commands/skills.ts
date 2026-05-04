import type { CommandHandler } from "./types";
import { textLine, emptyLine } from "./types";

export const skillsCommand: CommandHandler = {
  name: "skills",
  description: "Technical skills and technologies",
  execute: () => ({
    lines: [
      emptyLine(),
      textLine("  Languages     Python, C++, SQL"),
      textLine("  Frontend      React, HTML, CSS"),
      textLine("  Tools         Git, Claude Code/Codex"),
      textLine("  Learning      Rust, Systems Programming"),
      emptyLine(),
    ],
  }),
};
