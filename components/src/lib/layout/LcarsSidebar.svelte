<script lang="ts">
	import type { Snippet } from 'svelte';
	import LcarsSidebarTrack from './LcarsSidebarTrack.svelte';
	const { children, categories } = $props<{
		children?: Snippet | undefined;
		categories?: Snippet | undefined;
	}>();
</script>

<aside class="lcars-sidebar">
	<div class="lcars-sidebar-bar" role="navigation" aria-label="Sidebar">
		<div
			class="lcars-sidebar-bar-top-cap lcars-elbow lcars-sidebar-bar-top-cap"
			aria-hidden="true"
		></div>
		<LcarsSidebarTrack>
			{@render categories?.()}
		</LcarsSidebarTrack>
		<div
			class="lcars-sidebar-bar-bottom-cap lcars-elbow lcars-sidebar-bar-bottom-cap"
			aria-hidden="true"
		></div>
	</div>
	<div class="lcars-sidebar-content">{@render children?.()}</div>
</aside>

<style>
	.lcars-sidebar {
		display: flex;
		gap: 12px;
		align-items: stretch;
	}
	.lcars-sidebar-content {
		flex: 1;
	}
</style>
