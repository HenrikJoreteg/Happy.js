/*global $*/
(function ($) {
    function trim(el) {
        return (''.trim) ? el.val().trim() : $.trim(el.val());
    }
    $.fn.isHappy = function (config) {
        var fields = [], item;

        function isFunction(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        }
        function defaultError(error) { //Default error template
            return $('<span id="' + error.id + '" class="unhappyMessage" role="alert">' + error.message + '</span>');
        }
        function getError(error) { //Generate error html from either config or default
            if (isFunction(config.errorTemplate)) {
                return config.errorTemplate(error);
            }
            return defaultError(error);
        }
        function handleSubmit() {
            var errors = false, i, l;
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
        function processField(opts, selector) {
            var field = $(selector),
            error = {
                message: opts.message || '',
                id: selector.slice(1) + '_unhappy'
            },
            errorEl = $(error.id).length > 0 ? $(error.id) : getError(error);

            fields.push(field);
            field.testValid = function (submit) {
                var val,
                el = $(this),
                gotFunc,
                error = false,
                temp,
                required = !!el.get(0).attributes.getNamedItem('required') || opts.required,
                password = (field.attr('type') === 'password'),
                arg = isFunction(opts.arg) ? opts.arg() : opts.arg;

                // clean it or trim it
                if (isFunction(opts.clean)) {
                    val = opts.clean(el.val());
                } else if (!opts.trim && !password) {
                    val = trim(el);
                } else {
                    val = el.val();
                }

                // write it back to the field
                el.val(val);

                // get the value
                gotFunc = ((val.length > 0 || required === 'sometimes') && isFunction(opts.test));

                // check if we've got an error on our hands
                if (submit === true && required === true && val.length === 0) {
                    error = true;
                } else if (gotFunc) {
                    error = !opts.test(val, arg);
                }

                if (error) {
                    el.addClass('unhappy').after(errorEl);
                    return false;
                } else {
                    temp = errorEl.get(0);
                    // this is for zepto
                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                    el.removeClass('unhappy');
                    return true;
                }
            };
            field.bind(config.when || 'blur', field.testValid);
        }

        for (item in config.fields) {
            processField(config.fields[item], item);
        }

        if (config.submitButton) {
            $(config.submitButton).click(handleSubmit);
        } else {
            this.bind('submit', handleSubmit);
        }
        return this;
    };
})(this.jQuery || this.Zepto);
