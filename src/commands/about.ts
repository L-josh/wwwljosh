import type { CommandHandler } from './types';
import { textLine, emptyLine } from './types';

export const aboutCommand: CommandHandler = {
  name: 'about',
  description: 'Who is Joshua Lane?',
  execute: () => ({
    lines: [
      emptyLine(),
      textLine('  Joshua Lane'),
      textLine('  ─────────────────────────────────'),
      emptyLine(),
      textLine('  Former options trader turned software engineer.'),
      textLine('  Studied Finance & Mandarin Chinese, then Computer'),
      textLine('  Science at UNSW. Spent 3 years trading cryptocurrency'),
      textLine('  options before pivoting to building software.'),
      emptyLine(),
      textLine('  Currently rebuilding development skills and seeking'),
      textLine('  software engineering opportunities.'),
      emptyLine(),
    ],
  }),
};
