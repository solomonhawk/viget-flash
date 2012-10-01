var libpath = process.env['CHECK_COVERAGE'] ? '../src-cov' : '../src';
var assert = require("assert");

describe ("Helper Tests", function() {
    
    require (libpath + "/helpers");

    it ("should give Strings a new method 'capitalize'", function() {
        var string = "foobar";
        assert.equal( string.capitalize(), "Foobar");
    });
    
    
    it ("should give Arrays a new method 'shuffle'", function() {
        var arr = [1,2,3,4,5];
        arr.shuffle();
    });

});