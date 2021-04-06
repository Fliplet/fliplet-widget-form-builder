Fliplet.FormBuilder.field('radio', {
  name: 'Radios (single-select)',
  category: 'Multiple options',
  props: {
    description: {
      type: String
    },
    options: {
      type: Array,
      default: [
        {
          label: 'Option 1'
        },
        {
          label: 'Option 2'
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
  },
  methods: {
    clickHandler: function(option) {
      this.value = option.id || option.label;
      this.updateValue();
    },
    focusHandler: function(index) {
      var newIndex = index;

      if (index > this.options.length - 1) {
        newIndex = 0;
      } else if (index < 0) {
        newIndex = this.options.length - 1;
      }

      this.$refs.radioButton[newIndex].focus();
      this.clickHandler(this.options[newIndex]);
    }
  }
});
