<script lang="ts">
    interface Props {
        /**
         * LCARS sidebar bar component.
         *
         * This component provides the vertical LCARS sidebar with the
         * characteristic elbows and filler segments.  Content placed in
         * the default slot will appear in the scroll container between
         * the top and bottom elbows.  This component is purely
         * presentational and does not implement scroll buttons or
         * interactive behaviour from the original prototype【589465017341834†L339-L380】.
         */
        className?: string;
        children?: import("svelte").Snippet;
    }

    let { className = "", children }: Props = $props();
</script>

<div class={`lcars-sidebar-bar ${className}`.trim()}>
    <!-- Top elbow decorated with a radial gradient -->
    <div class="lcars-sidebar-bar-top-elbow"></div>
    <!-- Scroll container for navigation items -->
    <div class="lcars-sidebar-bar-scroll-container">
        {@render children?.()}
    </div>
    <!-- Bottom elbow decorated with a radial gradient -->
    <div class="lcars-sidebar-bar-bottom-elbow"></div>
</div>

<style>
    /* Styling is provided by global.css. */
</style>
