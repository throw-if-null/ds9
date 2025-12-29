<script lang="ts">
    interface Props {
        /**
         * Generic LCARS dialog component.
         *
         * This component replicates the structure of the dialogs in the
         * Zander prototype【589465017341834†L1451-L1530】.  It consists of a
         * container element with a header, body and footer.  Slots
         * correspond to these regions.  The dialog does not handle
         * opening/closing logic; it is intended purely for layout.
         */
        className?: string;
        header?: import("svelte").Snippet;
        body?: import("svelte").Snippet;
        footer?: import("svelte").Snippet;
    }

    let { className = "", header, body, footer }: Props = $props();
</script>

<div class={`lcars-dialog-container ${className}`.trim()} role="dialog">
    <div class="lcars-dialog">
        <div class="lcars-dialog-header">
            {@render header?.()}
        </div>
        <div class="lcars-dialog-body">
            {@render body?.()}
        </div>
        <div class="lcars-dialog-footer">
            {@render footer?.()}
        </div>
    </div>
</div>

<style>
    /* All visual styles are inherited from global.css. */
</style>
