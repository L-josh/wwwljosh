import { useState, useCallback } from 'react';

export function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);

  const push = useCallback((command: string) => {
    if (command.trim()) {
      setHistory((prev) => [...prev, command]);
    }
    setIndex(-1);
  }, []);

  const navigateUp = useCallback(
    (_currentInput: string): string | null => {
      if (history.length === 0) return null;

      const newIndex = index === -1 ? history.length - 1 : Math.max(0, index - 1);
      setIndex(newIndex);
      return history[newIndex];
    },
    [history, index]
  );

  const navigateDown = useCallback((): string | null => {
    if (index === -1) return null;

    if (index >= history.length - 1) {
      setIndex(-1);
      return '';
    }

    const newIndex = index + 1;
    setIndex(newIndex);
    return history[newIndex];
  }, [history, index]);

  const resetIndex = useCallback(() => {
    setIndex(-1);
  }, []);

  return { push, navigateUp, navigateDown, resetIndex };
}
