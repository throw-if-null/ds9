<script lang="ts">
    interface Props {
        /**
         * LCARS breadcrumb navigation.
         *
         * Provides a label and a path made up of segments.  Use the
         * `label` slot for the static prefix and the default slot for
         * breadcrumb segments.  Each segment can be an anchor or span
         * element styled with the appropriate LCARS classes【589465017341834†L873-L924】.
         */
        className?: string;
        label?: import("svelte").Snippet;
        children?: import("svelte").Snippet;
    }

    let { className = "", label, children }: Props = $props();
</script>

<nav class={`lcars-breadcrumb ${className}`.trim()} aria-label="Breadcrumb">
    <span class="lcars-breadcrumb-label">
        {@render label?.()}
    </span>
    <span class="lcars-breadcrumb-path">
        {@render children?.()}
    </span>
</nav>

<style>
    /* Global styles will style the breadcrumb; no scoped CSS is required. */
</style>
