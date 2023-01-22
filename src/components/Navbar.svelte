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
</script>

<ul class="navbar">
    <li id="Home"><a href="#Home" on:click={handleAnchorClick}>Home</a></li>
    <li><a href="#Design" on:click={handleAnchorClick}>Design</a></li>
    <li><a href="#Projects" on:click={handleAnchorClick}>Projects</a></li>
    <li style="float: right;"><a href="#Contact" on:click={handleAnchorClick}>Contact</a></li>
</ul>

<style>
    :global(body) ul {
		background-color: white;
		color: #161616;
		transition: background-color 0.3s
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
</style>