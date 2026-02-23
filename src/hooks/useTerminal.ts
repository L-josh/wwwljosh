import { useState, useCallback } from 'react';
import type { OutputSegment } from '../commands/types';
import { textLine, emptyLine } from '../commands/types';
import { getCommand } from '../commands/registry';
import { parseCommand } from '../lib/parseCommand';

export interface OutputEntry {
  id: number;
  type: 'command' | 'response';
  content: OutputSegment[][];
}

let nextId = 0;

export function useTerminal(initialOutput: OutputEntry[] = [], onPowerOff?: () => void) {
  const [output, setOutput] = useState<OutputEntry[]>(initialOutput);

  const executeCommand = useCallback((rawInput: string) => {
    const { name, args } = parseCommand(rawInput);

    // Add the command echo to output
    const commandEntry: OutputEntry = {
      id: nextId++,
      type: 'command',
      content: [textLine(rawInput)],
    };

    if (!name) {
      // Empty input — just show the prompt line
      setOutput((prev) => [...prev, commandEntry]);
      return;
    }

    const handler = getCommand(name);

    if (!handler) {
      const errorEntry: OutputEntry = {
        id: nextId++,
        type: 'response',
        content: [
          emptyLine(),
          textLine(`Bad command or file name: ${name}`),
          emptyLine(),
        ],
      };
      setOutput((prev) => [...prev, commandEntry, errorEntry]);
      return;
    }

    const result = handler.execute(args, {});

    if (result === 'CLEAR') {
      setOutput([]);
      return;
    }

    if (result === 'POWEROFF') {
      onPowerOff?.();
      return;
    }

    const responseEntry: OutputEntry = {
      id: nextId++,
      type: 'response',
      content: result.lines,
    };

    setOutput((prev) => [...prev, commandEntry, responseEntry]);
  }, [onPowerOff]);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  return { output, executeCommand, clearOutput };
}
