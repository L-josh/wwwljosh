import type { CommandHandler } from './types';
import { textLine, emptyLine } from './types';
import { getAllCommands } from './registry';

export const helpCommand: CommandHandler = {
  name: 'help',
  description: 'List available commands',
  execute: () => {
    const commands = getAllCommands();
    const maxNameLen = Math.max(...commands.map((c) => c.name.length));

    const lines = [
      emptyLine(),
      textLine('  Available commands:'),
      emptyLine(),
      ...commands.map((cmd) =>
        textLine(`  ${cmd.name.padEnd(maxNameLen + 4)}${cmd.description}`)
      ),
      emptyLine(),
    ];

    return { lines };
  },
};
