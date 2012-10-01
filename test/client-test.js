(function(describe, it, expect, assert) {

    describe("Viget Flashcard Game", function() {

        var F = window.F;

        it ("#sample - it can randomly pick an item out of an array", function() {
            var haystack = [1,2,3,4,5];
            var needle = F.sample(haystack);
            expect(haystack).to.contain(needle);
        });
        
        it ("#generateMultipleChoice - can develop a set answers given a pool and a correct answer", function() {

            var pool    = [1,2,3,4,5,4,5,6];
            var correct = 5;
            var choices = F.generateMultipleChoice(5, pool, 4);

            expect(choices).to.contain(correct);
            expect(choices).to.have.length(4);

        });

        it ("#globalStop - can clear all time based events", function() {
            
            F.stopwatch.start(function() {});
            F.shuffleEmUp(function() {});
            
            F.globalStop();

            assert(!F.stopwatch.timeout);
            expect(F.shuffleEmUp).to.have.length(0);

        });
        
        it ("#showName - can reveal the text behind a tooltip's mask", function() {
            
            var tooltip = $("<figure/>");

            F.showName(tooltip);

            assert.equal(tooltip.attr("class"), "reveal");
            
        });

        it ("#prepare - can reset an individual element to it's base state", function() {
            
            var figure = $("<figure />").addClass("right reveal correct incorrect");

            F.prepare(figure);

            assert( !figure.hasClass("reveal") );
            assert( !figure.hasClass("correct") );
            assert( !figure.hasClass("incorrect") );
            
        });

        it ("#filterByAttribute - can reduce a set down based upon a criteria", function() {
            
            var figureOne = $("<figure data-name='foo' />");
            var figureTwo = $("<figure data-name='baz' />");
            
            var filtered = F.filterByAttribute( 
                figureOne.and(figureTwo), "data-name", "foo"
            );
            
            expect(filtered).to.have.length(1);
            assert(filtered[0], figureOne);
            
        });

        it ("#addAnswers - can generate a multiple choice quiz on a flashcard", function() {

            var $card = $("<figure />");
            var $list = $("<ul class='multiple-choice'/>");
            
            $card.append($list);
            
            var pool = $("");
            
            for (var i = 0; i < 5; i++) {
                var item = document.createElement("figure");
                item.setAttribute("data-name", "baz-bar");
                pool.and(item);
            }

            F.addAnswers($card, pool);
            
        });

        describe ("Stopwatch", function() {

            var S = F.stopwatch;
            
            it ("#start - run an action after a specific time period", function(done) {
                S.start(done, 10);
                assert(S.timeout);
            });

            it ("#stop - can stop a running function", function() {
                S.start(function() {}, 1000);
                S.stop();
                assert(!S.timeout, "Timeout was not cleared");
            });

        });
        
    });

}(window.describe, window.it, window.chai.expect, window.chai.assert));