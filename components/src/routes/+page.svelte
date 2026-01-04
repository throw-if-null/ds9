<script>
	import '$lib/styles/lcars.css';
	import Button from '$lib/buttons/Button.svelte';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- Basic usage with label and active state -->
<Button
	label="STAR TREK"
	active
	color="main"
	variantClass="lcars-sidebar-btn"
	radiusLeft="50px"
	radiusRight="0"
	dataId="cat-root-startrek"
/>

<Button
	label="STAR TREK KEK"
	active
	color="main"
	variantClass="lcars-button"
	dataId="cat-root-startrek"
/>
<p>Adjust props or children here to experiment with your component.</p>
