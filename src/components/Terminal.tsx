import { useRef, useEffect, useState } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import { useCommandHistory } from '../hooks/useCommandHistory';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import BootSequence from './BootSequence';

export default function Terminal() {
  const { output, executeCommand } = useTerminal();
  const { push, navigateUp, navigateDown } = useCommandHistory();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'booting' | 'ready'>('booting');

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Click anywhere to focus input
  const handleClick = () => {
    const input = terminalRef.current?.querySelector<HTMLInputElement>('.terminal-input');
    input?.focus();
  };

  const handleSubmit = (command: string) => {
    push(command);
    executeCommand(command);
  };

  return (
    <>
      <div className="crt-overlay" />
      <div className="terminal" ref={terminalRef} onClick={handleClick}>
        {phase === 'booting' ? (
          <BootSequence onComplete={() => setPhase('ready')} />
        ) : (
          <>
            <TerminalOutput entries={output} />
            <TerminalInput
              onSubmit={handleSubmit}
              onNavigateUp={navigateUp}
              onNavigateDown={navigateDown}
            />
          </>
        )}
      </div>
    </>
  );
}
