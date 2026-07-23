'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { NavState } from './navigation.types';

export function useMegaMenu(delay = 250) {
  const [state, setState] = useState<NavState>('IDLE');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const openMenu = useCallback((itemLabel: string) => {
    clearTimer();
    setState('OPEN');
    setActiveItem(itemLabel);
  }, [clearTimer]);

  const closeMenu = useCallback(() => {
    clearTimer();
    setState('CLOSING');
    timeoutRef.current = setTimeout(() => {
      setState('IDLE');
      setActiveItem(null);
    }, delay);
  }, [clearTimer, delay]);

  const handleMouseEnterTrigger = useCallback((itemLabel: string) => {
    openMenu(itemLabel);
  }, [openMenu]);

  const handleMouseLeaveTrigger = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const handleMouseEnterMenu = useCallback(() => {
    clearTimer();
    setState('OPEN');
  }, [clearTimer]);

  const handleMouseLeaveMenu = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const handleOutsideClick = useCallback(() => {
    clearTimer();
    setState('IDLE');
    setActiveItem(null);
  }, [clearTimer]);

  const handleEscape = useCallback(() => {
    clearTimer();
    setState('IDLE');
    setActiveItem(null);
  }, [clearTimer]);

  const handleNavigation = useCallback(() => {
    clearTimer();
    setState('IDLE');
    setActiveItem(null);
  }, [clearTimer]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    activeItem,
    handleMouseEnterTrigger,
    handleMouseLeaveTrigger,
    handleMouseEnterMenu,
    handleMouseLeaveMenu,
    handleOutsideClick,
    handleEscape,
    handleNavigation,
  };
}
