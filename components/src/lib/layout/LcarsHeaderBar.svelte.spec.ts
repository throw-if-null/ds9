import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import LcarsHeaderBar from './LcarsHeaderBar.svelte';

describe('LcarsHeaderBar', () => {
	it('renders default home text and respects aria label', () => {
		render(LcarsHeaderBar, { homeAriaLabel: 'My Home' });

		const btn = document.querySelector('.lcars-header-bar-home') as HTMLButtonElement;
		expect(btn).toBeTruthy();
		expect(btn.getAttribute('aria-label')).toBe('My Home');
		expect(btn.textContent?.trim()).toBe('LCARS');
	});
});
