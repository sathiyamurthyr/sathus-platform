import * as React from 'react';

export type AutosaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export interface UseAutosaveOptions<T> {
  value: T;
  onSave: (value: T) => Promise<void> | void;
  delay?: number;
  enabled?: boolean;
  onError?: (error: unknown) => void;
}

export interface UseAutosaveResult {
  status: AutosaveStatus;
  lastSavedAt: Date | null;
  flush: () => Promise<void>;
  isDirty: boolean;
}

export function useAutosave<T>(options: UseAutosaveOptions<T>): UseAutosaveResult {
  const { value, onSave, delay = 1500, enabled = true, onError } = options;

  const valueRef = React.useRef(value);
  const onSaveRef = React.useRef(onSave);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = React.useState<AutosaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const flush = React.useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const snapshot = valueRef.current;
    setStatus('saving');
    setDirty(false);
    try {
      await onSaveRef.current(snapshot);
      if (!mountedRef.current) return;
      setStatus('saved');
      setLastSavedAt(new Date());
    } catch (error) {
      if (!mountedRef.current) return;
      setStatus('error');
      onError?.(error);
    }
  }, [onError]);

  React.useEffect(() => {
    if (!enabled) return;
    const serialized = JSON.stringify(value);
    if (serialized === JSON.stringify(valueRef.current)) return;
    valueRef.current = value;
    setDirty(true);
    setStatus('dirty');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void flush();
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, enabled, delay, flush]);

  return { status, lastSavedAt, flush, isDirty: dirty };
}
