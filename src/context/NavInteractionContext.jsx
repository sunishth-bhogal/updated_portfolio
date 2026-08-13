// src/context/NavInteractionContext.jsx
// Bridges the navbar's link hover/click state to the hero's hanging ID
// badge, which lives in a completely different part of the tree (Navbar is
// global; LanyardBadge only renders inside the home hero). Rather than prop
// drilling through App, both sides just read/write this shared context.
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const NavInteractionContext = createContext(null);

export function NavInteractionProvider({ children }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [swing, setSwing] = useState(null);
  const swingSeq = useRef(0);

  const triggerSwing = useCallback((index) => {
    swingSeq.current += 1;
    setSwing({ index, key: swingSeq.current });
  }, []);

  const value = useMemo(
    () => ({ hoverIndex, setHoverIndex, swing, triggerSwing }),
    [hoverIndex, swing, triggerSwing]
  );

  return <NavInteractionContext.Provider value={value}>{children}</NavInteractionContext.Provider>;
}

const FALLBACK = { hoverIndex: null, setHoverIndex: () => {}, swing: null, triggerSwing: () => {} };

export function useNavInteraction() {
  return useContext(NavInteractionContext) || FALLBACK;
}
