import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ThemeProvider } from '@/providers/theme-provider';

describe('ThemeToggle', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('toggles theme on click', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByLabelText('Switch to light mode');
    fireEvent.click(button);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });
});
