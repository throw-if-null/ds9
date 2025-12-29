<script>
    /**
   * @typedef {Object} Props
   * @property {string} [title] - LCARS Header Bar component
This component renders the decorative LCARS header bar used at the top
of the Zander interface.  The bar contains a large home button on
the left, followed by a flexible fill segment and a small end cap.
Props:
- title: text to display inside the home button.  Defaults to "ZANDER".
- className: optional additional classes to apply to the root element.
Slots:
- default: content for the home button.  If provided, the `title`
prop is ignored.  Use this slot to insert custom markup or text
inside the home button.
   * @property {string} [className]
   * @property {import('svelte').Snippet} [children]
   */

    /** @type {Props} */
    let { title = "ZANDER", className = "", children } = $props();

    // Compute the class list for the header bar.  The base class is
    // `lcars-header-bar`; any additional classes supplied by the user
    // are appended for further styling.
    let classes = $derived(
        ["lcars-header-bar", className].filter(Boolean).join(" "),
    );
</script>

<div class={classes}>
    <button class="lcars-header-bar-home" type="button">
        {#if children}
            <!-- If a default slot is provided, render it within the button -->
            {@render children?.()}
        {:else}
            {title}
        {/if}
    </button>
    <!-- Decorative fill segment grows to take up remaining space -->
    <div class="lcars-header-bar-fill"></div>
    <!-- End cap provides the rounded corner on the right end -->
    <div class="lcars-header-bar-end-cap"></div>
</div>

<style>
    /* This component relies entirely on the global LCARS design system
     styles defined in global.css.  No scoped styles are needed here. */
</style>
