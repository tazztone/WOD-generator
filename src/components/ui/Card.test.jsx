import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { describe, it, expect } from 'vitest';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default classes including padding', () => {
    const { container } = render(<Card>Card Content</Card>);
    expect(container.firstChild).toHaveClass('bg-slate-800/50');
    expect(container.firstChild).toHaveClass('rounded-xl');
    expect(container.firstChild).toHaveClass('border');
    expect(container.firstChild).toHaveClass('border-slate-700');
    expect(container.firstChild).toHaveClass('p-4');
  });

  it('applies custom className correctly', () => {
    const { container } = render(<Card className="custom-class">Card Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('removes padding when noPadding is true', () => {
    const { container } = render(<Card noPadding={true}>Card Content</Card>);
    expect(container.firstChild).not.toHaveClass('p-4');
  });
});
