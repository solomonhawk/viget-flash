var libpath = process.env['CHECK_COVERAGE'] ? '../src-cov' : '../src';
var assert = require("assert");
var should = require("chai").should();
var EventEmitter = require("events").EventEmitter;

describe ("Dealer Tests", function() {

    var Dealer = require(libpath + "/dealer.js"),
        dealer = new Dealer();

    beforeEach (function() {
        dealer = new Dealer();
    });

    it ("should inherit from EventEmitter", function() {
        assert(dealer instanceof EventEmitter);
    });

    it ("can get html from a URL", function(done) {
        
        dealer.collect("http://viget.com/about#team")
            .on("data", function(data, response) {
                assert(response.statusCode, 200);
                done();
            });
        
    });

    it ("can handle bad requests", function(done) {
        dealer.collect("http://ohsnapthisistotallywrong");
        dealer.on("error", function() {
            done();
        });
    });

    it ("can parse out vcards from html", function(done) {
        
        dealer.collect("http://viget.com/about")
            .on("data", function(raw, response) {

                assert(response.statusCode, 200);

                var vcards = dealer.parse(raw);

                var sample = vcards[0];
                sample.should.have.property("name");

                done();
            });
        
    });

    it ("can parse out vcards from a specific container", function(done) {

        dealer.collect("http://viget.com/about")
            .on("data", function(raw, response) {

                assert(response.statusCode, 200);

                var vcards = dealer.parse(raw, "#team");

                var sample = vcards[0];
                sample.should.have.property("name");

                done();
            });
        
    });
    
});