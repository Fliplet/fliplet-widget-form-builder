Fliplet.FormBuilder.field('url', {
  name: 'URL input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    }
  },
  validations: function() {
    var rules = {
      value: {
        // URL regex taken form https://www.regextester.com/94502 and added % sign
        url: window.validators.helpers.regex('', /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@%!\$&'\*\+,;=.]+$/i)
      }
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  }
});
