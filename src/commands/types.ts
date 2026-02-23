export interface OutputSegment {
  text: string;
  type: 'text' | 'link' | 'accent';
  href?: string;
}

export interface CommandOutput {
  lines: OutputSegment[][];
}

export interface CommandContext {}

export interface CommandHandler {
  name: string;
  description: string;
  execute: (args: string[], ctx: CommandContext) => CommandOutput | 'CLEAR';
}

// Helper to create a simple text line
export function textLine(text: string): OutputSegment[] {
  return [{ text, type: 'text' }];
}

// Helper to create an empty line
export function emptyLine(): OutputSegment[] {
  return [{ text: '', type: 'text' }];
}
