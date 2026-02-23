import type { CommandHandler } from './types';

export const poweroffCommand: CommandHandler = {
  name: 'poweroff',
  description: 'Shut down the system',
  execute: () => 'POWEROFF' as any,
};
