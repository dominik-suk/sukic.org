<script>
    import Knight from "./Knight.svelte";

    export let Board
    export let indexCol
    export let indexRow
</script>



{#if Board[indexCol][indexRow] === 0}
    <img class="tile" src="./images/Chess/Tiles/EmptyTileWhite.png" alt="White Empty Tile">
{:else}
    <img class="tile" src="./images/Chess/Tiles/EmptyTileBlack.png" alt="Black Empty Tile">
{/if}