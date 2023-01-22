<script>
	import Navbar from './components/Navbar.svelte';
    import Header from './components/Header.svelte';
    import Repeat from './components/Repeat.svelte';
	import Contact from './components/Contact.svelte';
	import Footer from './components/Footer.svelte';
</script>

<main>
	<Header />
	<Navbar />

	<Repeat>TEST</Repeat>
	<h1 id="Design">Design</h1>
	<Repeat>TEST</Repeat>
	<h1 id="Projects">Projects</h1>
	<Repeat>TEST</Repeat>

	<Contact />
	<Footer />
</main>


<style>
	:global(body) {
		background-color: white;
		color: #161616;
		transition: background-color 0.3s
	}

	:global(body.dark-mode) {
		background-color: #1d3040;
		color: white;
	}

	main {
		margin: 0 auto;
		margin: 2em;
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
