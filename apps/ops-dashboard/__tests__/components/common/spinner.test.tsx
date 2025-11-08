import { render, screen } from '@testing-library/react';

import { Spinner } from '@/components/common/spinner';

describe('Spinner', () => {
  it('should render spinner with default props', () => {
    render(<Spinner />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-4', 'w-4', 'animate-spin');
  });

  it('should apply custom className', () => {
    const customClass = 'custom-spinner-class';
    render(<Spinner className={customClass} />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-4', 'w-4', 'animate-spin', customClass);
  });

  it('should render with correct SVG attributes', () => {
    render(<Spinner />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    expect(spinner).toHaveAttribute('fill', 'none');
    expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('should render circle and path elements', () => {
    render(<Spinner />);
    
    const spinner = screen.getByTestId('spinner');
    const circle = spinner.querySelector('circle');
    const path = spinner.querySelector('path');
    
    expect(circle).toBeInTheDocument();
    expect(path).toBeInTheDocument();
    
    expect(circle).toHaveClass('opacity-25');
    expect(path).toHaveClass('opacity-75');
  });

  it('should have correct circle attributes', () => {
    render(<Spinner />);
    
    const spinner = screen.getByTestId('spinner');
    const circle = spinner.querySelector('circle');
    
    expect(circle).toHaveAttribute('cx', '12');
    expect(circle).toHaveAttribute('cy', '12');
    expect(circle).toHaveAttribute('r', '10');
    expect(circle).toHaveAttribute('stroke', 'currentColor');
    expect(circle).toHaveAttribute('stroke-width', '4');
  });

  it('should have correct path attributes', () => {
    render(<Spinner />);
    
    const spinner = screen.getByTestId('spinner');
    const path = spinner.querySelector('path');
    
    expect(path).toHaveAttribute('fill', 'currentColor');
    expect(path).toHaveAttribute('d', 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z');
  });

  it('should be accessible', () => {
    render(<Spinner />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should handle empty className', () => {
    render(<Spinner className="" />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-4', 'w-4', 'animate-spin');
  });

  it('should handle undefined className', () => {
    render(<Spinner className={undefined} />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-4', 'w-4', 'animate-spin');
  });
});
