Fliplet.FormBuilder.field('codeScanner', {
  name: 'Code scanner',
  category: 'Advanced',
  props: {
    value: {
      type: String
    },
    description: {
      type: String
    },
    placeholder: {
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
