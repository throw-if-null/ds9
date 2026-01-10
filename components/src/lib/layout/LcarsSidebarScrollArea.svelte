<script lang="ts">
	import { onMount, createEventDispatcher, type Snippet } from 'svelte';
	const dispatch = createEventDispatcher();
	const { children } = $props<{ children?: Snippet | undefined }>();

	let el: HTMLElement | null = null;

	onMount(() => {
		if (!el) return;
		el.addEventListener('scroll', () => dispatch('scroll', { scrollTop: el!.scrollTop }));
	});

	export function scrollBy(amount: number) {
		if (!el) return;
		el.scrollBy({ top: amount, behavior: 'smooth' });
		dispatch('scroll', { scrollTop: el.scrollTop });
	}

	export function getScrollTop() {
		return el?.scrollTop ?? 0;
	}
</script>

<div
	class="lcars-scroll-container"
	tabindex="-1"
	bind:this={el}
	role="region"
	aria-label="Sidebar categories"
>
	{@render children?.()}
</div>

<style>
	.lcars-scroll-container {
		min-height: 0;
	}
</style>
