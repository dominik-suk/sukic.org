<script>
    import DarkmodeStore from "../../stores/DarkmodeStore.js"
    import Counter from "../Counter.svelte"
    import Tile from "./Tile.svelte"

    let player1 = true
    let player = "1"
    let playerWon = "2"
    let won = false
    let draw = false
    let clickable = true

    let restartSeconds = 5

    let tiles = []
    for(let i = 0; i < 9; i++) {
        tiles.push(0)
    }

    let handleClick = (tile) => {
        if(tiles[tile] != 0) {return}

        if(player1) {
            tiles[tile] = 1
        } else {
            tiles[tile] = 2
        }

        checkWin()
        checkDraw()
        togglePlayer()
    }

    function togglePlayer() {
        player1 = !player1

        if(player1) {
            player = "1"
            playerWon = "2"
        } else {
            player = "2"
            playerWon = "1"
        }
    }

    let winRanges = [
            //rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            
            //columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            //diagonals
            [0, 4, 8],
            [2, 4, 6]
        ]

    function checkWin() {
        for(let i = 0; i < winRanges.length; i++) {
            if(allEqual(winRanges[i])) {
                winScreen(winRanges[i])
            } 
        }
    }

    function checkDraw() {
        for(let i = 0; i < tiles.length; i++) {
            if(tiles[i] === 0) {
                return
            }
        }

        draw = true
        clickable = false
        setTimeout(restart, restartSeconds * 1000)
    }
    
    function allEqual(range) {
        if(tiles[range[0]] === 0 || tiles[range[0]] === -1) {
                return false
        }

        if(tiles[range[0]] === tiles[range[1]] && tiles[range[1]] === tiles[range[2]]) {
                return true
        }
    }

    function winScreen(range) {
        won = true
        for(let i = 0; i < range.length; i++) {
            tiles[range[i]] += 2
        }

        clickable = false
        setTimeout(restart, restartSeconds * 1000)
    }

    function restart() {
        clickable = true
        player1 = true
        player = "1"
        won = false
        draw = false

        for(let i = 0; i < tiles.length; i++) {
            tiles[i] = 0
        }
    }

    let sources = [
        //Normal
        "./images/TicTacToe/Empty.png",
        "./images/TicTacToe/Cross.png",
        "./images/TicTacToe/Circle.png",
        "./images/TicTacToe/CrossWin.png",
        "./images/TicTacToe/CircleWin.png",

        //Darkmode
        "./images/TicTacToe/Darkmode/EmptyDarkmode.png",
        "./images/TicTacToe/Darkmode/CrossDarkmode.png",
        "./images/TicTacToe/Darkmode/CircleDarkmode.png",
        "./images/TicTacToe/Darkmode/CrossWinDarkmode.png",
        "./images/TicTacToe/Darkmode/CircleWinDarkmode.png"
    ]

    let darkmodeValue = 0
    
    DarkmodeStore.subscribe(data => {
        darkmodeValue = data[1]
    });
</script>


<div class="board">
    {#each tiles as tile, index}
        <Tile
            handleClick="{handleClick}"
            clickable="{clickable}"
            index="{index}"
            currentSource="{sources[tile + darkmodeValue]}"
        />
    {/each}
</div>
<div class="score">
    {#if won}
        <h1>Player {playerWon} has won</h1>
        <div class="counter">
            <Counter
                initial={restartSeconds}
            />
        </div>
        <h1>Restart...</h1>
    {:else if draw}
        <h1>It's a draw</h1>
        <div class="counter">
            <Counter
                initial={restartSeconds}
            />
        </div>
        <h1>Restart...</h1> 
    {:else}
        <h1>It's player {player}'s turn</h1>
    {/if}
</div>
<div style="clear: both;"></div>

<style>
    .board {
        float: left;
        display: grid;
        grid-template-columns: repeat(3, 170px);
        grid-template-rows: repeat(3, 170px);
        margin-left: 20%;
    }

    .score {
        padding-top: 60px;
        text-align: center;
        float: left;
        padding-left: 100px;
    }

    .counter {
        font-size: 60px;
    }
</style>