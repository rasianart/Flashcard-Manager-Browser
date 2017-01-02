// import * as basicImp from 'basic_flashcard';
// import * as clozeImp from 'cloze_flashcard';

class BasicFlashcard {
    constructor() {
        this.front,
            this.back
    }
};

class ClozeFlashcard {
    constructor() {
        this.text,
            this.cloze,
            this.clozeDeleted = (questionInput) => {
                let regExp = /\(([^)]+)\)/;
                this.cloze = regExp.exec(questionInput);
                this.cloze = this.cloze[0];
                this.text = questionInput.replace(this.cloze, '...');
            }
    }
};

const methods = ['create', 'read', 'random'];
let cardType = '';

const basic = new BasicFlashcard();
const cloze = new ClozeFlashcard();

const request = $.ajax({
    url: 'http://jservice.io/api/random',
    method: 'GET',

});

const createMethods = () => {
	methods.forEach(function(itm) {
    $(`<div id=${itm} class="method">${itm}</div>`).appendTo('#method-holder');
    // let node = document.createElement('div');
    // let holder = document.getElementById('method-holder');
    // node.id = itm;
    // node.className = 'method';
    // node.innerHTML = itm;
    // holder.appendChild(node);
	});
}
createMethods();

$(document).on('click', 'div.method', function() {
    chooseCard($(this));
});

const chooseCard = (chosen) => {
    $('.method').remove();
    let id = chosen.attr('id');
    if (id === 'random') {
        randomCard();
    } else if (id === 'read') {
        readCardType();
    } else if (id === 'create') {
        createCard();
    }
}

const randomCard = () => {
    request.done(function(data) {
        $('#method-holder').html(data[0].question);
        $('<div class="answer">ANSWER</div>').appendTo('#method-holder');
        answer(data[0].answer);
    });
}

const answer = (result) => {
	$(document).on('click', 'div.answer' , function() {
		$('.answer').remove();
		$('<div class="answer"></div>').appendTo('#method-holder');
		$('.answer').html(result);
        wait = setTimeout(function() {
			$('#method-holder').empty();
			createMethods();
		}, 3000);
	})
}

const readCardType = () => {
	$('#method-holder').html('Would you like to read a basic flashcard or a cloze-deleted flashcard from the database?');
	$('<div id="basic" class="confirm">basic</div>').appendTo('#method-holder');
	$('<div id="cloze" class="confirm">cloze</div>').appendTo('#method-holder');
	$('.confirm').on('click', function() {
		cardType = $(this).attr('id');
		readCardType2();
	})
}

const readCardType2 = () => {
	$('.confirm').remove();
	$('#method-holder').html('Would you like to search the database for a card or choose a random card?');
	$('<div id="search" class="confirm">search</div>').appendTo('#method-holder');
	$('<div id="random" class="confirm">random</div>').appendTo('#method-holder');
	$('.confirm').on('click', function() {
		let type = $(this).attr('id');
		if (type === 'search') {
			$('#method-holder').empty();
			$('<form id="search-form" autocomplete="off"></form>').appendTo('#method-holder');
			$('<input id="search-input" autofocus placeholder="please enter a search term">').appendTo('#search-form');
			$(document).on('keypress', 'input#search-input', function(e) {
				if (e.which == 13) {
			        e.preventDefault();
			        let query = $('#search-input').val().trim();
			        $('#search-input').val('');
			        $('#search-input').attr('placeholder', 'Please select a result');
					let request2 = $.ajax({
			    		url: 'search_database.php?argument1='+query,
			    		method: 'GET',
					});
					request2.done(function(data) {
				        $('.returns').remove();
				        data = JSON.parse(data);
				        for (let i = 0; i < data.length; i++) {
				        	console.log(data[i]);
				        	$('<div id=' + i + ' class="returns">' + (i+1) + ": " + data[i].front + '</div>').appendTo('#method-holder');
				       
				        }
				        if (cardType === 'basic') {
				        	// basic.front = data.front;
				        	// basic.back = data.back;
				        	// console.log(basic.front);
				        } else {

				        }
				    });
				}
			});
		} else if (type === 'random' && cardType === 'basic') {
			let request3 = $.ajax({
	    		url: 'random_database_basic.php',
	    		method: 'GET',
			});
			request3.done(function(data) {
		        data = JSON.parse(data);
	        	basic.front = data.front;
	        	basic.back = data.back;
	        	$('#method-holder').empty();
	        	$('#method-holder').html(basic.front);
	        	$('<div class="answer">ANSWER</div>').appendTo('#method-holder');
        		answer(basic.back);
		    });
		} else if (type === 'random' && cardType === 'cloze') {
			let request3 = $.ajax({
	    		url: 'random_database_cloze.php',
	    		method: 'GET',
			});
			request3.done(function(data) {
		        data = JSON.parse(data);
	        	cloze.text = data.text;
	        	cloze.cloze = data.cloze;
	        	$('#method-holder').empty();
	        	$('#method-holder').html(cloze.text);
	        	$('<div class="answer">ANSWER</div>').appendTo('#method-holder');
        		answer(cloze.cloze);
		    });
		}
	})

}

const createCard = () => {
	$('#method-holder').html('Would you like to create a basic or a cloze-deleted flashcard?');
	$('<div id="basic-create" class="confirm">basic</div>').appendTo('#method-holder');
	$('<div id="cloze-create" class="confirm">cloze</div>').appendTo('#method-holder');
	enterCreation();
}

const enterCreation = () => {
	$(document).on('click', 'div.confirm', function() {
		if($(this).attr('id') === 'basic-create') {
			$('#method-holder').empty();
			$('<form id="search-form" autocomplete="off"></form>').appendTo('#method-holder');
			$('<input id="search-input" autofocus placeholder="Please type the question portion of your flashcard">').appendTo('#search-form');
			$(document).on('keypress', 'input#search-input', function(e) {
				if (e.which == 13) {
			        e.preventDefault();
			        basic.front = $('#search-input').val().trim();
			        $('#method-holder').empty();
			        $('<form id="search-form" autocomplete="off"></form>').appendTo('#method-holder');
					$('<input id="search-input2" autofocus placeholder="Please type the answer portion of your flashcard">').appendTo('#search-form');
			        $(document).on('keypress', 'input#search-input2', function(e) {
						if (e.which == 13) {
					        e.preventDefault();
					        basic.back = $('#search-input2').val().trim();
					        let request2 = $.ajax({
					    		url: 'save_database.php?argument1='+basic.front+'&argument2='+basic.back,
					    		method: 'GET',
							});
							request2.done(function(data) {
								$('#search-input2').val(data);
								wait = setTimeout(function() {
									$('#method-holder').empty();
									createMethods();
								}, 3000);
						    });
					    }
					});
				}	
			});
		} else {
			$('#method-holder').empty();
			$('<form id="search-form" autocomplete="off"></form>').appendTo('#method-holder');
			$('<input id="search-input" autofocus placeholder="Please enter your cloze flashcard with the cloze portion encapsulated by (   )">').appendTo('#search-form');
			$(document).on('keypress', 'input#search-input', function(e) {
				if (e.which == 13) {
			        e.preventDefault();
			        let questionInput = $('#search-input').val().trim();
			        let regExp = /\(([^)]+)\)/;
		    		cloze.cloze = regExp.exec(questionInput);
		    		cloze.cloze = cloze.cloze[0];
		    		cloze.text = questionInput.replace(cloze.cloze, '...');
		    		console.log(cloze.text);
			    	let request2 = $.ajax({
			    		url: 'save_database_cloze.php?argument1='+cloze.text+'&argument2='+cloze.cloze,
			    		method: 'GET',
					});
					request2.done(function(data) {
						$('#search-input').val(data);
						wait = setTimeout(function() {
							$('#method-holder').empty();
							createMethods();
						}, 3000);
				    });
			    }
			});
		}
	})
}






