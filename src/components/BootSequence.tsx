import { useState, useEffect, useRef, useCallback } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const SYSINFO_LINES = [
  'JOS Personal Computer BIOS v1.02',
  'Copyright (C) 2026 L-josh.',
  '',
  'Main Processor : Josh 8088',
  'Numeric Processor : None',
  'Floppy Drive A: 1.44M, 3.5 in.',
  'Display Type : VGA Color',
  'Serial Port(s) : 3F8',
  '',
  'Starting JOS...',
];

type Phase = 'memory' | 'cursor' | 'sysinfo' | 'done';

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>('memory');
  const [memoryKB, setMemoryKB] = useState(1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [sysinfoText, setSysinfoText] = useState('');
  const completedRef = useRef(false);

  // Phase 1: Memory count in semi-random chunks up to 512
  useEffect(() => {
    if (phase !== 'memory') return;

    const targetKB = 512;
    let currentKB = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      const chunk = 4 + Math.floor(Math.random() * 13); // 4–16 KB per step
      currentKB = Math.min(currentKB + chunk, targetKB);
      setMemoryKB(currentKB);

      if (currentKB < targetKB) {
        const delay = 30 + Math.floor(Math.random() * 50); // 30–80ms per step
        timeoutId = setTimeout(tick, delay);
      } else {
        setPhase('cursor');
      }
    }

    tick();
    return () => clearTimeout(timeoutId);
  }, [phase]);

  // Phase 2: Blinking cursor for ~2.5 seconds
  useEffect(() => {
    if (phase !== 'cursor') return;

    const blinkInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(blinkInterval);
      setCursorVisible(false);
      setPhase('sysinfo');
    }, 3500);

    return () => {
      clearInterval(blinkInterval);
      clearTimeout(timeout);
    };
  }, [phase]);

  // Phase 3: Typewriter system info — characters printed one at a time, very fast
  useEffect(() => {
    if (phase !== 'sysinfo') return;

    const fullText = SYSINFO_LINES.join('\n');
    let charIndex = 0;
    const totalChars = fullText.length;
    // Print all chars in under 100ms total but with visible per-char delay
    const charDelay = Math.min(1, 40 / totalChars);

    let timeoutId: ReturnType<typeof setTimeout>;

    function printNext() {
      if (charIndex >= totalChars) {
        setPhase('done');
        return;
      }
      charIndex++;
      setSysinfoText(fullText.slice(0, charIndex));
      timeoutId = setTimeout(printNext, charDelay);
    }

    printNext();
    return () => clearTimeout(timeoutId);
  }, [phase]);

  // Phase 4: Done — brief pause then complete
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (phase !== 'done') return;
    if (completedRef.current) return;
    completedRef.current = true;

    const timeout = setTimeout(() => {
      onCompleteRef.current();
    }, 3500);

    return () => clearTimeout(timeout);
  }, [phase]);

  const padKB = useCallback((kb: number) => {
    return String(kb).padStart(3, '0');
  }, []);

  return (
    <div className="terminal-output boot-sequence">
      {/* Memory count line */}
      <div className="output-entry">
        {padKB(memoryKB)} KB OK
      </div>

      {/* Blinking cursor during pause */}
      {phase === 'cursor' && (
        <div className="output-entry">
          <span className={cursorVisible ? 'boot-cursor' : 'boot-cursor-hidden'}>_</span>
        </div>
      )}

      {/* Typewriter system info */}
      {(phase === 'sysinfo' || phase === 'done') && (
        <>
          <div className="output-entry"> </div>
          <div className="output-entry boot-sysinfo">
            {sysinfoText}
            {phase === 'sysinfo' && <span className="boot-cursor">_</span>}
          </div>
        </>
      )}
    </div>
  );
}
