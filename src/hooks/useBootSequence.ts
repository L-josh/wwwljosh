import { useState, useEffect, useRef } from 'react';
import { bootSequence } from '../data/boot-sequence';

export function useBootSequence(onComplete: () => void) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentIndex = 0;

    function showNextLine() {
      if (currentIndex >= bootSequence.length) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
        return;
      }

      const line = bootSequence[currentIndex];
      timeoutId = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.text]);
        currentIndex++;
        showNextLine();
      }, line.delay);
    }

    showNextLine();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return visibleLines;
}
