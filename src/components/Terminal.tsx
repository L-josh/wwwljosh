import { useRef, useEffect, useState } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import type { OutputEntry } from '../hooks/useTerminal';
import { useCommandHistory } from '../hooks/useCommandHistory';
import { textLine, emptyLine } from '../commands/types';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import BootSequence from './BootSequence';

const MOTD_TEXT = 'The JOSH LANE Personal Computer JOS\nVersion 1.00 (C)Copyright JDL 2026';

let nextMotdId = -100;

const MOTD: OutputEntry[] = [
  {
    id: nextMotdId++,
    type: 'response',
    content: [
      textLine('The JOSH LANE Personal Computer JOS'),
      textLine('Version 1.00 (C)Copyright JDL 2026'),
      emptyLine(),
    ],
  },
];

export default function Terminal() {
  const { output, executeCommand } = useTerminal(MOTD);
  const { push, navigateUp, navigateDown } = useCommandHistory();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'booting' | 'typing-motd' | 'ready'>('booting');
  const [motdVisible, setMotdVisible] = useState('');

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, motdVisible]);

  // Typewriter MOTD phase
  useEffect(() => {
    if (phase !== 'typing-motd') return;

    let charIndex = 0;
    const totalChars = MOTD_TEXT.length;
    const charDelay = Math.min(2, 80 / totalChars);
    let timeoutId: ReturnType<typeof setTimeout>;

    function printNext() {
      if (charIndex >= totalChars) {
        setTimeout(() => setPhase('ready'), 300);
        return;
      }
      charIndex++;
      setMotdVisible(MOTD_TEXT.slice(0, charIndex));
      timeoutId = setTimeout(printNext, charDelay);
    }

    printNext();
    return () => clearTimeout(timeoutId);
  }, [phase]);

  // Click anywhere to focus input
  const handleClick = () => {
    const input = terminalRef.current?.querySelector<HTMLInputElement>('.terminal-input-hidden');
    input?.focus();
  };

  const handleSubmit = (command: string) => {
    push(command);
    executeCommand(command);
  };

  return (
    <div className="monitor-container">
      <div className="monitor">
        <div className="monitor-bezel">
          <div className="monitor-screen">
            <div className="crt-overlay" />
            <div className="terminal" ref={terminalRef} onClick={handleClick}>
              {phase === 'booting' ? (
                <BootSequence onComplete={() => setPhase('typing-motd')} />
              ) : phase === 'typing-motd' ? (
                <div className="terminal-output">
                  <div className="output-entry boot-sysinfo">
                    {motdVisible}
                    <span className="cursor">_</span>
                  </div>
                </div>
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
          </div>
        </div>
        <div className="monitor-bottom">
          <div className="monitor-brand">
            <span className="monitor-brand-logo">
              <span className="rainbow-bar rb-red" />
              <span className="rainbow-bar rb-green" />
              <span className="rainbow-bar rb-blue" />
              <span className="rainbow-bar rb-yellow" />
            </span>
            <span className="monitor-brand-text">jdl</span>
          </div>
          <div className="monitor-model">VIDEO MONITOR &bull; MODEL 1702</div>
          <div className="monitor-controls">
            <div className="monitor-led" />
            <div className="monitor-knob" />
            <div className="monitor-knob" />
          </div>
        </div>
      </div>
    </div>
  );
}
