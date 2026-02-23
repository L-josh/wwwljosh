import type { CommandHandler, OutputSegment } from './types';
import { emptyLine } from './types';

export const contactCommand: CommandHandler = {
  name: 'contact',
  description: 'How to reach me',
  execute: () => ({
    lines: [
      emptyLine(),
      [
        { text: '  Email     ', type: 'text' as const },
        { text: 'josh@example.com', type: 'link' as const, href: 'mailto:josh@example.com' },
      ] as OutputSegment[],
      [
        { text: '  GitHub    ', type: 'text' as const },
        { text: 'github.com/lanej', type: 'link' as const, href: 'https://github.com/lanej' },
      ] as OutputSegment[],
      [
        { text: '  LinkedIn  ', type: 'text' as const },
        { text: 'linkedin.com/in/joshlane', type: 'link' as const, href: 'https://linkedin.com/in/joshlane' },
      ] as OutputSegment[],
      emptyLine(),
    ],
  }),
};
