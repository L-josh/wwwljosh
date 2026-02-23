import type { OutputSegment } from '../commands/types';

interface OutputLineProps {
  segments: OutputSegment[];
}

export default function OutputLine({ segments }: OutputLineProps) {
  return (
    <div className="output-entry">
      {segments.map((segment, i) => {
        if (segment.type === 'link' && segment.href) {
          return (
            <a key={i} href={segment.href} target="_blank" rel="noopener noreferrer">
              {segment.text}
            </a>
          );
        }
        if (segment.type === 'accent') {
          return (
            <span key={i} className="accent">
              {segment.text}
            </span>
          );
        }
        return <span key={i}>{segment.text}</span>;
      })}
    </div>
  );
}
