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

  it('advances through step 1, step 2, and submits step 3 successfully', async () => {
    const onSuccess = vi.fn();
    render(<ContactForm onSuccess={onSuccess} />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/First Name \*/i), { target: { value: 'Sathiya' } });
    fireEvent.change(screen.getByLabelText(/Last Name \*/i), { target: { value: 'Murthy' } });
    fireEvent.change(screen.getByLabelText(/Business Email \*/i), { target: { value: 'sathiya@company.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/Company \*/i)).toBeDefined();
    });
    fireEvent.change(screen.getByLabelText(/Company \*/i), { target: { value: 'Sathus Tech' } });
    fireEvent.change(screen.getByLabelText(/Job Title \*/i), { target: { value: 'CTO' } });
    fireEvent.change(screen.getByLabelText(/Country \*/i), { target: { value: 'India' } });
    fireEvent.change(screen.getByLabelText(/Industry \*/i), { target: { value: 'Technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size \*/i), { target: { value: '201-500' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3
    await waitFor(() => {
      expect(screen.getByLabelText(/Message \*/i)).toBeDefined();
    });
    fireEvent.change(screen.getByLabelText(/Message \*/i), { target: { value: 'Testing the strategy session form submission' } });
    
    // Toggle consent checkbox
    const checkbox = screen.getByRole('checkbox', { name: /I agree to the privacy policy/i });
    fireEvent.click(checkbox);

    // Submit
    const submitButton = screen.getByRole('button', { name: /Submit Request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Request Submitted Successfully!/i)).toBeDefined();
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
