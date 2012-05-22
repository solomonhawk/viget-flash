(function() {

	var body = document.body,
		time = 10000,
		$    = function(el, scope) { return (scope || document).querySelector(el); },
		$$   = function(el, scope) { return (scope || document).querySelectorAll(el); };

	function sample (arr) {
		return arr[~~(Math.random() * arr.length)];
	}

	function mixUp () {

		if (mixUp.previous) mixUp.previous.className = "";

		var target = mixUp.previous = sample($$("figure"));

		target.className += " selected";

		if (body.offsetWidth / target.offsetLeft <= 2) target.className += " right";

		setTimeout(function() {
			$$(".alt", target)[0].className += " hover";
		}, time * 0.5);

	}

	setInterval(mixUp, time);
	mixUp();

}());