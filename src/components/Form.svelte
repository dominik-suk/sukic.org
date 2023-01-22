<script>
    import Countries from './Countries.svelte';
    import Counter from './Counter.svelte';
    import Recaptcha from './Recaptcha.svelte';

    const formValues = {
		name: "",
		email: "",
		subject: "",
		message: "",
		country: ""
	}
    var w = window.innerWidth;
    console.log(w)
</script>

<form action="https://api.staticforms.xyz/submit" method="post">
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
        <select id="country">
            <option value="">Select a country</option>
            <Countries/>
        </select>
        <input type="text" name="$country" value={formValues.country} style="display:None">
        <input id="submitButton" style="margin-left: 290px;" type="submit" value="Send" />
    </div>
    <input type="hidden" name="replyTo" value="@">
    <!-- <input type="hidden" name="redirectTo" value="https://example.com/contact/success"> -->
    <input type="text" name="honeypot" style="display: none;">
    <Recaptcha />
</form>

<Counter>You can send another message in</Counter>
	
<div>
    <pre>
        {JSON.stringify(formValues, null, 2)}
    </pre>
</div>

<style>
    textarea {
		resize: none;
	}
</style>