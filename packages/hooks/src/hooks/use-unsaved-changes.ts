import * as React from 'react';

export interface UseUnsavedChangesOptions {
  dirty: boolean;
  message?: string;
}

export interface UseUnsavedChangesResult {
  dirty: boolean;
  reset: () => void;
}

export function useUnsavedChanges(options: UseUnsavedChangesOptions): UseUnsavedChangesResult {
  const { dirty, message = 'You have unsaved changes. Leaving this page will discard them.' } = options;
  const [internalDirty, setInternalDirty] = React.useState(dirty);

  React.useEffect(() => {
    setInternalDirty(dirty);
  }, [dirty]);

  React.useEffect(() => {
    if (!internalDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [internalDirty, message]);

  const reset = React.useCallback(() => setInternalDirty(false), []);

  return { dirty: internalDirty, reset };
}
