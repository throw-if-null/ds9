import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import LcarsSidebar from './LcarsSidebar.svelte';

describe('LcarsSidebar', () => {
	it('renders the sidebar and arrow buttons', () => {
		render(LcarsSidebar);

		const up = document.querySelector('.lcars-sidebar-up') as HTMLElement | null;
		const down = document.querySelector('.lcars-sidebar-down') as HTMLElement | null;
		expect(up).toBeTruthy();
		expect(down).toBeTruthy();
	});
});
