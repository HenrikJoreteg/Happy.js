#Happy.js – are your forms happy? Just ask 'em!
##$('form').isHappy()

Happy.js is a lightweight form validation plugin for jQuery and Zepto.js. 

Beware that this is an early iteration, release early, right?!? Having said that, the basics should be fairly solid, given that I've got a few unit tests.

##Why Happy.js?
Yes, there a million form validation plugins already – but I like this approach and the good news is, if you don't, you have other options. In fact, if you want something really full-featured for jQuery. Use [this one](http://bassistance.de/jquery-plugins/jquery-plugin-validation/). Personally I wanted something really lightweight and extendable (because it's hard to be happy when you're bloated).

##How does it work?
Why, I'm glad you asked! I'll answer with some html and javascript:

    <!doctype html>
    <html>
      <head>
        <title>Demo</title>
        <script src="jquery.or.zepto.js"></script>
        <script src="happy.js"></script>
        <script src="happy.mytrimmedlistofmethods.js"></script>
        <script>
          $(document).ready(function () {
            $('#awesomeForm').isHappy({
              fields: {
                // reference the field you're talking about, probably by `id`
                // but you could certainly do $('[name=name]') as well.
                '#yourName': {
                  required: true,
                  message: 'Might we inquire your name'
                },
                '#email': {
                  required: true,
                  message: 'How are we to reach you sans email??'
                  test: happy.email // this can be *any* function that returns true or false
                }
              }
            });
          }); 
        </script>
      </head>
      <body>
        <form id="awesomeForm" action="/lights/camera" method="post">
          <input id="yourName" type="text" name="name" />
          <input id="email" type="text" name="email" />
        </form>
      </body>
    </html>

That's it. Happy.js will now validate individual fields on `blur` events and all fields on `submit`. If validation fails two things happen:

1. The field will get an `unhappy` class (yes, I'm quite serious).
2. The field will get a `<span>` right before it, in the DOM with a class of `unhappyMessage` and an `id` of whatever the field's `id` is plus `_unhappy`. For example `<span id=​"textInput1_unhappy" class=​"unhappyMessage">​Please enter an email​</span>`.

So all you have to do is list our your fields and any arbitrary test function for each. There are a few example validation functions built in. If you use `underscore.js` I'd suggest mixing in your validation functions into underscore like this: https://gist.github.com/641397.

##Options
Each field takes the following attributes all optional.

1. **required** (boolean): self-explanatory
2. **message** (string): message shown in case of an error for this field.
3. **test** (function): a function that takes the field value as the first argument and returns `true` or `false`.
4. **arg** (anything): an optional second argument that will get passed to the `test` function. This is useful for comparing with another paramter or whatnot. If this is a function it will be evaluated. This way you can compare it to something that is evaluated at runtime such as what they put in another field or to make a server call to check if a username is available, etc.

##Changelog
Just getting started, I'm not even gonna give it a version number yet.