import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AnnouncementBar } from '@/components/layout/announcement-bar';

describe('AnnouncementBar', () => {
  it('renders when not dismissed', () => {
    localStorage.clear();
    render(<AnnouncementBar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('does not render when dismissed', () => {
    localStorage.setItem('sathus-announcement-dismissed', 'true');
    render(<AnnouncementBar />);
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('dismisses on button click', async () => {
    localStorage.clear();
    render(<AnnouncementBar />);
    const dismissButton = screen.getByLabelText('Dismiss announcement');
    fireEvent.click(dismissButton);
    await act(async () => {});
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('renders announcement with tag', () => {
    localStorage.clear();
    render(<AnnouncementBar />);
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByText(/Sathus AI 2.0/)).toBeInTheDocument();
  });
});
