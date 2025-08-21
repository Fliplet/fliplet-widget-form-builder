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
    /**
     * Check if an option is selected
     * @param {Object} option - The option to check
     * @returns {Boolean} whether the option is selected
     */
    isOptionSelected: function(option) {
      return this.value === (option.id || option.label);
    },

    /**
     * Handle option selection
     * @param {Object} option - The selected option
     * @returns {void}
     */
    clickHandler: function(option) {
      this.value = option.id || option.label;
      this.updateValue();

      // Announce selection
      this.announceAction(`Selected: ${option.label || option.id}`, 2000);
    },

    /**
     * Handle focus navigation between radio options
     * @param {Number} index - The target index
     * @returns {void}
     */
    focusHandler: function(index) {
      var newIndex = index;

      if (index > this.options.length - 1) {
        newIndex = 0;
      } else if (index < 0) {
        newIndex = this.options.length - 1;
      }

      this.$refs.radioButton[newIndex].focus();
      this.clickHandler(this.options[newIndex]);

      const option = this.options[newIndex];

      this.announceStatus(`Navigated to: ${option.label || option.id}`, 1500);
    },

    /**
     * Handle focus events
     * @param {Number} index - The focused option index
     * @returns {void}
     */
    onFocus: function(index) {
      this.isFocused = true;

      const option = this.options[index];
      const instructions = this.readonly
        ? 'Radio options are disabled in read-only mode'
        : `Option ${index + 1} of ${this.options.length}: ${option.label || option.id}. Use arrow keys to navigate, Space or Enter to select.`;

      this.announceStatus(instructions, 3000);
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
