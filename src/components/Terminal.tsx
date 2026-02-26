import { useRef, useEffect, useState, useCallback } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import type { OutputEntry } from '../hooks/useTerminal';
import { useCommandHistory } from '../hooks/useCommandHistory';
import { textLine, emptyLine } from '../commands/types';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import BootSequence from './BootSequence';
import PongGame from './PongGame';

const MOTD_TEXT = 'The JDL Personal Computer JOS\nVersion 1.00 (C)Copyright L-josh 2026\nType \'help\' to see available commands.';

let nextMotdId = -100;

const MOTD: OutputEntry[] = [
  {
    id: nextMotdId++,
    type: 'response',
    content: [
      textLine('The JDL Personal Computer JOS'),
      textLine('Version 1.00 (C)Copyright L-josh 2026'),
      textLine('Type \'help\' to see available commands.'),
      emptyLine(),
    ],
  },
];

type Phase = 'turning-on' | 'booting' | 'typing-motd' | 'ready' | 'pong' | 'shutting-down' | 'off';

const SHUTDOWN_DURATION = 800;
const TURNON_DURATION = 1500;

export default function Terminal() {
  const [phase, setPhase] = useState<Phase>('turning-on');
  const [motdVisible, setMotdVisible] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const handlePowerOff = useCallback(() => {
    setPhase('shutting-down');
    setTimeout(() => setPhase('off'), SHUTDOWN_DURATION);
  }, []);

  const handlePong = useCallback(() => {
    setPhase('pong');
  }, []);

  const handleExitPong = useCallback(() => {
    setPhase('ready');
  }, []);

  const { output, executeCommand } = useTerminal(MOTD, handlePowerOff, handlePong);
  const { push, navigateUp, navigateDown } = useCommandHistory();

  // Transition from turn-on animation to boot sequence
  useEffect(() => {
    if (phase !== 'turning-on') return;
    const timeout = setTimeout(() => setPhase('booting'), TURNON_DURATION);
    return () => clearTimeout(timeout);
  }, [phase]);

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
    const charDelay = Math.min(2, 150 / totalChars);
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

  // Determine screen CSS class
  const screenClass = [
    'monitor-screen',
    phase === 'turning-on' && 'crt-turning-on',
    phase === 'shutting-down' && 'crt-shutting-down',
    phase === 'off' && 'crt-off',
  ].filter(Boolean).join(' ');

  const isOff = phase === 'off';

  return (
    <div className="monitor-container">
      <div className="monitor">
        <div className="monitor-bezel">
          <div className={screenClass}>
            <div className="crt-overlay" />
            <div className="terminal" ref={terminalRef} onClick={handleClick}>
              {phase === 'turning-on' ? null
                : phase === 'booting' ? (
                  <BootSequence onComplete={() => setPhase('typing-motd')} />
                ) : phase === 'typing-motd' ? (
                  <div className="terminal-output">
                    <div className="output-entry boot-sysinfo">
                      {motdVisible}
                      <span className="cursor">_</span>
                    </div>
                  </div>
                ) : phase === 'pong' ? (
                  <PongGame onExit={handleExitPong} />
                ) : phase === 'ready' ? (
                  <>
                    <TerminalOutput entries={output} />
                    <TerminalInput
                      onSubmit={handleSubmit}
                      onNavigateUp={navigateUp}
                      onNavigateDown={navigateDown}
                    />
                  </>
                ) : null}
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
            <div className={isOff ? 'monitor-led monitor-led-off' : 'monitor-led'} />
            <div className="monitor-knob" />
            <div className="monitor-knob" />
          </div>
        </div>
      </div>
    </div>
  );
}
