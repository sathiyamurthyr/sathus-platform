import * as React from 'react';

const STORAGE_KEY = 'sathus-announcement-dismissed';

export function useAnnouncementDismiss(total: number) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setIsVisible(true);
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
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  }, []);

  return { isVisible, index, dismiss, setIndex };
}
