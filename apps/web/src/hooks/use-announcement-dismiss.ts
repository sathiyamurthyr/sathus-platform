import * as React from 'react';

export function useAnnouncementDismiss(total: number) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isVisible || total <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => clearInterval(id);
  }, [isVisible, total]);

  const dismiss = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  return { isVisible, index, dismiss, setIndex };
}
