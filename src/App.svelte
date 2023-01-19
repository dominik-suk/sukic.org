<script>
	import Button from './Button.svelte'
	

	function handleAnchorClick (event) {
		event.preventDefault()
		const link = event.currentTarget
		const anchorId = new URL(link.href).hash.replace('#', '')
		const anchor = document.getElementById(anchorId)
		window.scrollTo({
			top: anchor.offsetTop + -60,
			behavior: "smooth"
		})
	}
	let test = []
	for(let i = 1; i < 11; i++) {
		test.push(i)
	}
</script>

<main>
	<ul style="position:unset;padding-top:1%;">
		<li><img id="logo" href="../App.svelte" src="images/logo.png" alt="DSukic logo" width="115"></li>
		<li style="padding-left: 84%;padding-bottom:2%;"><Button>Darkmode</Button></li>
	</ul>
	<ul class="navbar">
		<li id="anchor-Home"><a href="#anchor-Home" on:click={handleAnchorClick}>Home</a></li>
		<li><a href="#anchor-Design" on:click={handleAnchorClick}>Design</a></li>
		<li><a href="#anchor-Projects" on:click={handleAnchorClick}>Projects</a></li>
	</ul>
	{#each test as t}
		<h1>TEST</h1>
	{/each}
	<h1 id="anchor-Design">Design</h1>
	{#each test as t}
		<h1>TEST</h1>
	{/each}
	<h1 id="anchor-Projects">Projects</h1>
	{#each test as t}
		<h1>TEST</h1>
	{/each}
</main>

<style>
	:global(body) {
		background-color: white;
		color: #161616;
		transition: background-color 0.3s
	}
	:global(body) ul {
		background-color: white;
		color: #161616;
		transition: background-color 0.3s
	}
	:global(body.dark-mode) {
		background-color: #1d3040;
		color: white;
	}
	:global(body.dark-mode) a {
            color: white;
    }
	:global(body.dark-mode) ul {
			background-color: #1d3040;
            color: white;
			border-bottom: 1px solid white;
    }

	li {
		float: left;
	}
	ul {
		position: sticky;
		top: 0;
		width: 95%;
		list-style-type: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		border-bottom: 1px solid #161616;
	}
	a {
		color: #161616;
		display: block;
		padding: 20px;
	}
	li a {
		display: block;
		text-align: center;
		padding: 14px, 16px;
		text-decoration: none;
	}
	li a:hover {
		color:#04AA6D;
		transition: 0.15s;
	}
	main {
		padding: 2em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		font-size: 4em;
		font-weight: 100;

	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>