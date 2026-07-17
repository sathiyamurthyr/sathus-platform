import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Notifications } from '@/components/layout/notifications';
import { ProfileMenu } from '@/components/layout/profile-menu';
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

describe('Notifications', () => {
  it('renders when open', () => {
    renderWithProviders(<Notifications open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('shows unread count', () => {
    renderWithProviders(<Notifications open={true} onClose={() => {}} />);
    expect(screen.getByText('2 new')).toBeInTheDocument();
  });

  it('marks all as read', () => {
    renderWithProviders(<Notifications open={true} onClose={() => {}} />);
    const markAllButton = screen.getByText('Mark all read');
    fireEvent.click(markAllButton);
    expect(screen.queryByText('2 new')).not.toBeInTheDocument();
  });
});

describe('ProfileMenu', () => {
  it('renders when open', () => {
    renderWithProviders(<ProfileMenu open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Profile menu' })).toBeInTheDocument();
  });

  it('shows user info', () => {
    renderWithProviders(<ProfileMenu open={true} onClose={() => {}} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@sathus.technology')).toBeInTheDocument();
  });
});
