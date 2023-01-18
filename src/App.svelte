<script>
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
	function darkmode() {
		alert("Work in progress!")
	}
	let test = []
	for(let i = 1; i < 11; i++) {
		test.push(i)
	}
</script>

<main>
	<ul style="position:unset;">
		<li><img href="../App.svelte" src="images/logo.png" alt="DSukic logo" width="115"></li>
		<li style="padding-left: 84%;padding-bottom:85px;"><div class="img">
			<img src="images/button.png" alt="Darkmode">
			<img src="images/button_hover.png" class="hover_img" alt="Darkmode" on:click={darkmode} on:keyup={darkmode}>
		</div></li>
	</ul>
	<ul>
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
		<h1>Hallo TEST</h1>
	{/each}
</main>

<style>
	.img {
		cursor: pointer;
		position: absolute;
		float: right;
	}
	.img:hover .hover_img{
		display: inline;
	}
	.hover_img {
		position: absolute;
		top: 0;
		left: 0;
		display: none;
		
	}

	li {
		float: left;
		background-color: white;
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
		display: block;
		padding: 20px;
	}

	li a {
		display: block;
		color: #161616;
		text-align: center;
		padding: 14px, 16px;
		text-decoration: none;
	}

	li a:hover {
		color:#04AA6D;
	}
	
	main {
		/* text-align: center; */
		padding: 2em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #161616;
		font-size: 4em;
		font-weight: 100;

	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
