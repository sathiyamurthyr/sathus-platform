import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { ThemeProvider } from '@/providers/theme-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <TooltipProvider>
        {ui}
      </TooltipProvider>
    </ThemeProvider>
  );
};

describe('MobileMenu', () => {
  it('renders when open', () => {
    renderWithProviders(<MobileMenu open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Mobile menu' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<MobileMenu open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog', { name: 'Mobile menu' })).not.toBeInTheDocument();
  });

  it('expands nested navigation', () => {
    renderWithProviders(<MobileMenu open={true} onClose={() => {}} />);
    const solutionsButton = screen.getByText('Solutions');
    fireEvent.click(solutionsButton);
    expect(screen.getByText('Agent Platforms')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    renderWithProviders(<MobileMenu open={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
