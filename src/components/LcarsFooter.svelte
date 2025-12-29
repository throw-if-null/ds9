<script lang="ts">
    interface Props {
        /**
         * LCARS footer bar component.
         *
         * This component renders a horizontal bar with a status area on the
         * left and an actions area on the right.  Use the `status` slot to
         * inject status text or indicators, and the `actions` slot for
         * buttons or drop‑downs.  The layout and styling follow the
         * original Zander prototype’s footer bar【589465017341834†L339-L380】.
         */
        className?: string;
        status?: import("svelte").Snippet;
        actions?: import("svelte").Snippet;
    }

    let { className = "", status, actions }: Props = $props();
</script>

<div class={`lcars-footer-bar ${className}`.trim()}>
    <div class="lcars-footer-bar-status">
        {@render status?.()}
    </div>
    <div class="lcars-footer-bar-actions">
        {@render actions?.()}
    </div>
</div>

<style>
    /* No scoped styles are necessary.  All styling comes from global.css. */
</style>
