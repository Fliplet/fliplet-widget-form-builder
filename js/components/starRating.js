Fliplet.FormBuilder.field('starRating', {
  name: 'Star rating',
  category: 'Advanced',
  props: {
    description: {
      type: String
    },
    values: {
      type: Array,
      default: [
        {
          id: '5'
        },
        {
          id: '4'
        },
        {
          id: '3'
        },
        {
          id: '2'
        },
        {
          id: '1'
        }
      ]
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
