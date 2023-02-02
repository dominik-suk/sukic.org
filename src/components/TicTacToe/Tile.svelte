<script>
    import DarkmodeStore from "../../stores/DarkmodeStore.js"

    export let currentSource
    export let handleClick
    export let clickable
    export let index

    function tileIsEmpty(src) {
        if(
            src === "./images/TicTacToe/Empty.png" ||
            src === "./images/TicTacToe/Darkmode/EmptyDarkmode.png") {
                return true
            } else {
                return false
            }
        }

    let darkmodeValue = 0
    
    DarkmodeStore.subscribe(data => {
        darkmodeValue = data[1]
    });


</script>

<img
    class="
        {clickable && tileIsEmpty(currentSource) ? "clickable" : "unclickable"}
        tile
    "
    src="{currentSource}"
    alt="Tic-Tac-Toe Tile"

    on:click={clickable ? () => handleClick(index) : ""}
    on:keypress={clickable ? () => handleClick(index) : ""}
/>

<style>
    .clickable.tile:hover {
        cursor: pointer;
    }

    .unclickable.tile:hover {
        cursor: default;
    }

</style>