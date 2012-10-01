var express	 = require("express");
var ejs = require("ejs");
var port = process.env.PORT || 9292;

require("colors");
require("./helpers");

var contacts = [];


// Server ---------------------------------------- //

var app = express.createServer().listen(port, function() {
		console.log("		info	- Listening on port " + port.toString().green);
});

app.set("view engine", "ejs");

app.configure(function(){
		app.use(express.static('public'));
});


// Routes ---------------------------------------- //

app.get("/", function(req, res) {
		res.render("index", { contacts: contacts});
}); 


// The Harvester -------------------------------- //

var dealer = new (require("./dealer"))();

dealer.collect("http://viget.com/about");

dealer.on("data", function(html) {
		contacts = dealer.parse(html, "#team");
		console.log("		info	- Found", contacts.length.toString().magenta, "contacts for Viget");
});

dealer.on("error", function(e) {
		console.log("		error - ".red, e);
});

setInterval(function() {
		dealer.collect("http://viget.com/about");
}, 7200000);