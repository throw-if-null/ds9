<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		home,
		trailing,
		homeAriaLabel = 'Home'
	} = $props<{
		home?: Snippet | undefined;
		trailing?: Snippet | undefined;
		homeAriaLabel?: string;
	}>();
</script>

<!-- Keep the DOM structure and class names intact to avoid breaking consumers -->
<div class="lcars-header-bar" role="region" aria-label="Header">
	<!-- Home area rendered as a button for keyboard operability -->
	<button class="lcars-header-bar-home js-home-btn" aria-label={homeAriaLabel}>
		{#if home}
			{@render home()}
		{:else}
			<span>LCARS</span>
		{/if}
	</button>

	<div class="lcars-header-bar-fill"></div>

	<!-- Optional trailing content area (e.g., actions) -->
	<div class="lcars-header-bar-trailing">{@render trailing?.()}</div>

	<div class="lcars-header-bar-end-cap" aria-hidden="true"></div>
</div>

<style>
	/* Minimal component-scoped styles to avoid changing global CSS */
	.lcars-header-bar-trailing {
		display: flex;
		align-items: center;
		height: var(--lcars-header-bar-height, 40px);
		gap: 8px;
		padding-right: 8px;
	}

	/* Ensure the home button has visible focus (respects existing tokens) */
	.lcars-header-bar-home:focus {
		outline: 2px solid var(--lcars-internal-focus-ring, #fff);
		outline-offset: 2px;
	}
</style>
