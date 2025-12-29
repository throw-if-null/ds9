<script lang="ts">
    interface Props {
        /**
         * LCARS expandable/drop‑down component.
         *
         * This component renders a trigger button and a hidden menu that
         * appears on hover.  The orientation determines whether the menu
         * appears above or below the trigger.  Items are passed via the
         * `items` prop or a named slot.  Each item should be a simple
         * string or an object with `label` and optional `class`.
         *
         * Usage:
         * ```svelte
         * <LcarsExpandable orientation="up">
         *   <span slot="trigger">ADD&lt;br&gt;ENTRY</span>
         *   <button slot="item" class="lcars-expandable-item">BOOKMARK</button>
         *   <button slot="item" class="lcars-expandable-item">CATEGORY</button>
         * </LcarsExpandable>
         * ```
         */
        orientation?: "up" | "down";
        className?: string;
        trigger?: import("svelte").Snippet;
        item?: import("svelte").Snippet;
        children?: import("svelte").Snippet;
    }

    let {
        orientation = "down",
        className = "",
        trigger,
        item,
        children,
    }: Props = $props();
</script>

<!--
  The root uses the `lcars-expandable` class with a modifier
  indicating the menu direction (up or down).  Consumers supply
  trigger content via the `trigger` slot and menu items via
  repeated `item` slots.  You can also place arbitrary markup in
  the default slot which will appear inside the menu.
-->
<div
    class={`lcars-expandable lcars-expandable--${orientation} ${className}`.trim()}
>
    <button class="lcars-button lcars-expandable-trigger">
        {@render trigger?.()}
    </button>
    <div class="lcars-expandable-menu">
        {@render item?.()}
        {@render children?.()}
    </div>
</div>

<style>
    /* This component relies entirely on the global LCARS styles defined
     in global.css.  No scoped styles are required here. */
</style>
