<script lang="ts">
	// Runes-style component: use $props() and snippet props
	// Public snippet props: header, sidebar, children
	// Styling: apply `.lcars-app` and optional `.lcars-app--fullpage` when `fullpage` prop is true

	import type { Snippet } from 'svelte';

	const {
		fullpage = false,
		header,
		sidebar,
		children
	} = $props<{
		fullpage?: boolean;
		header?: Snippet | undefined;
		sidebar?: Snippet | undefined;
		children?: Snippet | undefined;
	}>();
</script>

<div class={'lcars-app' + (fullpage ? ' lcars-app--fullpage' : '')}>
	<header class="lcars-app__header">{@render header?.()}</header>
	<aside class="lcars-app__sidebar">{@render sidebar?.()}</aside>
	<main class="lcars-app__main">{@render children?.()}</main>
</div>

<style>
	/* Keep purely structural styles minimal; detailed visuals live in lcars-shell.css */
	.lcars-app {
		display: grid;
		grid-template-columns: 260px 1fr;
		grid-template-rows: auto 1fr;
		min-height: 100vh;
	}
	.lcars-app__header {
		grid-column: 1 / -1;
	}
	.lcars-app__sidebar {
		grid-row: 2 / 3;
	}
	.lcars-app__main {
		padding: 16px;
	}
	.lcars-app--fullpage {
		min-height: 100vh;
	}
</style>
