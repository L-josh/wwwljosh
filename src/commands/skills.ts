import type { CommandHandler } from './types';
import { textLine, emptyLine } from './types';

export const skillsCommand: CommandHandler = {
  name: 'skills',
  description: 'Technical skills and technologies',
  execute: () => ({
    lines: [
      emptyLine(),
      textLine('  Languages     TypeScript, JavaScript, Python, C'),
      textLine('  Frontend      React, HTML, CSS'),
      textLine('  Backend       Node.js, Express'),
      textLine('  Tools         Git, Linux, VS Code'),
      textLine('  Learning      Rust, Systems Programming'),
      emptyLine(),
    ],
  }),
};
