<script>
    /**
   * @typedef {Object} Props
   * @property {any} color - LCARS Button component
Props:
- color: one of "orange", "dark", "danger" or "beige" to apply a colour
scheme.  If undefined, the default beige colour is used.
- pill: whether to apply the pill style (rounded corners).
- className: additional classes forwarded to the button.
   * @property {boolean} [pill]
   * @property {string} [className]
   * @property {import('svelte').Snippet} [children]
   */

    /** @type {Props} */
    let { color, pill = false, className = "", children } = $props();

    // Derive the appropriate colour class.  If no colour prop is supplied,
    // use an empty string so the default CSS variables take effect.
    let colourClass = $derived(color ? `lcars-color-${color}` : "");

    // Compose the list of classes.  Filter out empty strings and join with a space.
    let classes = $derived(
        ["lcars-button", pill ? "lcars-pill" : "", colourClass, className]
            .filter(Boolean)
            .join(" "),
    );
</script>

<button class={classes}>
    {@render children?.()}
</button>

<style>
    /* The component itself doesn't define any styles.  All styles are provided
     globally via `global.css`.  However, scoped styles can be added here
     if component‑specific overrides are required in the future. */
</style>
