(function($){
  function trim(el) {
    el.val((''.trim) ? el.val().trim() : $.trim(el.val()));
  }
  $.fn.isHappy = function (config) {
    var fields = [],
      item;
    
    function getError(error) {
      return $('<span id="'+error.id+'" class="unhappyMessage">'+error.message+'</span>');
    }
    function handleSubmit() {
      var errors = false,
        i,
        l;
      for (i = 0, l = fields.length; i < l; i += 1) {
        if (fields[i].testValid()) {
          errors = true;
        }
      }
      if (errors) {
        return false;
      } else if (config.testMode) {
        //console.warn('would have submitted');
        return false;
      }
    }
    function isFunction (obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }
    function processField(opts, selector) {
      var field = $(selector),
        error = {
          message: opts.message,
          id: selector.slice(1) + '_unhappy'
        },
        errorEl = $(error.id).length > 0 ? $(error.id) : getError(error);
        
      fields.push(field);
      field.testValid = function () {
        var val,
          el = $(this),
          gotFunc,
          error = false,
          temp;
        
        trim(el);
        val = el.val();
        //console.log('val', val);
        gotFunc = (val.length > 0 && isFunction(opts.test));
        
        //console.log('gotFunc', gotFunc);
        
        // check if we've got an error on our hands
        if (opts.required && val.length === 0) {
          //console.log('required but has no value', el);
          error = true;
        } else if (gotFunc && opts.hasOwnProperty('arg')) {
          //console.log('got an argument thats a func');
          error = isFunction(opts.arg) ? opts.test(val, opts.arg()) : opts.test(val, opts.arg);
        } else if (gotFunc && !opts.test(val)) {
          //console.log('got a simple test with no args');
          error = true;
        } else {
          //console.log('no error', el);
        }
        
        if (error) {
          el.addClass('unhappy').before(errorEl);
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
  }
})(this.jQuery || this.Zepto);