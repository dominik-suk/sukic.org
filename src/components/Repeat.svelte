<script>
    let repititions = []
	for(let i = 1; i < 11; i++) {
		repititions.push(i)
	}
</script>

{#each repititions as None}
<h1><slot/></h1>
{/each}

<style>
	h1 {
		font-size: 4em;
		font-weight: 100;
	}
</style>