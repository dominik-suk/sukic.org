<script>
    export let initial
    let seconds = initial

    function timer() {
        for(let i = initial; i > 0; i--) {
            setTimeout(()=>{seconds=i}, ((initial-i) * 1000));
        }
    }
    
    timer()
</script>

{#if initial > 1}
    <h3 id="timerMessage"><slot/>{seconds}</h3>
{/if}