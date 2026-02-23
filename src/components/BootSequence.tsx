import { useBootSequence } from '../hooks/useBootSequence';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const lines = useBootSequence(onComplete);

  return (
    <div className="terminal-output">
      {lines.map((line, i) => (
        <div key={i} className="output-entry">
          {line}
        </div>
      ))}
    </div>
  );
}
