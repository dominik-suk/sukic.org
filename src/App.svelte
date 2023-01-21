<script>
	import Button from './Button.svelte'
	import { onMount } from "svelte";
	let countries = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

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
		email: "",
		subject: "",
		message: "",
		country: ""
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

	<section id="Contact" style="margin-left: 20%;">
		<div>
			<h1 style="line-height: .5;">Contact</h1>
			<h2>You can send me a message using this form</h2>
		</div>

		<form action="https://api.staticforms.xyz/submit" method="post" on:submit|preventDefault={onSubmit}>
        <input type="hidden" name="accessKey" value="7cb6f557-c5cd-4476-80d5-bcc8612cc3c3">
		<div>
			<input type="text" name="name" placeholder="Name" bind:value={formValues.name}>
			<input type="email" placeholder="Email" bind:value={formValues.email}>
			<input type="text" name="email" placeholder="Email" value={formValues.email} style="display:None">
		</div>
		<div>
			<input type="text" name="subject" size="78" placeholder="Subject" bind:value={formValues.subject}>
		</div>
		<div>
        	<textarea name="message" rows="10" cols="80" placeholder="Message" bind:value={formValues.message}></textarea>
        </div>
		<div>
			<label for="country">Country</label>
			<select id="country" bind:value={formValues.country}>
				<option value="">Select a country</option>
				{#each countries as country}
					<option>{country}</option>
				{/each}
			</select>
			<input type="text" name="$country" value={formValues.country} style="display:None">
			<input style="margin-left: 290px;" type="submit" value="Send" />
		</div>
        <input type="hidden" name="replyTo" value="@">
        <input type="hidden" name="redirectTo" value="https://example.com/contact/success">
		<input type="text" name="honeypot" style="display: none;">
    </form>
	
	<div>
		<pre>
			{JSON.stringify(formValues, null, 2)}
		</pre>
	</div>
	<div>
		state: {state}
	</div>
	token: <br />{token}
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
