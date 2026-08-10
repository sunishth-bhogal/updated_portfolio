// src/components/Reveal.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades + slides a block into place the first time it scrolls into view.
 * Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  y = 28,
  delay = 0,
  duration = 0.7,
  amount = 0.2,
  once = true,
  className,
  as = "div",
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
