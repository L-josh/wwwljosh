import type { CommandHandler } from './types';

export const pongCommand: CommandHandler = {
  name: 'pong',
  description: 'Play a game of Pong (ESC to exit)',
  execute: () => 'PONG',
};
