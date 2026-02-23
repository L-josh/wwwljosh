import type { CommandHandler, OutputSegment } from "./types";
import { emptyLine } from "./types";

export const contactCommand: CommandHandler = {
  name: "contact",
  description: "How to reach me",
  execute: () => ({
    lines: [
      emptyLine(),
      [
        { text: "  GitHub    ", type: "text" as const },
        {
          text: "github.com/L-josh",
          type: "link" as const,
          href: "https://github.com/L-josh",
        },
      ] as OutputSegment[],
      [
        { text: "  LinkedIn  ", type: "text" as const },
        {
          text: "linkedin.com/in/joshdlane",
          type: "link" as const,
          href: "https://linkedin.com/in/joshdlane",
        },
      ] as OutputSegment[],
      emptyLine(),
    ],
  }),
};
