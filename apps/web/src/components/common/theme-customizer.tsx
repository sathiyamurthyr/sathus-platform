'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, X, Sparkles, Check, Zap, Eye, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const [accentColor, setAccentColor] = React.useState<'emerald' | 'violet' | 'cyan' | 'rose'>('emerald');
  const [density, setDensity] = React.useState<'comfortable' | 'compact'>('comfortable');

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accentColor);
    root.setAttribute('data-density', density);
  }, [accentColor, density]);

  const accentOptions = [
    { id: 'emerald', label: 'Emerald AI', bgClass: 'bg-emerald-500' },
    { id: 'violet', label: 'Violet Glow', bgClass: 'bg-violet-500' },
    { id: 'cyan', label: 'Cyan Electric', bgClass: 'bg-cyan-500' },
    { id: 'rose', label: 'Rose Gold', bgClass: 'bg-rose-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-2xl border border-primary/40 flex items-center justify-center p-0"
          aria-label="Open Visual Theme Customizer"
          title="Open Visual Theme Customizer"
        >
          <Sliders className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Floating Control Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-16 right-0 w-80 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl p-5 shadow-2xl space-y-5 text-foreground"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-extrabold">Visual Customizer</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Base Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Theme Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    resolvedTheme === 'dark'
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Dark Mode
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    resolvedTheme === 'light'
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Light Mode
                </button>
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Primary Accent Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {accentOptions.map((accent) => (
                  <button
                    key={accent.id}
                    onClick={() => setAccentColor(accent.id as any)}
                    className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                      accentColor === accent.id ? 'border-foreground ring-2 ring-primary/40 scale-105' : 'border-border'
                    }`}
                    title={accent.label}
                  >
                    <span className={`h-4 w-4 rounded-full ${accent.bgClass} flex items-center justify-center`}>
                      {accentColor === accent.id && <Check className="h-2.5 w-2.5 text-white" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-Animation Density */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Micro-Animations
              </label>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Motion Effects
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  Active (Spring)
                </span>
              </div>
            </div>

            {/* Reset */}
            <div className="pt-2 border-t border-border flex justify-end">
              <button
                onClick={() => {
                  setTheme('dark');
                  setAccentColor('emerald');
                }}
                className="text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Reset Defaults
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
