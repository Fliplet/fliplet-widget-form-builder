Fliplet.FormBuilder.field('radio', {
  name: 'Radios (single-select)',
  category: 'Multiple options',
  props: {
    description: {
      type: String
    },
    optionsWithDescription: {
      type: Array,
      default: function() {
        return [
          {
            label: 'Option 1',
            description: '',
            _iteration_key: Fliplet.guid()
          }
        ];
      }
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
    clickHandler: function(option) {
      this.value = option.id || option.label;
      this.updateValue();
    },
    focusHandler: function(index) {
      var newIndex = index;

      if (index > this.optionsWithDescription.length - 1) {
        newIndex = 0;
      } else if (index < 0) {
        newIndex = this.optionsWithDescription.length - 1;
      }

      this.$refs.radioButton[newIndex].focus();
      this.clickHandler(this.optionsWithDescription[newIndex]);
    }
  },
  created: function() {
    var $vm = this;

    var selectedOption = _.find($vm.options, function(option) {
      return (_.has(option, 'label') && _.has(option, 'id')) ? option.id === $vm.value : option.label === $vm.value;
    });

    this.value = selectedOption ? this.value : '';
  }
});
