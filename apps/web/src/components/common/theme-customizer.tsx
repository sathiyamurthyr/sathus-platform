'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, X, Sparkles, Check, Zap, Sun } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setTheme } = useTheme();

  const [accentColor, setAccentColor] = React.useState<'burgundy' | 'orange' | 'gold'>('burgundy');

  React.useEffect(() => {
    try {
      const savedAccent = localStorage.getItem('sathus-accent') as any;
      if (savedAccent && ['burgundy', 'orange', 'gold'].includes(savedAccent)) {
        setAccentColor(savedAccent);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accentColor);
    try {
      localStorage.setItem('sathus-accent', accentColor);
    } catch {
      // localStorage unavailable
    }
  }, [accentColor]);

  const accentOptions = [
    { id: 'burgundy', label: 'Primary Burgundy (#A20A3A)', bgClass: 'bg-[#A20A3A]' },
    { id: 'orange', label: 'Vibrant Orange (#FF9933)', bgClass: 'bg-[#FF9933]' },
    { id: 'gold', label: 'Golden Yellow (#EDC11E)', bgClass: 'bg-[#EDC11E]' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-[#A20A3A] hover:bg-[#8C0832] text-white shadow-xl border border-[#EDE1E6] flex items-center justify-center p-0"
          aria-label="Open Sathus Brand Customizer"
          title="Open Sathus Brand Customizer"
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
            className="absolute bottom-16 right-0 w-80 rounded-2xl border border-[#EDE1E6] bg-white/95 backdrop-blur-xl p-5 shadow-2xl space-y-5 text-[#292329]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EDE1E6] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#A20A3A]" />
                <h3 className="text-sm font-extrabold text-[#292329]">Official Brand Palette</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-[#635861] hover:text-[#292329]"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Base Theme Indicator */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#635861] uppercase tracking-wider">
                Brand Surface Mode
              </label>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-[#EDE1E6] bg-[#FAF8F9] text-xs font-semibold text-[#292329]">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-[#FF9933]" />
                  <span>White Surface (#FFFFFF)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#A20A3A] bg-[#F9EEF2] border border-[#EDE1E6] px-2 py-0.5 rounded-full">
                  Official Standard
                </span>
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#635861] uppercase tracking-wider">
                Brand Highlight Accent
              </label>
              <div className="grid grid-cols-3 gap-2">
                {accentOptions.map((accent) => (
                  <button
                    key={accent.id}
                    onClick={() => setAccentColor(accent.id as any)}
                    className={`h-10 rounded-lg border flex items-center justify-center transition-all ${
                      accentColor === accent.id ? 'border-[#A20A3A] ring-2 ring-[#A20A3A]/30 scale-105 shadow-sm' : 'border-[#EDE1E6] bg-[#FAF8F9]'
                    }`}
                    title={accent.label}
                  >
                    <span className={`h-4 w-4 rounded-full ${accent.bgClass} flex items-center justify-center shadow-inner`}>
                      {accentColor === accent.id && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-Animation Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#635861] uppercase tracking-wider">
                Enterprise Motion
              </label>
              <div className="flex items-center justify-between rounded-lg border border-[#EDE1E6] bg-[#FAF8F9] p-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#292329]">
                  <Zap className="h-3.5 w-3.5 text-[#FF9933]" />
                  Physics Animations
                </div>
                <span className="inline-flex items-center rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-bold text-[#10B981]">
                  Enabled
                </span>
              </div>
            </div>

            {/* Reset */}
            <div className="pt-2 border-t border-[#EDE1E6] flex justify-end">
              <button
                onClick={() => {
                  setTheme('light');
                  setAccentColor('burgundy');
                }}
                className="text-[11px] font-semibold text-[#635861] hover:text-[#A20A3A] transition-colors"
              >
                Reset Brand Defaults
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
