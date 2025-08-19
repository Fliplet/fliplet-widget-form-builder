/**
 * A single-select radio button component that allows users to choose one option from a list.
 *
 * @property {string} [description] - Optional description text displayed above the radio buttons
 * @property {Array<Object>} options - Array of option objects with label and optional id properties
 * @property {string} options[].label - Display text for the radio option
 * @property {string} [options[].id] - Unique identifier for the option (optional, falls back to label)
 * @property {boolean} [required=false] - Whether the field is required for form submission
 * @property {boolean} [readonly=false] - Whether the field is read-only and cannot be modified
 * @property {string} value - The currently selected option value (id or label)
 *
 */
Fliplet.FormBuilder.field('radio', {
  name: 'Radios (single-select)',
  category: 'Multiple options',
  props: {
    description: {
      type: String
    },
    options: {
      type: Array,
      default: function() {
        return [
          {
            label: 'Option 1'
          },
          {
            label: 'Option 2'
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

      if (index > this.options.length - 1) {
        newIndex = 0;
      } else if (index < 0) {
        newIndex = this.options.length - 1;
      }

      this.$refs.radioButton[newIndex].focus();
      this.clickHandler(this.options[newIndex]);
    }
  },
  created: function() {
    var $vm = this;

    var selectedOption = $vm.options.find(function(option) {
      return (Fliplet.FormBuilderUtils.has(option, 'label') && Fliplet.FormBuilderUtils.has(option, 'id')) ? option.id === $vm.value : option.label === $vm.value;
    });

    this.value = selectedOption ? this.value : '';
  }
});
