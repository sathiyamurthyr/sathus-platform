import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandLogo } from '@/components/brand-logo';

describe('BrandLogo', () => {
  it('renders the logo with correct alt text', () => {
    render(<BrandLogo />);
    
    expect(screen.getByAltText('Sathus Technology')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<BrandLogo size="sm" />);
    expect(screen.getByAltText('Sathus Technology')).toBeInTheDocument();
    
    rerender(<BrandLogo size="lg" />);
    expect(screen.getByAltText('Sathus Technology')).toBeInTheDocument();
  });

  it('has a link to home', () => {
    render(<BrandLogo />);
    
    const link = screen.getByLabelText('Sathus Technology home');
    expect(link).toHaveAttribute('href', '/');
  });
});