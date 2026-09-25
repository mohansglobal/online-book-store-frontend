"use client";

import { useEffect, useState } from "react";

// Hook to simulate typewriter effect for rotating phrases
export function useTypewriter(words: readonly string[]) {
  const [text, setText] = useState("");

  useEffect(() => {
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    let timeoutId: number;

    const typeSpeed = 60;
    const deleteSpeed = 30;
    const pauseEnd = 1600;
    const pauseStart = 350;

    const tick = (): void => {
      const currentPhrase = words[phraseIndex];

      if (!isDeleting) {
        characterIndex += 1;

        setText(currentPhrase.slice(0, characterIndex));

        if (characterIndex === currentPhrase.length) {
          isDeleting = true;
          timeoutId = window.setTimeout(tick, pauseEnd);
          return;
        }

        timeoutId = window.setTimeout(tick, typeSpeed);
        return;
      }

      characterIndex -= 1;

      setText(currentPhrase.slice(0, characterIndex));

      if (characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % words.length;

        timeoutId = window.setTimeout(tick, pauseStart);
        return;
      }

      timeoutId = window.setTimeout(tick, deleteSpeed);
    };

    timeoutId = window.setTimeout(tick, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [words]);

  return text;
}
