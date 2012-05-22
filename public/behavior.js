(function() {

	var body = document.body,
		time = 10000;

	function $ (el, scope) { 
		return (scope || document).querySelector(el); 
	}

	function $$ (el, scope) { 
		return (scope || document).querySelectorAll(el); 
	}

	function sample (arr) {
	    return arr[~~(Math.random() * arr.length)];
	}

	function mixUp () {

	    if (mixUp.target) {
	    	mixUp.target.className = "";
		}

	    if (mixUp.altName) {
	    	mixUp.altName.className = "alt";
		}

	    var target  = mixUp.target = sample($$("figure")),
			altName = mixUp.altName = $(".alt", target);

	    target.className += " selected";

	    if (body.offsetWidth / target.offsetLeft <= 2) {
		    target.className += " right";
		}

	    setTimeout(function() {
		      altName.className = "alt hover";
	    }, time * 0.5);

	}

	setInterval(mixUp, time);
	mixUp();

}());