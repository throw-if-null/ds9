<script lang="ts">
	import { createEventDispatcher, type Snippet } from 'svelte';
	import LcarsSidebarScrollArea from './LcarsSidebarScrollArea.svelte';
	const dispatch = createEventDispatcher();
	const { children } = $props<{ children?: Snippet | undefined }>();

	// bind:this will receive the component instance (not HTMLElement)
	type ScrollApi = { scrollBy(amount: number): void; getScrollTop(): number } | null;
	let scrollEl: ScrollApi = null;

	function scrollByAmount(amount: number) {
		if (!scrollEl || typeof scrollEl.scrollBy !== 'function') return;
		scrollEl.scrollBy(amount);
		dispatch('scroll', {
			scrollTop: typeof scrollEl.getScrollTop === 'function' ? scrollEl.getScrollTop() : 0
		});
	}

	export { scrollByAmount };
</script>

<div class="lcars-sidebar-bar-track">
	<button
		class="lcars-arrow-btn lcars-sidebar-up"
		aria-label="Scroll up"
		onclick={() => scrollByAmount(-100)}
		onkeydown={(e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
				e.preventDefault();
				scrollByAmount(-100);
			}
		}}
	>
		<svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 12 L20 0 L40 12 Z" /></svg>
	</button>

	<LcarsSidebarScrollArea bind:this={scrollEl}>
		{@render children?.()}
	</LcarsSidebarScrollArea>

	<button
		class="lcars-arrow-btn lcars-sidebar-down"
		aria-label="Scroll down"
		onclick={() => scrollByAmount(100)}
		onkeydown={(e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
				e.preventDefault();
				scrollByAmount(100);
			}
		}}
	>
		<svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 0 L20 12 L40 0 Z" /></svg>
	</button>
</div>

<style>
	.lcars-sidebar-up,
	.lcars-sidebar-down {
		width: 100%;
	}
	.lcars-sidebar-bar-track {
		display: flex;
		flex-direction: column;
		gap: 6px;
		align-items: stretch;
	}
</style>
