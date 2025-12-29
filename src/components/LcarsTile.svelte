<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot (meta-primary to meta_primary) making the component unusable -->
<script>
    /**
     * LCARS Tile component
     *
     * Props:
     * - variant: optional string selecting one of the tile variants.  Valid
     *   values are "bookmark", "category", "settings" and "danger".  If
     *   undefined, the base tile styling is used.
     * - className: additional classes forwarded to the root element.
     */
    export let variant;
    export let className = "";

    // Compute the variant class.  Unknown variants are ignored.
    $: variantClass = variant ? `lcars-tile--${variant}` : "";

    // Compose the list of classes for the root element.
    $: classes = ["lcars-tile", variantClass, className]
        .filter(Boolean)
        .join(" ");

    // Detect whether the footer slot has been provided.  Svelte exposes
    // $$slots for this purpose.
    // Footer is only rendered for the category variant.
    $: hasFooter = variant === "category" && !!$$slots.footer;
</script>

<div class={classes} tabindex="-1">
    <!-- Label row -->
    {#if $$slots.label}
        <div class="lcars-tile-label">
            <slot name="label" />
        </div>
    {/if}

    <!-- Meta row -->
    {#if $$slots["meta-primary"] || $$slots["meta-secondary"]}
        <div class="lcars-tile-meta">
            {#if $$slots["meta-primary"]}
                <div class="lcars-tile-meta-primary">
                    <slot name="meta-primary" />
                </div>
            {/if}
            {#if $$slots["meta-secondary"]}
                <div class="lcars-tile-meta-secondary">
                    <slot name="meta-secondary" />
                </div>
            {/if}
        </div>
    {/if}

    <!-- Body row -->
    <div class="lcars-tile-body">
        <slot />
    </div>

    <!-- Footer row (only for category tiles) -->
    {#if hasFooter}
        <div class="lcars-tile-footer">
            <slot name="footer" />
        </div>
    {/if}
</div>

<style>
    /* Local overrides for the tile body.  This ensures the main content
     occupies the second column and appropriate row in the grid. */
    .lcars-tile-body {
        grid-column: 2;
        grid-row: 2;
        padding: 8px 12px 10px 8px;
    }
</style>
