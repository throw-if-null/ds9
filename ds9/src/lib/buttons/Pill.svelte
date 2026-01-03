<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { ThemeColorKey, AriaCurrent } from './theme';
	import { resolveColor } from './theme';

	interface CustomProps {
		/** Text fallback if no snippet content is passed */
		label?: string;
		/** Apply the `active` class */
		active?: boolean;
		/** Semantic colour key or raw CSS colour */
		color?: ThemeColorKey | string;
		/** Extra LCARS variant class, e.g. 'lcars-pill' */
		variantClass?: string;
		/** Set a custom data attribute */
		dataId?: string;
		/** Override the computed aria-label */
		ariaLabel?: string;
		/** Override the computed aria-current */
		ariaCurrent?: AriaCurrent;

		radiusLeft?: string;
		radiusRight?: string;
	}

	/** Combined props: native button attrs, our custom props and the `children` snippet */
	type Props = CustomProps & HTMLButtonAttributes & { children?: Snippet };

	/** Destructure props, renaming `class` to `extraClass` */
	let {
		label = '',
		active = false,
		color = 'main',
		variantClass = 'lcars-pill',
		dataId,
		ariaLabel,
		ariaCurrent: ariaCurrentProp,
		children,
		class: extraClass = '',
		radiusLeft,
		radiusRight,
		...rest
	}: Props = $props();

	/** Derived values for styling and ARIA attributes */
	let resolvedColor = $derived(resolveColor(color));
	let computedAriaLabel = $derived(ariaLabel ?? (label ? `Category: ${label}` : undefined));
	let computedAriaCurrent = $derived(ariaCurrentProp ?? (active ? 'page' : undefined));
</script>

<button
	{...rest}
	class={`lcars-button ${variantClass} ${active ? 'active' : ''} ${extraClass}`.trim()}
	style={`--cat-color: ${resolvedColor};${radiusLeft ? `--lcars-button-radius-left: ${radiusLeft};` : ''};${radiusRight ? `--lcars-button-radius-right: ${radiusRight};` : ''};`}
	data-id={dataId}
	aria-label={computedAriaLabel}
	aria-current={computedAriaCurrent}
>
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</button>
