<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// pull in your LCARS stylesheet so its variables and classes apply globally
	import '$lib/styles/lcars.css';
	import LcarsHeaderBar from '$lib/layout/LcarsHeaderBar.svelte';
</script>

<LcarsHeaderBar homeAriaLabel="LCARS Home" />

<slot />
