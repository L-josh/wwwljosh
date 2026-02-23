import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

const PROMPT = 'A>';

interface TerminalInputProps {
  onSubmit: (command: string) => void;
  onNavigateUp: (currentInput: string) => string | null;
  onNavigateDown: () => string | null;
}

export default function TerminalInput({
  onSubmit,
  onNavigateUp,
  onNavigateDown,
}: TerminalInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = onNavigateUp(input);
      if (prev !== null) setInput(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = onNavigateDown();
      if (next !== null) setInput(next);
    }
  };

  return (
    <div className="terminal-input-line" onClick={() => inputRef.current?.focus()}>
      <span className="prompt">{PROMPT}</span>
      <span className="input-display">
        {input}
        <span className="cursor">_</span>
      </span>
      <input
        ref={inputRef}
        className="terminal-input-hidden"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}
