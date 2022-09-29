Fliplet.FormBuilder.field('input', {
  name: 'Text input',
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
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  }
});
