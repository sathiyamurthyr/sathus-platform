import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchDialog } from '@/components/layout/search';
import { CommandPalette } from '@/components/layout/command-palette';
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

describe('SearchDialog', () => {
  it('renders when open', () => {
    renderWithProviders(<SearchDialog open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<SearchDialog open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument();
  });

  it('filters results on input', async () => {
    renderWithProviders(<SearchDialog open={true} onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/Search documentation/i);
    fireEvent.change(input, { target: { value: 'Sathus AI' } });
    await waitFor(() => {
      expect(screen.getByText('Sathus AI Platform')).toBeInTheDocument();
    });
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    renderWithProviders(<SearchDialog open={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

describe('CommandPalette', () => {
  it('renders when open', () => {
    renderWithProviders(<CommandPalette open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<CommandPalette open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument();
  });

  it('renders commands', () => {
    renderWithProviders(<CommandPalette open={true} onClose={() => {}} />);
    expect(screen.getByText('Go to Products')).toBeInTheDocument();
    expect(screen.getByText('Toggle Theme')).toBeInTheDocument();
  });
});
