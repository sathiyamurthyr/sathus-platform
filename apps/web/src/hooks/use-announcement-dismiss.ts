import * as React from 'react';

const STORAGE_KEY = 'sathus-announcement-v3';

export function useAnnouncementDismiss(total: number) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        setIsVisible(false);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  React.useEffect(() => {
    if (!isVisible || total <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => clearInterval(id);
  }, [isVisible, total]);

  const dismiss = React.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsVisible(false);
  }, []);

  return { isVisible, index, dismiss, setIndex };
}
