import { useState, useEffect } from 'react';

interface UseTypingAnimationProps {
  strings: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const useTypingAnimation = ({
  strings,
  typingSpeed = 100,
  deletingSpeed = 30,
  pauseDuration = 750,
}: UseTypingAnimationProps) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(typingSpeed);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = strings[index];

      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setSpeed(deletingSpeed);
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setSpeed(typingSpeed);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % strings.length);
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [
    displayText,
    isDeleting,
    index,
    strings,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    speed,
  ]);

  return displayText;
};
