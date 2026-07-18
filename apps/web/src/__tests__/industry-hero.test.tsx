import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IndustryHero } from '@/features/industries/components/IndustryHero';

const mockHero = {
  title: 'Financial Services',
  description: 'Enterprise-grade solutions for banks and financial institutions.',
  primaryCta: { text: 'Talk to an Expert', href: '/contact' },
  secondaryCta: { text: 'View Case Studies', href: '#case-studies' },
};

describe('IndustryHero', () => {
  it('renders the industry title and description', () => {
    render(<IndustryHero hero={mockHero} />);
    
    expect(screen.getByText('Financial Services')).toBeInTheDocument();
    expect(screen.getByText(/Enterprise-grade solutions/)).toBeInTheDocument();
  });

  it('renders primary and secondary CTAs', () => {
    render(<IndustryHero hero={mockHero} />);
    
    expect(screen.getByText('Talk to an Expert')).toBeInTheDocument();
    expect(screen.getByText('View Case Studies')).toBeInTheDocument();
  });

  it('has correct link hrefs', () => {
    render(<IndustryHero hero={mockHero} />);
    
    const primaryLink = screen.getByText('Talk to an Expert').closest('a');
    const secondaryLink = screen.getByText('View Case Studies').closest('a');
    
    expect(primaryLink).toHaveAttribute('href', '/contact');
    expect(secondaryLink).toHaveAttribute('href', '#case-studies');
  });
});