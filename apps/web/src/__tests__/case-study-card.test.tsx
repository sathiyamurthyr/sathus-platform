import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudyCard } from '@/features/case-studies/components/CaseStudyCard';

const mockCaseStudy = {
  id: 'test-case-study',
  slug: 'test-case-study',
  title: 'Test Case Study',
  industry: 'Technology',
  challenge: 'This is a test challenge description.',
  solution: 'This is a test solution.',
  architecture: {
    title: 'Test Architecture',
    description: 'Test architecture description',
    imageUrl: '/test.png',
    imageAlt: 'Test image',
  },
  technologies: [
    { id: 'tech1', name: 'React', category: 'framework' as const },
    { id: 'tech2', name: 'Node.js', category: 'framework' as const },
  ],
  metrics: [
    { id: 'm1', value: '50%', label: 'Performance Improvement' },
  ],
  timeline: {
    duration: '3 months',
    phases: [],
  },
  outcomes: [],
  relatedSolutions: ['ai-engineering'],
  seo: {
    title: 'Test Case Study',
    description: 'Test description',
    canonical: '/case-studies/test-case-study',
  },
  featured: true,
  publishedAt: '2024-01-01',
};

describe('CaseStudyCard', () => {
  it('renders the case study title and industry', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText('Test Case Study')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders the challenge description', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText(/This is a test challenge/)).toBeInTheDocument();
  });

  it('renders technology tags', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('has correct link to case study detail page', () => {
    render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    
    const link = screen.getByText('Test Case Study').closest('a');
    expect(link).toHaveAttribute('href', '/case-studies/test-case-study');
  });
});