import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactForm } from '@/features/contact/components/ContactForm';

describe('ContactForm', () => {
  it('renders initial step 1 fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/First Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Last Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Business Email/i)).toBeDefined();
  });

  it('shows error validation on step 1 when empty fields submitted', async () => {
    render(<ContactForm />);
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeDefined();
    });
  });

  it('advances to step 2 when valid step 1 data entered', async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Sathiya' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Murthy' } });
    fireEvent.change(screen.getByLabelText(/Business Email/i), { target: { value: 'sathiya@company.com' } });

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Company \*/i)).toBeDefined();
    });
  });
});
