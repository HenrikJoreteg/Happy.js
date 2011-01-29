module("Tiny Validator");

function setup() {
    $('form').validate({
        fields: {
	        '#textInput1': {
	            required: true,
	            message: 'Please enter an email',
	            test: _.isEmail,
	        },
	        '#textInput2': {
	            required: true,
	            message: 'Please enter an email',
	            test: _.isUSPhone    
	        },
	        '#textarea1': {
	            required: true,
	            message: 'Please put something in the text area'
	        },
	        '#password1': {
	            required: true,
	            message: 'Please enter a password'
	        },
	        '#password2': {
	            required: true,
	            message: 'Please make sure it matches 1',
	            test: _.isEqual,
	            arg: function () {
	                return $('#password1').val()
	            }
	        }
        },
        testMode: true
    });
}

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
/*
test("check basic required", function () {
	form = fixture('<input type="text" id="textInput1" />');
	
	form.validate({
	    fields: {
	        '#textInput1': {
	            required: true,
	            message: 'Please enter an email'
	        }
	    },
	    testMode: true
	});
	
	form.submit();
	equal($('.error').length, 1);
	equal($('.errorMessage').length, 1);
	
	$('#textInput1').val('test');
	form.submit();
	equal($('.error').length, 0);
	equal($('.errorMessage').length, 0);
});
*/
test("check email", function () {
	form = fixture('<input type="text" id="textInput1" />');
	
	form.validate({
	    fields: {
	        '#textInput1': {
	            required: true,
	            message: 'Please enter an email',
	            test: _.isEmail
	        }
	    },
	    testMode: true
	});
	
	form.trigger('submit');
	equal($('.error').length, 1);
	equal($('.errorMessage').length, 1);
	
	$('#textInput1').val('test');
	form.trigger('submit');
	equal($('.error').length, 1);
	equal($('.errorMessage').length, 1);
	
	$('#textInput1').val('hjoreteg@gmail.com');
	form.trigger('submit');
	equal($('.error').length, 0);
	equal($('.errorMessage').length, 0);
});

/*
	// now only one
	fill();
	submit();
	equal($('.error').length, 0);
	equal($('.errorMessage').length, 0);
});

test("passed in validation methods", function () {
    setup();
    fill();
    $('#textInput1').val('email');
    submit();
    equal($('.error').length, 1);
    
    $('#textInput1').val('hjoreteg@gmail.com');
    submit();
    equal($('.error').length, 0);
});

test("check basic required", function () {
	setup();
	//expect(4);
	submit();
	equal($('.error').length, 5);
	equal($('.errorMessage').length, 5);
	
	// now only one
	fill();
	submit();
	equal($('.error').length, 0);
	equal($('.errorMessage').length, 0);
});

test("Make sure we don't create duplicate error messages", function () {
	setup();
	expect(1);
	submit();
	submit();
	submit();
	equal($('.error').length, 5);
});


*/