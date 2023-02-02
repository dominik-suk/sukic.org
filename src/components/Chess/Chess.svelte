<script>
    import Pieces from "./Pieces.svelte";

    let Board = [] 
    let row1 =  [0, 1, 0, 1, 0, 1, 0, 1]
    let row2 =  [1, 0, 1, 0, 1, 0, 1, 0]

    for(let i = 0; i < 4; i++) {
        Board.push(row1)
        Board.push(row2)
    }

    let koordinates = {
        knight: "01"
    }

    let sources = [
        "./images/Chess/Tiles/EmptyTileWhite.png",
        "./images/Chess/Tiles/EmptyTileBlack.png",
        "./images/Chess/Tiles/SelectEmptyTileWhite.png",
        "./images/Chess/Tiles/SelectEmptyTileBlack.png",

        "./images/Chess/Knight/WhiteKnightWhiteTile.png",
        "./images/Chess/Knight/WhiteKnightBlackTile.png",
        "./images/Chess/Knight/BlackKnightWhiteTile.png",
        "./images/Chess/Knight/BlackKnightBlackTile.png",
    ]
// 0 = Empty White
// 1 = Empty Black
// 2 = White Knight White Tile
// 3 = white Knight Black Tile
// 4 = Black Knight White Tile
// 5 = Black Knight Black Tile

</script>

<div style="clear: both;"></div>

<pre>
    {#each Board as tile, index}
        {#if index === 0}
            <br/>
        {/if}

        {#each Board[index] as row}
            <p1>{row}  </p1>
        {/each}
        <br/>
    {/each}
</pre>
 
<div class="board">
    {#each Board as column, indexCol}
        {#each Board[indexCol] as row, indexRow}
            <Pieces 
                knight = "{koordinates.knight}"

                Board = "{Board}"
                indexCol = "{indexCol}"
                indexRow = "{indexRow}"
            />
        {/each}
    {/each}
</div>

<style>
    .board {
        display: grid;
        grid-template-columns: repeat(8, 64px);
        grid-template-rows: repeat(8, 64px);
    }

    .tile {
        display: inline-grid;
        width: 64px;
        height: 64px;
    }

    pre {
        line-height: 4pt;
    }
</style>