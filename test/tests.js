/*global $, test, equal, happy, ok, equals*/
module('Tiny Validator');

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

test('check basic required', function () {
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

test('check setting required with "required" attribute', function () {
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


test('check email', function () {
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


test('test password match', function () {
    var form = fixture('<input type="password1" id="p1" /><input type="password2" id="p2" />');

    form.isHappy({
        fields: {
            '#p1': {
                required: true,
                message: 'Please enter a new password',
                test: function (val1, val2) {
                    return (val1 === val2);
                },
                arg: function () {
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

test('test trimming fields', function () {
    var form = fixture('<input type="text" id="textInput1" />' +
                        '<input type="text" id="textInput2" />' +
                        '<input type="text" id="textInput3" />' +
                        '<input type="password" id="passwordInput" />');

    form.isHappy({
        fields: {
            '#textInput1': {
                trim: false
            },
            '#textInput2': {
                trim: true
            },
            '#textInput3': {
                message: 'Please enter an email'
            },
            '#passwordInput': {
                message: 'Please enter a password'
            }
        },
        testMode: true
    });

    $('#textInput1').val('  a  ');
    $('#textInput2').val('  b  ');
    $('#textInput3').val('  c  ');
    $('#passwordInput').val('  password  ');
    form.trigger('submit');
    equal($('#textInput1').val(), '  a  ');
    equal($('#textInput2').val(), 'b');
    equal($('#textInput3').val(), 'c');
    equal($('#passwordInput').val(), '  password  ');
});

test('test passed in "clean" method', function () {
    var form = fixture('<input type="text" id="textInput1" />');

    form.isHappy({
        fields: {
            '#textInput1': {
                message: 'Please enter an email',
                clean: function (val) {
                    return val.replace("a", "b");
                }
            }
        },
        testMode: true
    });


    $('#textInput1').val('  a  ');
    form.trigger('submit');
    equal($('#textInput1').val(), '  b  ');
});

test('test passing "sometimes" to required', function () {
    var form = fixture('<input type="text" id="textInput1" />'),
    testFlag = false;

    form.isHappy({
        fields: {
            '#textInput1': {
                message: 'Please enter an email',
                required: 'sometimes',
                test: function (val) {
                    return testFlag;
                }
            }
        },
        testMode: true
    });

    form.trigger('submit');
    equal($('.unhappy').length, 1);
    testFlag = true;
    form.trigger('submit');
    equal($('.unhappy').length, 0);
});

test('test required fields should only be tested on submit', function () {
    var form = fixture('<input type="text" id="textInput1" />');

    form.isHappy({
        fields: {
            '#textInput1': {
                message: 'test',
                required: true
            }
        },
        testMode: true
    });

    $('#textInput1').trigger('blur');
    equal($('.unhappy').length, 0);
    form.trigger('submit');
    equal($('.unhappy').length, 1);
});

test('test non-required fields still tested on blur', function () {
    var form = fixture('<input type="text" id="textInput1" />');

    form.isHappy({
        fields: {
            '#textInput1': {
                message: 'test',
                test: happy.email
            }
        },
        testMode: true
    });

    $('#textInput1').val('h@h').trigger('blur');
    equal($('.unhappy').length, 1);
    form.trigger('submit');
    equal($('.unhappy').length, 1);
});

test('test unHappy callback', function () {
    var form = fixture('<input type="text" id="textInput1" required />'),
    myFlag = false;

    form.isHappy({
        fields: {
            '#textInput1': {
                message: 'not happy dude'
            }
        },
        testMode: true,
        unHappy: function () {
            myFlag = true;
        }
    });

    form.trigger('submit');
    ok(myFlag);
    myFlag = false;
    $('#textInput1').val('test');
    form.trigger('submit');
    equals(myFlag, false);
});

test('test happy callback', function () {
    var form = fixture('<input type="text" id="textInput1" required />'),
    myFlag = false;

    form.isHappy({
        fields: {
            '#textInput1': {
                message: 'not happy dude'
            }
        },
        testMode: true,
        happy: function () {
            myFlag = true;
        }
    });

    form.trigger('submit');
    equals(myFlag, false);
    $('#textInput1').val('test');
    form.trigger('submit');
    ok(myFlag);
});

test('test included email validator', function () {
    var happyEmails = [
        'henrik@andyet.net',
        'h.joreteg@gmail.com',
        '23423.24.2.2342@test.test',
        '2.3.2.4.a.a.a.ffasaf.a@aol.com'
    ],
    sadEmails = [
        '.henrik@andyet.net',
        'henrik.@andyet.net',
        'test@test.afcom.com.',
        'h@.h',
        'a@a'
    ],
    i;

    for (i = 0; i < happyEmails.length; i++) {
        ok(happy.email(happyEmails[i]));
    }

    for (i = 0; i < sadEmails.length; i++) {
        ok(!happy.email(sadEmails[i]));
    }
});

test('test included date validator', function () {
    var happyDates = [
        '12/29/1982',
        '11/02/2099'
    ],
    sadDates = [
        '123/24/1999',
        '13/31/2099',
        '12/32/2099',
        '1/31/2999'
    ],
    i;

    for (i = 0; i < happyDates.length; i++) {
        ok(happy.date(happyDates[i]));
    }

    for (i = 0; i < sadDates.length; i++) {
        ok(!happy.date(sadDates[i]));
    }
});

test('test included phone validator', function () {
    var happyPhones = [
        '909-765-3941',
        '(909) 234-2343',
        '9999999999',
        '(909)234-2343',
    ],
    sadPhones = [
        '12-123-22311',
        'asdfasdf',
        '123-123-12344'
    ],
    i;

    for (i = 0; i < happyPhones.length; i++) {
        ok(happy.USPhone(happyPhones[i]));
    }

    for (i = 0; i < sadPhones.length; i++) {
        ok(!happy.USPhone(sadPhones[i]));
    }
});

test('check return value', function () {
    var form = fixture('');
    equal(form.isHappy({fields: {}}), form);
});

test('test message is empty string when not explicitly set', function () {
    var form = fixture('<input type="text" id="textInput1" />');

    form.isHappy({
        fields: {
            '#textInput1': {
                required: true,
            }
        },
        testMode: true
    });

    form.trigger('submit');
    equal($('.unhappyMessage').first().text(), '');
});

test('custom error template', function () {
    var form = fixture('<input type="text" id="textInput1" />');

    var myTemplate = function (error) {
        return $('<span id="' + error.id + '" class="customUnhappy">custom ' + error.message + '</span>');
    };

    form.isHappy({
        fields: {
            '#textInput1': {
                required: true,
            }
        },
        testMode: true,
        errorTemplate: myTemplate
    });

    form.trigger('submit');
    equal($('.customUnhappy').length, 1);

});

test ('error target', function () {

    var form = fixture('<p id="customError"><input type="text" id="textInput" /></p>');

    form.isHappy({
        fields: {
            '#textInput': {
                required: true,
                message: 'nope',
                errorTarget: '#customError'
            }
        },
        testMode: true
    });

    form.trigger('submit');
    equal($('#customError').length, 1); //Didn't insert after input
    equal($($('form').children()[1]).text(), 'nope'); //Inserted after <p>

});

test('test config item when to be set on all fields', function () {
    var form = fixture('<input type="text" id="textInput1" />');
    var test1ran = false;

    form.isHappy({
        fields: {
            '#textInput1': {
                test: function () {
                    test1ran = true;
                    return true;
                }
            }
        },
        when: 'keyup',
        testMode: true
    });

    $('#textInput1').val('asdf').trigger('blur');
    equal(test1ran, false);
    $('#textInput1').val('asdf').trigger('keyup');
    equal(test1ran, true);
});

test('test config item when to be set on a unique field', function () {
    var form = fixture('<input type="text" id="textInput1" /><input type="text" id="textInput2" />');
    var test1ran = false;
    var test2ran = false;

    form.isHappy({
        fields: {
            '#textInput1': {
                test: function () {
                    test1ran = true;
                    return true;
                }
            },
            '#textInput2': {
                test: function () {
                    test2ran = true;
                    return true;
                },
                when: 'keyup'
            }
        },
        testMode: true
    });

    $('#textInput1').val('asdf').trigger('keyup');
    equal(test1ran, false);
    $('#textInput1').val('asdf').trigger('blur');
    equal(test1ran, true);
    $('#textInput2').val('asdf').trigger('keyup');
    equal(test2ran, true);

});

test('test custom classes', function () {
    var form = fixture('<input type="text" id="textInput1" />');
    form.isHappy({
        fields: {
            '#textInput1': {
                required: true
            },
        },
        classes: {
            field: 'error',
            message: 'errorMsg'
        },
        testMode: true
    });

    form.submit();
    equal($('#textInput1').attr('class'), 'error');
    equal($('#textInput1_unhappy').attr('class'), 'errorMsg');

    $('#textInput1').val('asdf');
    form.submit();
    equal($('#textInput1').attr('class'), '');
});

test('checkbox values aren\'t clobbered', function () {
    var form = fixture('<input class="answer" id="valueA" type="checkbox" name="answer" value="a"/><input class="answer" id="valueB" type="checkbox" name="answer" value="b"/>');

    form.isHappy({
        fields: {
            '.answer': {
                required: true
            }
        },
        testMode: true
    });

    form.submit();
    equal($('#valueA').attr('value'), 'a');
    equal($('#valueB').attr('value'), 'b');
});
