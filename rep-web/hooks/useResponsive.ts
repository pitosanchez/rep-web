'use client';

import { useState } from 'react';

/**
 * Hook for managing hamburger menu state on mobile
 * CSS classes handle show/hide logic; this just manages the state
 */
export function useHamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(v => !v);
  const close = () => setIsOpen(false);
  return { isOpen, toggle, close };
}
