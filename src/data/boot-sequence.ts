export interface BootLine {
  text: string;
  delay: number; // ms to wait BEFORE showing this line
}

export const bootSequence: BootLine[] = [
  { text: '', delay: 500 },
  { text: 'JOS Personal Computer (tm)', delay: 0 },
  { text: 'Version 1.0  Copyright (C) 2026 LJOSH Corp.', delay: 100 },
  { text: '', delay: 300 },
  { text: 'BIOS Date 02/23/26', delay: 100 },
  { text: 'Checking RAM...', delay: 200 },
  { text: '640K OK', delay: 600 },
  { text: '', delay: 200 },
  { text: 'Starting JOS...', delay: 500 },
  { text: '', delay: 300 },
  { text: 'Welcome to JOS - Joshua Operating System', delay: 200 },
  { text: '', delay: 100 },
  { text: 'Type "help" to see available commands.', delay: 300 },
  { text: '', delay: 500 },
];
