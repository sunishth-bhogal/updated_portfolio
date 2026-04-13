import { useEffect, useRef, useState } from "react";

/**
 * useTypewriter
 * words: array of strings to cycle
 * typeSpeed: ms per character typed
 * deleteSpeed: ms per character deleted
 * delayBetween: pause (ms) at end of a word before deleting/next
 */
export default function useTypewriter({
  words = [],
  typeSpeed = 70,
  deleteSpeed = 45,
  delayBetween = 1200,
  loop = true,
}) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);      // which word
  const [deleting, setDeleting] = useState(false);
  const saved = useRef({ words, typeSpeed, deleteSpeed, delayBetween, loop });

  useEffect(() => { saved.current = { words, typeSpeed, deleteSpeed, delayBetween, loop }; }, [words, typeSpeed, deleteSpeed, delayBetween, loop]);

  useEffect(() => {
    const { words, typeSpeed, deleteSpeed, delayBetween, loop } = saved.current;
    if (!words.length) return;

    const current = words[index % words.length];
    let timer;

    if (!deleting) {
      // typing
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      } else {
        // full word typed
        timer = setTimeout(() => setDeleting(true), delayBetween);
      }
    } else {
      // deleting
      if (text.length > 0) {
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
      } else {
        setDeleting(false);
        const next = index + 1;
        if (!loop && next >= words.length) return; // stop on last word if not looping
        setIndex(next % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [text, deleting, index]);

  return text;
}
