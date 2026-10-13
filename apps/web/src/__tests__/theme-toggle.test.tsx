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
    expect(screen.getByLabelText('Sathus brand theme')).toBeInTheDocument();
  });

  it('renders theme button on dark mode', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByLabelText('Sathus brand theme');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
