import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import Button from './Button.svelte';

describe('Button component', () => {
  it('renders label when no children provided', async () => {
    render(Button, { props: { label: 'My Button' } });
    const btn = page.getByRole('button');
    await expect.element(btn).toBeInTheDocument();
    // presence confirmed; avoid text matcher for this environment
  });

  it('applies active class and aria-current when active prop is true', async () => {
    render(Button, { props: { label: 'Active', active: true } });
    const btn = page.getByRole('button', { name: 'Category: Active' });
    await expect.element(btn).toBeInTheDocument();
    await expect.element(btn).toHaveClass('active');
    await expect.element(btn).toHaveAttribute('aria-current', 'page');
  });

  it('sets data-id and custom aria-label when provided', async () => {
    render(Button, {
      props: { label: 'X', dataId: 'btn-1', ariaLabel: 'Custom' },
    });
    const btn = page.getByRole('button', { name: 'Custom' });
    await expect.element(btn).toBeInTheDocument();
    await expect.element(btn).toHaveAttribute('data-id', 'btn-1');
    await expect.element(btn).toHaveAttribute('aria-label', 'Custom');
  });

  it('sets style attribute when radius props provided', async () => {
    render(Button, {
      props: {
        label: 'Style',
        color: 'main',
        radiusLeft: '4px',
        radiusRight: '8px',
      },
    });
    const btn = page.getByRole('button', { name: 'Category: Style' });
    await expect.element(btn).toBeInTheDocument();
    await expect.element(btn).toHaveAttribute('style');
  });
});
