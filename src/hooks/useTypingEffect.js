import { useState, useEffect } from 'react';

const useTypingEffect = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    if (!text) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => {
          const nextChar = text.charAt(index);
          // Handle markdown characters properly
          if (nextChar === '`' || nextChar === '*' || nextChar === '_') {
            const remainingText = text.slice(index);
            const markdownEnd = remainingText.indexOf(nextChar, 1);
            if (markdownEnd !== -1) {
              const markdownSection = remainingText.slice(0, markdownEnd + 1);
              index += markdownSection.length - 1;
              return prev + markdownSection;
            }
          }
          return prev + nextChar;
        });
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
};

export default useTypingEffect;
