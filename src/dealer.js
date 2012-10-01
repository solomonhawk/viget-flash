/*
 * Dealer
 * Harvests vCards
 */

var request = require("request");
var util = require('util');
var events = require("events");
var $ = require("jQuery");

var Dealer = module.exports = function() {};

require("./helpers");

util.inherits(Dealer, events.EventEmitter);

Dealer.prototype.parse = function(html, filter) {

		var ret = [];
		
		var $html = $(html);

		if (filter) {
				$html = $html.find(filter);
		}
		
		$html.find(".vcard").each(function() {	

				var self = $(this);
				var meta = $(self).data();
				
				meta = $.extend(meta, {

						name : self.find(".fn").text(),
						team : self.data("team").capitalize(),

						location : self.data("location").split("-").map(function(l) {
								return l.capitalize();
						}).join(" "),
						
						likes : self.data("interests").split(" ").map(function(l) {
								return l.capitalize();
						}),

						photo : "http://viget.com" + self.find("img").attr("src")
				});

				ret.push(meta);

		});

		return ret;

};

Dealer.prototype.collect = function(url) {
		
		var self = this;
		
		request(url, function(err, response) {
				
				if (err) {
						self.emit("error", err);
						return;
				}
				
				self.emit("data", response.body, response);

		});

		return this;
};