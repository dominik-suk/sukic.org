<script>
    const initial = 10
    let seconds = initial

    function timer() {
        document.getElementById("timerMessage").style="display: Unset;"
            for(let i = initial; i >= 0; i--) {
                setTimeout(()=>{seconds=i}, ((initial-i) * 1000));
            }
        }
</script>

<button on:click={timer}>Test</button>

{#if seconds > 5}
    <h3 id="timerMessage" style="display: None;"><slot/>{" " + seconds + " seconds"}</h3>
{:else}
    <h3 id="timerMessage"><slot/>{" " + seconds + " second"}</h3>
{/if}
