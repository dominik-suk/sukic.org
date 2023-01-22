<script>
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
</script>

<svelte:head>
  <script src="https://www.google.com/recaptcha/api.js?render={key}" async defer></script>
</svelte:head>