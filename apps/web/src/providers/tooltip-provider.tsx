'use client';

import * as React from 'react';

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (context === undefined) {
    throw new Error('useTooltip must be used within TooltipProvider');
  }
  return context;
}
