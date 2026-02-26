import type { CommandHandler } from './types';
import { aboutCommand } from './about';
import { skillsCommand } from './skills';
import { contactCommand } from './contact';
import { clearCommand } from './clear';
import { helpCommand } from './help';
import { poweroffCommand } from './poweroff';
import { pongCommand } from './pong';

const commands: Map<string, CommandHandler> = new Map();

function register(handler: CommandHandler) {
  commands.set(handler.name, handler);
}

register(helpCommand);
register(aboutCommand);
register(skillsCommand);
register(contactCommand);
register(clearCommand);
register(poweroffCommand);
register(pongCommand);

export function getCommand(name: string): CommandHandler | undefined {
  return commands.get(name.toLowerCase());
}

export function getAllCommands(): CommandHandler[] {
  return Array.from(commands.values());
}
