import { page } from 'vitest/browser';
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Pill from './Pill.svelte';

describe('Pill component', () => {
  it('renders label when no children provided', async () => {
    render(Pill, { props: { label: 'My Pill' } });
    const btn = page.getByRole('button');
    await expect.element(btn).toBeInTheDocument();
  });

  it('applies active class and aria-current when active prop is true', async () => {
    render(Pill, { props: { label: 'Active', active: true } });
    const btn = page.getByRole('button', { name: 'Category: Active' });
    await expect.element(btn).toBeInTheDocument();
    await expect.element(btn).toHaveClass('active');
    await expect.element(btn).toHaveAttribute('aria-current', 'page');
  });

  it('sets data-id and custom aria-label when provided', async () => {
    render(Pill, { props: { label: 'X', dataId: 'pill-1', ariaLabel: 'Custom' } });
    const btn = page.getByRole('button', { name: 'Custom' });
    await expect.element(btn).toBeInTheDocument();
    await expect.element(btn).toHaveAttribute('data-id', 'pill-1');
    await expect.element(btn).toHaveAttribute('aria-label', 'Custom');
  });
});
