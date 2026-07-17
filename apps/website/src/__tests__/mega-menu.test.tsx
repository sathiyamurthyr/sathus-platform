import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MegaMenu } from '@/components/layout/mega-menu';
import { megaMenuSections } from '@/constants';
import { ThemeProvider } from '@/providers/theme-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';

const testSections = megaMenuSections['Solutions'];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <TooltipProvider>
        {ui}
      </TooltipProvider>
    </ThemeProvider>
  );
};

describe('MegaMenu', () => {
  it('renders sections', () => {
    renderWithProviders(<MegaMenu sections={testSections} onClose={() => {}} />);
    const menus = screen.getAllByRole('menu');
    expect(menus.length).toBeGreaterThan(0);
    expect(screen.getByText('AI Engineering')).toBeInTheDocument();
  });

  it('renders columns', () => {
    renderWithProviders(<MegaMenu sections={testSections} onClose={() => {}} />);
    expect(screen.getByText('AI Engineering')).toBeInTheDocument();
    expect(screen.getByText('Data Engineering')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Applications')).toBeInTheDocument();
    expect(screen.getByText('Recent Updates')).toBeInTheDocument();
  });

  it('renders featured cards', () => {
    renderWithProviders(<MegaMenu sections={testSections} onClose={() => {}} />);
    expect(screen.getByText('Sathus AI 2.0')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    renderWithProviders(<MegaMenu sections={testSections} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
