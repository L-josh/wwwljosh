import type { OutputEntry } from '../hooks/useTerminal';
import OutputLine from './OutputLine';

const PROMPT = 'A> ';

interface TerminalOutputProps {
  entries: OutputEntry[];
}

export default function TerminalOutput({ entries }: TerminalOutputProps) {
  return (
    <div className="terminal-output">
      {entries.map((entry) => (
        <div key={entry.id}>
          {entry.type === 'command' ? (
            <div className="output-entry output-command">
              <span className="prompt">{PROMPT}</span>
              {entry.content[0]?.[0]?.text}
            </div>
          ) : (
            entry.content.map((line, lineIdx) => (
              <OutputLine key={lineIdx} segments={line} />
            ))
          )}
        </div>
      ))}
    </div>
  );
}
