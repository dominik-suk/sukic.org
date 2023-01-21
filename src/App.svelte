<script>
	import Button from './Button.svelte'
	import { onMount } from "svelte";

	const key = "6LelNBYkAAAAAJUEuyoax3If2Oamnoca0NtSYTkS";
	let State = {
	idle: "idle",
	requesting: "requesting",
	success: "success"
	};
	let token;
	let state = State.idle;

	function onSubmit() {
	state = State.requesting;
	doRecaptcha();
	}

	function doRecaptcha() {
	grecaptcha.ready(function() {
		grecaptcha.execute(key, { action: "submit" }).then(function(t) {
		state = State.success;
		token = t;
		});
	});
	}

	const formValues = {
		name: "",
		message: "",
		country: "",
		jobLocation: ""
	}

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

<svelte:head>
  <script src="https://www.google.com/recaptcha/api.js?render={key}" async defer></script>
</svelte:head>

<main>
	<ul style="position:unset;padding-top:1%;">
		<li><img id="logo" href="../App.svelte" src="images/logo.png" alt="DSukic logo" width="115"></li>
		<li style="padding-left: 84%;padding-bottom:2%;"><Button>Darkmode</Button></li>
	</ul>

	<ul class="navbar">
		<li id="Home"><a href="#Home" on:click={handleAnchorClick}>Home</a></li>
		<li><a href="#Design" on:click={handleAnchorClick}>Design</a></li>
		<li><a href="#Projects" on:click={handleAnchorClick}>Projects</a></li>
		<li style="float: right;"><a href="#Contact" on:click={handleAnchorClick}>Contact</a></li>
	</ul>

	{#each test as t}
		<h1>TEST</h1>
	{/each}
	<h1 id="Design">Design</h1>
	{#each test as t}
		<h1>TEST</h1>
	{/each}
	<h1 id="Projects">Projects</h1>
	{#each test as t}
		<h1>TEST</h1>
	{/each}

	<section id="Contact">
		<div>
			<h1>Contact</h1>
			<h2>You can send me a message using this form.</h2>
		</div>

		<div>
			<pre>
				{JSON.stringify(formValues, null, 2)}
			</pre>
		</div>
		<form>
			<div>
				<label for="name">Name</label>
				<input id="name" bind:value={formValues.name} />
			</div>
	
			<div>
				<label for="message">Message</label>
				<textarea id="message" rows="10" cols="80" bind:value={formValues.message} />
			</div>
			<form on:submit|preventDefault={onSubmit}>
				<button type="submit">submit</button>
			  </form>
			<div>state: {state}</div>
			token: <br />{token}
			<div>
				<label for="country">Country</label>
				<select id="country" bind:value={formValues.country}>
					<option value="">Select a country</option>
					<option value="india">India</option>
					<option value="vietnam">Vietnam</option>
					<option value="singapore">Singapore</option>
				</select>
			</div>
		</form>
	</section>
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

	input + label {
		display: inline-flex;
	}

	textarea {
		resize: none;
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

	h2 {
		font-size: 1.5em;
		font-weight: 50;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
