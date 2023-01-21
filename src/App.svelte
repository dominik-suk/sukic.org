<script>
	import Button from './Button.svelte'
	import { Recaptcha, recaptcha, observer } from "svelte-recaptcha-v2";

	const onCaptchaReady = (event) => {
		console.log("recaptcha init has completed.")
		/*
		│You can enable your form button here.
		*/
	};

	const onCaptchaSuccess = (event) => {
		userTracker.resolve(event);
		console.log("token received: " + event.detail.token);
		/*
		│If using checkbox method, you can attach your
		│form logic here, or dispatch your custom event.
		*/
	};

	const onCaptchaError = (event) => {
		console.log("recaptcha init has failed.");
		/*
		│Usually due to incorrect siteKey.
		|Make sure you have the correct siteKey..
		*/
	};

	const onCaptchaExpire = (event) => {
		console.log("recaptcha api has expired");
		/*
		│Normally, you wouldn't need to do anything.
		│Recaptcha should reinit itself automatically.
		*/
	};

	const onCaptchaOpen = (event) => {
		console.log("google decided to challange the user");
		/*
		│This fires when the puzzle frame pops.
		*/
	};

	const onCaptchaClose = (event) => {
		console.log("google decided to challange the user");
		/*
		│This fires when the puzzle frame closes.
		│Usually happens when the user clicks outside
		|the modal frame.
		*/
	};

	const submitHandler = async () => {
		console.log("launching recaptcha");
		recaptcha.execute();

		console.log("pending for google response");
		const event = await Promise.resolve(observer);

		const recaptchaToken = event.detail?.token ? event.detail.token : false;

		if (!recaptchaToken) {
			console.log("recaptcha is NOT OK");
			return false;
		}

		console.log("token retrieved", recaptchaToken);
	};

	const googleRecaptchaSiteKey="6LeRwxQkAAAAAG1wudyYeYYm5TLTiDJQBdEve4j_";
	
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

	<Recaptcha
		sitekey={googleRecaptchaSiteKey}
		badge={"top"}
		size={"invisible"}
		on:success={onCaptchaSuccess}
		on:error={onCaptchaError}
		on:expired={onCaptchaExpire}
		on:close={onCaptchaClose}
		on:ready={onCaptchaReady} />
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
			<button on:click={submitHandler}>Send</button>

			<div>
				<label for="country">Country</label>
				<select id="country" bind:value={formValues.country}>
					<option value="">Select a country</option>
					<option value="india">India</option>
					<option value="vietnam">Vietnam</option>
					<option value="singapore">Singapore</option>
				</select>
			</div>

			<div>
				<label for="job-location">Job Location</label>
				<select id="job-location" bind:value={formValues.jobLocation} multiple>
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
