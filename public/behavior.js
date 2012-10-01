(function() {
    
    console.log("Cheating is for losers...");
    
	  var body = document.body,
		    time = 3000,
        rounds = 1;

    var correct = 0;
    var incorrect = 0;
    
    // EJS Friendly Underscore Templates
    $._.templateSettings = {
        interpolate: /\<\@\=(.+?)\@\>/gim,
        evaluate: /\<\@(.+?)\@\>/gim
    };
    
	  function sample (arr) {
	      return arr[~~(Math.random() * arr.length)];
	  }

    var flashcards = $("figure");
    var stopwatch = (function() {
        
        var timeout = null,
            countdown = time;
        
        var me = {};
        
        me.start = function(action) {
            timeout && me.stop();
            rounds += 1;
            $("#rounds").html("Rounds: " + rounds);
            var timeout = setTimeout(action, countdown);
        };
        
        me.stop = function() {
            timeout && clearTimeout(timeout);
        };

        return me;

    }());

    function generateMultipleChoice(correct, pool) {
        
        var clone = Array.apply(null, pool),
            index = $.indexOf(pool, correct);

        clone = clone.slice(0, index).concat( clone.slice(index + 1, -1) );
        
        var incorrect = $.shuffle(clone).slice(0, 3);
        
        return $.shuffle( [correct].concat(incorrect) );

    }
    
    function globalStop() {
        
        stopwatch.stop();
        $.each(shuffleEmUp.timeouts || [], function(e) {
            clearTimeout(e);
        });

        $("figure").removeClass("highlight");
    }
    
    function shuffleEmUp(then) {
        
        shuffleEmUp.timeouts = [];
        
        if ( $("figure.unanswered").length === 0) {
            reset();
        }

        var cards = $.shuffle( $("figure.unanswered") ),
            done = [],
            prev;

        $("figure").removeClass("selected highlight");
        
        $.each(cards, function(card, i) {

            shuffleEmUp.timeouts[i] = setTimeout(function(next, previous) {
                
                $(next).addClass("highlight");
                $(previous).removeClass("highlight");
                
                done.push(previous);
                
                if (done.length === cards.length) {
                    $("figure").removeClass("highlight");
                    mixUp();
                }

            }, (Math.random() * 2500), card, cards[i-1]);

        });

    }

    function reset() {
        $("figure").addClass("unanswered");
        $(".global-filter a").removeClass("active").first().addClass("active");
    }
    
    function addAnswers(card) {
        
        var possible = generateMultipleChoice(card, flashcards),
            $card = $(card),
            answer = $card.attr("data-name"),
            $answers = $card.find(".multiple-choice");

        $answers.empty();

        $card.removeClass("correct incorrect");

        var newAnswers = $.template( $("#tmpl-multiple-choice").html(), {
            answers: possible.map(function(el) { 
                return el.getAttribute("data-name");
            })
        });
        
        $answers.html(newAnswers);
        
        $card.find("button").off("click").one("click", function() {
            
            var guess = $answers.find("[type='radio']:checked").val();

            if ( guess === answer ) {
                correct += 1;
                $card.addClass("correct").removeClass("unanswered");
                $(".js-correct").text(correct);
            }  else {
                incorrect += 1;
                $card.addClass("incorrect");
                $(".js-incorrect").text(incorrect);
            }
            
            showName($card);
            stopwatch.start(shuffleEmUp);

        });
    }

    function showName ($target) {
        $target.addClass("reveal");
    }

    function prepare ($target) {

        $target.removeClass("right reveal correct incorrect").addClass("selected");

        if (body.offsetWidth / $target.offset().left <= 2) {
		        $target.addClass("right");
		    }

    }
    
	  function mixUp (override) {
        
        globalStop();

        $(".selected").removeClass("selected");
        $(".alt").removeClass("hover");
        
        flashcards = $("figure.unanswered");
        
        var plucked  = override || sample(flashcards),
	          $target  = $(plucked);

        addAnswers(plucked);
        prepare($target);
	  }

    function filter (criteria, value) {
        
        console.log("Filtering %s by: %s", criteria, value);
        
        $("figure").removeClass("unanswered");
        
        $("figure").each(function() {

            if ( value === "*" || $(this).attr(criteria) === value) {
                $(this).addClass("unanswered");
            }

        });
        
        mixUp();
        
    }

    flashcards.each(function(card) {
        $(card).find("img").click(function() {
            mixUp(card);
        });
    });

    $(".global-filter a").click(function(e) {

        e.preventDefault();

        $(".global-filter a").removeClass("active");
        $(this).addClass("active");
        
        filter( "data-team", $(this).attr("data-filter") );

    });
	  
    shuffleEmUp(mixUp);

}());