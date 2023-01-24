<script>
    import Darkmode from './Darkmode.svelte'
</script>

<ul class="top" style="position:unset;padding-top:1%;">
    <li><img id="logo" href="../App.svelte" src="./images/logo.png" alt="DSukic logo" width="115"></li>
    <li style="padding-left: 84%;padding-bottom:2%;"><Darkmode/></li>
</ul>

<style>
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

    :global(body) ul {
		background-color: white;
		color: #161616;
		transition: background-color 0.3s
	}

	:global(body.dark-mode) ul {
			background-color: #1d3040;
            color: white;
			border-bottom: 1px solid white;
    }
</style>