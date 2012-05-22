var express  = require("express"),
	request  = require("request"),
	ejs      = require("ejs"),
	$        = require("jQuery"),
	contacts = [];

require("colors");

require("./helpers");

// The Server ----------------------------------- //

var app = express.createServer().listen(process.env.PORT || 8080);

app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("index", { contacts: contacts});
}); 

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});


// The Harvester -------------------------------- //

function getContacts(html) {

	var ret = [];

	$(html).find(".section-team .vcard").each(function() {	

		var self = $(this);

		ret.push({

			name     : self.find(".fn").text(),
			team     : self.data("team").capitalize(),

			location : self.data("location").split("-").map(function(l) {
				return l.capitalize();
			}).join(" "),
			
			likes    : self.data("interests").split(" ").map(function(l) {
				return l.capitalize();
			}),

			photo    : "http://viget.com" + self.find("img").attr("src")
		});
	});

	return ret;

}

request("http://viget.com/about", function(err, data) {
	if (err) console.error("Something went wrong, do you have an internet connection?");
	contacts = getContacts(data.body);
	console.log("   info  -".cyan, "Found", contacts.length.toString().magenta, "contacts for Viget");
});