import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchDialog } from '@/features/search/components/SearchDialog';

describe('SearchDialog', () => {
  it('renders when open is true', () => {
    render(<SearchDialog open={true} onOpenChange={() => {}} />);
    
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<SearchDialog open={false} onOpenChange={() => {}} />);
    
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<SearchDialog open={true} onOpenChange={() => {}} />);
    
    expect(screen.getByLabelText('Close search')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<SearchDialog open={true} onOpenChange={() => {}} />);
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});