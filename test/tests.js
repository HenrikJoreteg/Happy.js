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

test("check setting required with 'required' attribute", function () {
	var form = fixture('<input type="text" required id="textInput1" />');
	
	form.isHappy({
	    fields: {
	        '#textInput1': {
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


test("test password match", function () {
    var form = fixture('<input type="password1" id="p1" /><input type="password2" id="p2" />');
    
    form.isHappy({
        fields: {
            '#p1': {
                required: true,
                message: 'Please enter a new password',
                test: function (val1, val2) {
                    console.log('test called', arguments);
                    console.log((val1 === val2));
                    return (val1 === val2);
                },
                arg: function () {
                    console.warn('arg func evalled', $('#p2').val());
                    return $('#p2').val();
                }
            },
            '#p2': {
                required: true,
                message: 'Please enter your new password again'
            }
        },
        testMode: true
    });
    
    form.trigger('submit');
    equal($('.unhappy').length, 2);
    equal($('.unhappyMessage').length, 2);
    
    $('#p1').val('test');
    form.trigger('submit');
    equal($('.unhappy').length, 2);
    equal($('.unhappyMessage').length, 2);
    
    $('#p2').val('test2');
    form.trigger('submit');
    equal($('.unhappy').length, 1);
    equal($('.unhappyMessage').length, 1);
    
    $('#p2').val('test');
    form.trigger('submit');
    equal($('.unhappy').length, 0);
    equal($('.unhappyMessage').length, 0);
});