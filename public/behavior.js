(function(window) {

    var F = window.F = {
        flashcards: $("figure"),
        correct: 0,
        incorrect: 0,
        time: 3000,
        rounds: 0
    };
    
    // EJS Friendly Underscore Templates
    $._.templateSettings = {
        interpolate: /\<\@\=(.+?)\@\>/gim,
        evaluate: /\<\@(.+?)\@\>/gim
    };
    
    F.init = function() {

        F.flashcards.each(function(card) {
            
            $(card).find("img").click(function() {
                F.mixUp(card);
            });
            
        });

        $(".global-filter a").click(function(e) {
            
            e.preventDefault();

            $(".global-filter a").removeClass("active");
            $(this).addClass("active");
            
            F.filterByAttribute( $("figure"), "data-team", $(this).attr("data-filter") );
            
        });

        F.shuffleEmUp(F.mixUp);
    };

	  F.sample = function (arr) {
	      return arr[~~(Math.random() * arr.length)];
	  };

    F.stopwatch = {
        
        timeout: null,

        start: function(action, time) {
            F.stopwatch.stop();
            F.stopwatch.rounds += 1;
            F.stopwatch.timeout = setTimeout(action, time || F.time);
        },

        stop: function() {
            clearTimeout(F.stopwatch.timeout);
            F.stopwatch.timeout = null;
        }        

    };

    F.generateMultipleChoice = function (correct, pool, size) {
        
        var clone = Array.apply(null, pool);
        var index = $.indexOf(pool, correct);
        
        size = size || 4;

        clone = clone.slice(0, index).concat( clone.slice(index + 1, -1) );
        
        var incorrect = $.shuffle(clone).slice(0, size - 1);
        
        return $.shuffle( [correct].concat(incorrect) );

    };
    
    F.globalStop = function() {
        
        F.stopwatch.stop();
        $.each(F.shuffleEmUp.timeouts || [], function(e) {
            clearTimeout(e);
        });

        $("figure").removeClass("highlight");
    };
    
    F.shuffleEmUp = function() {
        
        F.shuffleEmUp.timeouts = [];
        
        if ( $("figure.unanswered").length === 0) {
            F.reset();
        }

        var cards = $.shuffle( $("figure.unanswered") ),
            done = [],
            prev;

        $("figure").removeClass("selected highlight");
        
        $.each(cards, function(card, i) {

            F.shuffleEmUp.timeouts[i] = setTimeout(function(next, previous) {
                
                $(next).addClass("highlight");
                $(previous).removeClass("highlight");
                
                done.push(previous);
                
                if (done.length === cards.length) {
                    $("figure").removeClass("highlight");
                    F.mixUp();
                }

            }, (Math.random() * 2500), card, cards[i-1]);

        });

    };

    F.reset = function() {
        $("figure").addClass("unanswered");
        $(".global-filter a").removeClass("active").first().addClass("active");
    };
    
    F.addAnswers = function(card, pool) {
        
        var possible = F.generateMultipleChoice(card, pool),
            $card = $(card),
            answer = $card.attr("data-name"),
            $answers = $card.find(".multiple-choice");

        $answers.empty();

        $card.removeClass("correct incorrect");

        var newAnswers = $.template( $("#tmpl-multiple-choice").html(), {
            answers: possible.map(function(el) {

                if (!el.getAttribute) {
                    return null;
                }

                return el.getAttribute("data-name");
                
            })
        });
        
        $answers.html(newAnswers);
        
        $card.find("button").off("click").one("click", function() {
            
            var guess = $answers.find("[type='radio']:checked").val();

            if ( guess === answer ) {
                F.correct += 1;
                $card.addClass("correct").removeClass("unanswered");
                $(".js-correct").text(F.correct);
            }  else {
                F.incorrect += 1;
                $card.addClass("incorrect");
                $(".js-incorrect").text(F.incorrect);
            }
            
            F.showName($card);
            F.stopwatch.start(F.shuffleEmUp);

        });

    };

    F.showName = function ($target, css) {
        $target.addClass(css ||"reveal");
    };

    F.prepare = function ($target) {

        $target.removeClass("right reveal correct incorrect").addClass("selected");

        if (window.document && document.body.offsetWidth / $target.offset().left <= 2) {
		        $target.addClass("right");
		    }

    };
    
	  F.mixUp = function(override) {
        
        F.globalStop();

        $(".selected").removeClass("selected");
        $(".alt").removeClass("hover");
        
        F.flashcards = $("figure.unanswered");
        
        var plucked  = override || F.sample(F.flashcards),
	          $target  = $(plucked);

        F.addAnswers(plucked, F.flashcards);
        F.prepare($target);

        F.rounds += 1;
        $("#rounds").text(F.rounds);
	  };

    F.filterByAttribute = function($container, criteria, value) {
        
        F.globalStop();

        var bucket = [];

        $container.removeClass("unanswered").each(function() {
            
            if ( value === "*" || $(this).attr(criteria) === value) {
                $(this).addClass("unanswered");
                bucket.push(this);
            }
            
        });
        
        F.shuffleEmUp();

        return bucket;
        
    };
    
    F.init();

}(window));