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
  data: function() {
    return {
      rules: {
        // URL regex taken form https://www.regextester.com/94502 and added % sign
        urlCase: new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@%!\$&'\*\+,;=.]+$/i)
      }
    };
  },
  validations: function() {
    var rules = {
      value: {
        url: function(value) {
          // Normalize()ing to NFD Unicode normal form decomposes combined graphemes into the combination of simple ones using a regex character class to match the U+0300 → U+036F range
          value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          return value ? this.rules.urlCase.test(value) : true;
        }
      }
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  }
});
