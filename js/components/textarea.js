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

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  methods: {
    replaceNewLines: function(value) {
      return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  }
});
