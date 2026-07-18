import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SolutionHero } from '@/features/solutions/components/SolutionHero';

const mockHero = {
  title: 'AI Engineering',
  description: 'Production-grade agentic systems with evaluation harnesses.',
  primaryCta: { text: 'Talk to an Expert', href: '/contact' },
  secondaryCta: { text: 'View Case Studies', href: '#case-studies' },
  stats: [
    { value: '40%', label: 'Model reliability improvement' },
    { value: '60%', label: 'Deployment acceleration' },
  ],
};

describe('SolutionHero', () => {
  it('renders the hero title and description', () => {
    render(<SolutionHero hero={mockHero} />);
    
    expect(screen.getByText('AI Engineering')).toBeInTheDocument();
    expect(screen.getByText(/Production-grade agentic systems/)).toBeInTheDocument();
  });

  it('renders primary and secondary CTAs', () => {
    render(<SolutionHero hero={mockHero} />);
    
    expect(screen.getByText('Talk to an Expert')).toBeInTheDocument();
    expect(screen.getByText('View Case Studies')).toBeInTheDocument();
  });

  it('renders stats when provided', () => {
    render(<SolutionHero hero={mockHero} />);
    
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('has correct link hrefs', () => {
    render(<SolutionHero hero={mockHero} />);
    
    const primaryLink = screen.getByText('Talk to an Expert').closest('a');
    const secondaryLink = screen.getByText('View Case Studies').closest('a');
    
    expect(primaryLink).toHaveAttribute('href', '/contact');
    expect(secondaryLink).toHaveAttribute('href', '#case-studies');
  });
});