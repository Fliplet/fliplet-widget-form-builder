Fliplet.FormBuilder.field('textarea', {
  name: 'Multiple line input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    rows: {
      type: Number,
      default: 2
    },
    description: {
      type: String
    }
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }

    return rules;
  }
});
