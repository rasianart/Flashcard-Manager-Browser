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

const basic = new BasicFlashcard();
const cloze = new ClozeFlashcard();

const createMethods = () => {
	methods.forEach(function(itm) {
    $(`<div id=${itm} class="method">${itm}</div>`).appendTo('#method-holder');
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
        randomCard('random');
    } else if (id === 'read') {
        readCardType('read');
    } else if (id === 'create') {
        createCard('create');
    }
}

const randomCard = (type) => {
    let request = $.ajax({
	    url: 'http://jservice.io/api/random',
	    method: 'GET',
	});
    request.done(function(data) {
    	basic.front = data[0].question;
    	basic.back = data[0].answer;
        $('#method-holder').html(basic.front);
        $('<div class="answer">ANSWER</div>').appendTo('#method-holder');
        answer(basic.back, type);
    });
}

const waitRestore = () => {
	wait = setTimeout(function() {
		$('#method-holder').empty();
		createMethods();
	}, 3000);
}

const answer = (result, typeParam) => {
	$(document).on('click', 'div.answer' , function() {
		$('.answer').remove();
		$('<div class="answer"></div>').appendTo('#method-holder');
		$('.answer').html(result);
		if (typeParam === 'random') {
			$('<div id="save-random"></div>').appendTo('.answer');
			$('#save-random').html('Would you like to save this flashcard?');
			$('<div id="yes" class="confirm"></div>').appendTo('#save-random');
			$('#yes').html('yes');
			$('<div id="no" class="confirm"></div>').appendTo('#save-random');
			$('#no').html('no');
			$(document).on('click', 'div.confirm', function() {
				$('#method-holder').empty();
				if ($(this).attr('id') === 'yes') {
					let request2 = $.ajax({
			    		url: 'save_database_basic.php?argument1='+basic.front+'&argument2='+basic.back,
			    		method: 'GET',
					});
					request2.done(function(data) {
						$('#method-holder').html(data);
						waitRestore();
					});
				} else {
					$('#method-holder').html('OK, what else would you like to do?');
					waitRestore();
				}
			});
		} else {
			wait = setTimeout(function() {
				$('#method-holder').html('OK, what else would you like to do?');
					waitRestore();
			}, 3000);
		}
	})
}

const readCardType = () => {
	$('#method-holder').html('Would you like to read a basic flashcard or a cloze-deleted flashcard from the database?');
	$('<div id="basic" class="confirm2">basic</div>').appendTo('#method-holder');
	$('<div id="cloze" class="confirm2">cloze</div>').appendTo('#method-holder');
	$(document).on('click', 'div.confirm2', function() {
		let cardType = $(this).attr('id');
		readCardType2(cardType);
	})
}

const readCardType2 = (basicOrCloze) => {
	$('.confirm').remove();
	$('#method-holder').html('Would you like to search the database for a card or choose a random card?');
	$('<div id="search" class="confirm3">search</div>').appendTo('#method-holder');
	$('<div id="random" class="confirm3">random</div>').appendTo('#method-holder');
	$(document).on('click', 'div.confirm3', function() {
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
			        if (basicOrCloze === 'basic') {
						let request2 = $.ajax({
				    		url: 'search_database_basic.php?argument1='+query,
				    		method: 'GET',
						});
						request2.done(function(data) {
					        $('.returns').remove();
					        if (data.length < 3) {
					        	$('<div class="returns">0 results</div>').appendTo('#method-holder');
					        } else {
						        data = JSON.parse(data);
						        for (let i = 0; i < data.length; i++) {
						        	$('<div id=' + i + ' class="returns">' + (i+1) + ": " + data[i].front + '</div>').appendTo('#method-holder');
						        }
						        $(document).on('click', 'div.returns', function() {
						        	let index = $(this).attr('id');
						        	basic.front = data[index].front;
						        	basic.back = data[index].back;
						        	$('#method-holder').html(basic.front);
						        	$('<div class="answer">ANSWER</div>').appendTo('#method-holder');
        							answer(basic.back, type);
						        })
						    }
					    });
					} else {
						let request3 = $.ajax({
				    		url: 'search_database_cloze.php?argument1='+query,
				    		method: 'GET',
						});
						request3.done(function(data) {
					        $('.returns').remove();
					        if (data.length < 3) {
					        	$('<div class="returns">0 results</div>').appendTo('#method-holder');
					        } else {
						        data = JSON.parse(data);
						        for (let i = 0; i < data.length; i++) {
						        	$('<div id=' + i + ' class="returns">' + (i+1) + ": " + data[i].text + '</div>').appendTo('#method-holder');
						        }
						        $(document).on('click', 'div.returns', function() {
						        	let index = $(this).attr('id');
						        	cloze.text = data[index].text;
						        	cloze.cloze = data[index].cloze;
						        	$('#method-holder').html(cloze.text);
						        	$('<div class="answer">ANSWER</div>').appendTo('#method-holder');
        							answer(cloze.cloze, type);
						        })
						    }
					    });
					}
				}
			});
		} else if (type === 'random' && basicOrCloze === 'basic') {
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
		} else if (type === 'random' && basicOrCloze === 'cloze') {
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
	$('<div id="basic-create" class="confirm4">basic</div>').appendTo('#method-holder');
	$('<div id="cloze-create" class="confirm4">cloze</div>').appendTo('#method-holder');
	enterCreation();
}

const enterCreation = () => {
	$(document).on('click', 'div.confirm4', function() {
		if($(this).attr('id') === 'basic-create') {
			$('#method-holder').empty();
			$('<form id="search-form" autocomplete="off"></form>').appendTo('#method-holder');
			$('<input id="search-input2" autofocus placeholder="Please type the question portion of your flashcard">').appendTo('#search-form');
			$(document).on('keypress', 'input#search-input2', function(e) {
				if (e.which == 13) {
			        e.preventDefault();
			        basic.front = $('#search-input2').val().trim();
			        $('#method-holder').empty();
			        $('<form id="search-form" autocomplete="off"></form>').appendTo('#method-holder');
					$('<input id="search-input3" autofocus placeholder="Please type the answer portion of your flashcard">').appendTo('#search-form');
			        $(document).on('keypress', 'input#search-input3', function(e) {
						if (e.which == 13) {
					        e.preventDefault();
					        basic.back = $('#search-input3').val().trim();
					        let request2 = $.ajax({
					    		url: 'save_database_basic.php?argument1='+basic.front+'&argument2='+basic.back,
					    		method: 'GET',
							});
							request2.done(function(data) {
								$('#search-input3').val(data);
								waitRestore();
						    });
					    }
					});
				}	
			});
		} else {
			$('#method-holder').empty();
			$('<form id="search-form" autocomplete="off"></form>').appendTo('#method-holder');
			$('<input id="search-input4" autofocus placeholder="Please enter your cloze flashcard with the cloze portion encapsulated by (   )">').appendTo('#search-form');
			$(document).on('keypress', 'input#search-input4', function(e) {
				if (e.which == 13) {
			        e.preventDefault();
			        let questionInput = $('#search-input4').val().trim();
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
						$('#search-input4').val(data);
						waitRestore();
				    });
			    }
			});
		}
	})
}
