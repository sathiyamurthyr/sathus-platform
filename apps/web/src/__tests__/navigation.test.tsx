import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from '@/components/layout/navigation';
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

describe('Navigation', () => {
  it('renders nav items', () => {
    renderWithProviders(<Navigation />);
    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('has accessible aria attributes', () => {
    renderWithProviders(<Navigation />);
    const nav = screen.getByLabelText('Main');
    expect(nav).toBeInTheDocument();
  });

  it('opens mega menu on hover', async () => {
    renderWithProviders(<Navigation />);
    const solutionsLink = screen.getByText('Solutions');
    fireEvent.mouseEnter(solutionsLink.closest('div')!);
    await waitFor(() => {
      expect(screen.getByRole('menu', { name: 'Mega menu' })).toBeInTheDocument();
    });
  });
});
