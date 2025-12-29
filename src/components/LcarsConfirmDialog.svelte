<script lang="ts">
    import LcarsDialog from "./LcarsDialog.svelte";

    import { createEventDispatcher } from "svelte";
    interface Props {
        /**
         * Confirmation dialog built on top of `LcarsDialog`.
         *
         * Displays a title and message with two buttons for confirming
         * or cancelling the action.  This component is presentational
         * only; the `on:confirm` and `on:cancel` events must be handled
         * by the parent component if interactive behaviour is desired.
         */
        title?: string;
        message?: string;
        confirmLabel?: string;
        cancelLabel?: string;
    }

    let {
        title = "Confirm",
        message = "",
        confirmLabel = "OK",
        cancelLabel = "Cancel",
    }: Props = $props();
    const dispatch = createEventDispatcher();

    function handleConfirm() {
        dispatch("confirm");
    }
    function handleCancel() {
        dispatch("cancel");
    }
</script>

<LcarsDialog className="lcars-confirm-dialog">
    {#snippet header()}
        <span class="lcars-dialog-title">{title}</span>
    {/snippet}
    {#snippet body()}
        <p>{message}</p>
    {/snippet}
    {#snippet footer()}
        <div class="lcars-dialog-actions">
            <button class="lcars-button lcars-pill" onclick={handleCancel}
                >{cancelLabel}</button
            >
            <button
                class="lcars-button lcars-pill lcars-button--danger"
                onclick={handleConfirm}>{confirmLabel}</button
            >
        </div>
    {/snippet}
</LcarsDialog>

<style>
    /* Use global styles for visual appearance; scope additional tweaks here if needed. */
    .lcars-dialog-actions {
        display: flex;
        gap: var(--lcars-gap);
        justify-content: flex-end;
    }
</style>
