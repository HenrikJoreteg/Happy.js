module("Tiny Validator");

function fixture(html) {
    return $('#qunit-fixture').html('<form>' + html + '</form>').find('form');
}

function submit() {
    $('form').trigger('submit');
}

function fill() {
    $('#textInput1').val('hjoreteg@gmail.com');
    $('#textInput2').val('(909)555-5555');
    $('#textarea1').val('something');
    $('#password1').val('password');
    $('#password2').val('password');
}

test("check basic required", function () {
	var form = fixture('<input type="text" id="textInput1" />');
	
	form.isHappy({
	    fields: {
	        '#textInput1': {
	            required: true,
	            message: 'Please enter an email'
	        }
	    },
	    testMode: true
	});
	
	form.trigger('submit');
	equal($('.unhappy').length, 1);
	equal($('.unhappyMessage').length, 1);
	
	$('#textInput1').val('test');
	form.trigger('submit');
	equal($('.unhappy').length, 0);
	equal($('.unhappyMessage').length, 0);
});

test("check email", function () {
	var form = fixture('<input type="text" id="textInput1" />');
	
	form.isHappy({
	    fields: {
	        '#textInput1': {
	            required: true,
	            message: 'Please enter an email',
	            test: happy.email
	        }
	    },
	    testMode: true
	});
	
	form.trigger('submit');
	equal($('.unhappy').length, 1);
	console.log($('.unhappyMessage'));
	equal($('.unhappyMessage').length, 1);
	
	$('#textInput1').val('test');
	form.trigger('submit');
	equal($('.unhappy').length, 1);
	equal($('.unhappyMessage').length, 1);
	
	$('#textInput1').val('hjoreteg@gmail.com');
	form.trigger('submit');
	equal($('.unhappy').length, 0);
	equal($('.unhappyMessage').length, 0);
});