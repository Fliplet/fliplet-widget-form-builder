/**
 * Checkbox field component.
 *
 * @component checkbox
 * @category Multiple options
 * @description Renders a list of checkboxes with optional “Select all”.
 * @prop {Array}   value        Selected option values
 * @prop {String}  defaultValue Initial value(s) separated by newline
 * @prop {Array}   options      Array<{label,id}>
 * @prop {Boolean} addSelectAll Show a “Select all” checkbox
 */
Fliplet.FormBuilder.field('checkbox', {
  name: 'Checkboxes (multi-select)',
  category: 'Multiple options',
  props: {
    value: {
      type: Array,
      default: []
    },
    defaultValue: {
      type: String,
      default: ''
    },
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
    },
    addSelectAll: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      selectedAll: false
    };
  },
  watch: {
    value: {
      handler: function() {
        if (!this.addSelectAll) {
          return;
        }

        var $vm = this;

        // Sort selected options by their index as a checkbox input option
        var ordered = Fliplet.FormBuilderUtils.sortBy(this.value, function(val) {
          return $vm.options.findIndex(function(option) {
            return (option.id || option.label) === val;
          });
        });

        // Get all options label in array format
        var allOptions = this.options.map(function(option) {
          return option.id || option.label;
        });

        this.selectedAll = Fliplet.FormBuilderUtils.isEqual(ordered, allOptions);
      }
    },
    selectedAll: {
      handler: function(val) {
        if (!this.addSelectAll) {
          return;
        }

        var $vm = this;
        var oldValue = this.value;

        if (val) {
          this.value = [];

          this.options.forEach(function(option) {
            $vm.value.push(option.id || option.label);
          });
        } else if (this.value.length === this.options.length) {
          this.value = [];
        }

        if (!Fliplet.FormBuilderUtils.isEqual(oldValue, this.value)) {
          this.updateValue();
        }
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
    updateValue: function() {
      var $vm = this;

      // Sort selected options by their index as a checkbox input option
      var ordered = Fliplet.FormBuilderUtils.sortBy(this.value, function(val) {
        return $vm.options.findIndex(function(option) {
          return (option.id || option.label) === val;
        });
      });

      this.highlightError();

      this.$emit('_input', this.name, ordered);
    },
    clickHandler: function(option) {
      var val = option.id || option.label;
      var index = this.value.indexOf(val);

      if (index === -1) {
        this.value.push(val);
      } else {
        this.value.splice(index, 1);
      }

      this.updateValue();
    },
    selectAllClickHandler: function() {
      this.selectedAll = !this.selectedAll;
    },
    onReset: function(data) {
      if (!data || data.id !== this.$parent.id) {
        return;
      }

      if (this.defaultValueSource === 'default' && this.defaultValue === '') {
        this.value = [];
        this.updateValue(this.name, this.value);
      }
    }
  },
  created: function() {
    var $vm = this;

    if (this.value.length > 0) {
      var selectedOptions = [];

      this.value.forEach(function(value) {
        var selectedOption = $vm.options.find(function(option) {
          return (Fliplet.FormBuilderUtils.has(option, 'label') && Fliplet.FormBuilderUtils.has(option, 'id')) ? option.id === value : option.label === value;
        });

        if (selectedOption) {
          selectedOptions.push(selectedOption);
        }
      });

      this.value = selectedOptions.length ? Array.from(new Set(this.value)) : [];
    }

    if (!!this.defaultValue) {
      this.value = this.defaultValue.split(/\n/);
      this.updateValue(this.name, this.value);
    } else if (!Array.isArray(this.value)) {
      this.value = [];
      this.updateValue(this.name, this.value);
    }

    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});
