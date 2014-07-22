/*global $*/
(function happyJS($) {
    function trim(el) {
        return (''.trim) ? el.val().trim() : $.trim(el.val());
    }
    $.fn.isHappy = function isHappy(config) {
        var fields = [], item;
        var pauseMessages = false;

        function isFunction(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        }
        function defaultError(error) { //Default error template
            var msgErrorClass = config.classes && config.classes.message || 'unhappyMessage';
            return $('<span id="' + error.id + '" class="' + msgErrorClass + '" role="alert">' + error.message + '</span>');
        }
        function getError(error) { //Generate error html from either config or default
            if (isFunction(config.errorTemplate)) {
                return config.errorTemplate(error);
            }
            return defaultError(error);
        }
        function handleSubmit() {
            var  i, l;
            var errors = false;
            for (i = 0, l = fields.length; i < l; i += 1) {
                if (!fields[i].testValid(true)) {
                    errors = true;
                }
            }
            if (errors) {
                if (isFunction(config.unHappy)) config.unHappy();
                return false;
            } else if (config.testMode) {
                if (isFunction(config.happy)) config.happy();
                if (window.console) console.warn('would have submitted');
                return false;
            }
            if (isFunction(config.happy)) config.happy();
        }
        function handleMouseUp() {
            pauseMessages = false;
        }
        function handleMouseDown() {
            pauseMessages = true;
            $(window).bind('mouseup', handleMouseUp);
        }
        function processField(opts, selector) {
            var field = $(selector);
            var error = {
                message: opts.message || '',
                id: selector.slice(1) + '_unhappy'
            };
            var errorEl = $(error.id).length > 0 ? $(error.id) : getError(error);
            var handleBlur = function handleBlur() {
                if (!pauseMessages) {
                    field.testValid();
                } else {
                    $(window).bind('mouseup', field.testValid.bind(this));
                }
            };

            fields.push(field);
            field.testValid = function testValid(submit) {
                var val, gotFunc, temp;
                var el = $(this);
                var errorTarget = (opts.errorTarget && $(opts.errorTarget)) || el;
                var error = false;
                var required = !!el.get(0).attributes.getNamedItem('required') || opts.required;
                var password = (field.attr('type') === 'password');
                var arg = isFunction(opts.arg) ? opts.arg() : opts.arg;
                var fieldErrorClass = config.classes && config.classes.field || 'unhappy';

                // handle control groups (checkboxes, radio)
                if (el.length > 1) {
                  val = [];
                  el.each(function(i,obj) {
                    val.push($(obj).val());
                  });
                  val = val.join(',');
                } else {
                  // clean it or trim it
                  if (isFunction(opts.clean)) {
                      val = opts.clean(el.val());
                  } else if (!password && typeof opts.trim === 'undefined' || opts.trim) {
                      val = trim(el);
                  } else {
                      val = el.val();
                  }

                  // write it back to the field
                  el.val(val);
                }

                // get the value
                gotFunc = ((val.length > 0 || required === 'sometimes') && isFunction(opts.test));

                // check if we've got an error on our hands
                if (submit === true && required === true && val.length === 0) {
                    error = true;
                } else if (gotFunc) {
                    error = !opts.test(val, arg);
                }

                if (error) {
                    errorTarget.addClass(fieldErrorClass).after(errorEl);
                    return false;
                } else {
                    temp = errorEl.get(0);
                    // this is for zepto
                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                    errorTarget.removeClass(fieldErrorClass);
                    return true;
                }
            };
            field.bind(opts.when || config.when || 'blur', handleBlur);
        }

        for (item in config.fields) {
            processField(config.fields[item], item);
        }

        $(config.submitButton || this).bind('mousedown', handleMouseDown);

        if (config.submitButton) {
            $(config.submitButton).click(handleSubmit);
        } else {
            this.bind('submit', handleSubmit);
        }
        return this;
    };
})(this.jQuery || this.Zepto);
