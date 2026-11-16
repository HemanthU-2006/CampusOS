import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { router } from '../routes';

describe('UI Primitives and Routing Suite', () => {
  it('renders Button with text and handles lime variant', () => {
    render(<Button variant="lime">Book Venue</Button>);
    const button = screen.getByRole('button', { name: /book venue/i });
    expect(button).toBeTruthy();
  });

  it('renders Badge with custom label and status', () => {
    render(<Badge variant="lime">Approved</Badge>);
    expect(screen.getByText('Approved')).toBeTruthy();
  });

  it('verifies essential routes exist in router config', () => {
    const routePaths = router.routes.flatMap((r) => [
      r.path,
      ...(r.children?.map((c) => c.path) || []),
    ]);

    expect(routePaths).toContain('venues');
    expect(routePaths).toContain('resources');
    expect(routePaths).toContain('events');
    expect(routePaths).toContain('maintenance');
  });
});
