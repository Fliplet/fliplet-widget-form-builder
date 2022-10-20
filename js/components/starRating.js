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

    if (this.required && !this.readonly) {
      rules.value.required = function(value) {
        if (value !== 'undefined' && value >= 0) {
          return value;
        }
      }
    }

    return rules;
  },
  methods: {
    increaseRatingValue: function() {
      if (this.value < 5) {
        this.value = +this.value + 1;
        this.updateValue();
      }
    },
    decreaseRatingValue: function() {
      if (this.value > 0) {
        this.value = +this.value - 1;
        this.updateValue();
      }
    }
  }
});
