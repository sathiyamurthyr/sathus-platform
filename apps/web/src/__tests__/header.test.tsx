import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from '@/providers/theme-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { MotionProvider } from '@/providers/motion-provider';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MotionProvider reducedMotion="user">
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <ToastProvider>
            {ui}
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </MotionProvider>
  );
};

describe('Header', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders Sathus logo', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Sathus Technology')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    renderWithProviders(<Header />);
    expect(screen.getAllByText('Solutions').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Products').length).toBeGreaterThan(0);
  });

  it('opens mobile menu', () => {
    renderWithProviders(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    expect(screen.getByRole('dialog', { name: 'Mobile menu' })).toBeInTheDocument();
  });

  it('opens search dialog', () => {
    renderWithProviders(<Header />);
    const searchButton = screen.getByLabelText('Open search');
    fireEvent.click(searchButton);
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
  });
});
