Fliplet.FormBuilder.field('telephone', {
  name: 'Telephone input',
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
        phone: window.validators.helpers.regex('', /^[0-9;,.()\-+\s*#]+$/)
      }
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  }
});
