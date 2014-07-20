// This adds 'placeholder' to the items listed in the jQuery .support object. 
jQuery(function() {
   jQuery.support.placeholder = false;
   test = document.createElement('input');
   if('placeholder' in test) jQuery.support.placeholder = true;
});

// Placeholder support, see https://github.com/mathiasbynens/jquery-placeholder
(function(e,t,n){function c(e){var t={};var r=/^jQuery\d+$/;n.each(e.attributes,function(e,n){if(n.specified&&!r.test(n.name)){t[n.name]=n.value}});return t}function h(e,t){var r=this;var i=n(r);if(r.value==i.attr("placeholder")&&i.hasClass("placeholder")){if(i.data("placeholder-password")){i=i.hide().next().show().attr("id",i.removeAttr("id").data("placeholder-id"));if(e===true){return i[0].value=t}i.focus()}else{r.value="";i.removeClass("placeholder");r==d()&&r.select()}}}function p(){var e;var t=this;var r=n(t);var i=this.id;if(t.value==""){if(t.type=="password"){if(!r.data("placeholder-textinput")){try{e=r.clone().attr({type:"text"})}catch(s){e=n("<input>").attr(n.extend(c(this),{type:"text"}))}e.removeAttr("name").data({"placeholder-password":r,"placeholder-id":i}).bind("focus.placeholder",h);r.data({"placeholder-textinput":e,"placeholder-id":i}).before(e)}r=r.removeAttr("id").hide().prev().attr("id",i).show()}r.addClass("placeholder");r[0].value=r.attr("placeholder")}else{r.removeClass("placeholder")}}function d(){try{return t.activeElement}catch(e){}}var r=Object.prototype.toString.call(e.operamini)=="[object OperaMini]";var i="placeholder"in t.createElement("input")&&!r;var s="placeholder"in t.createElement("textarea")&&!r;var o=n.fn;var u=n.valHooks;var a=n.propHooks;var f;var l;if(i&&s){l=o.placeholder=function(){return this};l.input=l.textarea=true}else{l=o.placeholder=function(){var e=this;e.filter((i?"textarea":":input")+"[placeholder]").not(".placeholder").bind({"focus.placeholder":h,"blur.placeholder":p}).data("placeholder-enabled",true).trigger("blur.placeholder");return e};l.input=i;l.textarea=s;f={get:function(e){var t=n(e);var r=t.data("placeholder-password");if(r){return r[0].value}return t.data("placeholder-enabled")&&t.hasClass("placeholder")?"":e.value},set:function(e,t){var r=n(e);var i=r.data("placeholder-password");if(i){return i[0].value=t}if(!r.data("placeholder-enabled")){return e.value=t}if(t==""){e.value=t;if(e!=d()){p.call(e)}}else if(r.hasClass("placeholder")){h.call(e,true,t)||(e.value=t)}else{e.value=t}return r}};if(!i){u.input=f;a.value=f}if(!s){u.textarea=f;a.value=f}n(function(){n(t).delegate("form","submit.placeholder",function(){var e=n(".placeholder",this).each(h);setTimeout(function(){e.each(p)},10)})});n(e).bind("beforeunload.placeholder",function(){n(".placeholder").each(function(){this.value=""})})}})(this,document,jQuery);
$('input, textarea').placeholder();

// Happy validation, see http://happyjs.com/
/*global $*/
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
                var error_target = (opts.error_target && $(opts.error_target)) || el;
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
                    error_target.addClass(fieldErrorClass).after(errorEl);
                    return false;
                } else {
                    temp = errorEl.get(0);
                    // this is for zepto
                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                    error_target.removeClass(fieldErrorClass);
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
