// src/components/Typewriter.jsx
import React from "react";
import useTypewriter from "../hooks/useTypewriter";

export default function TypewriterText({
  words,
  typeSpeed,
  deleteSpeed,
  delayBetween,
  loop = true,
  className = "",
}) {
  const text = useTypewriter({
    words,
    typeSpeed,
    deleteSpeed,
    delayBetween,
    loop,
  });

  return (
    <span className={`typewriter ${className}`} aria-live="polite">
      {text}
      <span className="tw-caret" aria-hidden="true">|</span>
    </span>
  );
}
