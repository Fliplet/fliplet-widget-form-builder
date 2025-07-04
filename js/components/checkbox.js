/**
 * Checkbox field component – renders multiple checkbox options in forms.
 * Supports multi-select functionality and "select all" option.
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
        var ordered = this.sortBy(this.value, function(val) {
          return $vm.options.findIndex(function(option) {
            return (option.id || option.label) === val;
          });
        });

        // Get all options label in array format
        var allOptions = this.options.map(function(option) {
          return option.id || option.label;
        });

        this.selectedAll = this.isEqual(ordered, allOptions);
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

        if (!this.isEqual(oldValue, this.value)) {
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
    /**
     * Sorts an array based on iteratee function results
     * @param {Array} array - array to sort
     * @param {Function} iteratee - function to determine sort value
     * @returns {Array} sorted array
     */
    sortBy: function(array, iteratee) {
      return array.slice().sort(function(a, b) {
        var valueA = iteratee(a);
        var valueB = iteratee(b);

        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;

        return 0;
      });
    },

    /**
     * Performs deep equality comparison
     * @param {*} a - first value
     * @param {*} b - second value
     * @returns {Boolean} true if equal
     */
    isEqual: function(a, b) {
      if (a === b) return true;
      if (a === null || b === null) return false;

      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; i++) {
          if (!this.isEqual(a[i], b[i])) return false;
        }

        return true;
      }

      if (typeof a === 'object' && typeof b === 'object') {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (var key of keysA) {
          if (!Object.prototype.hasOwnProperty.call(b, key) || !this.isEqual(a[key], b[key])) return false;
        }

        return true;
      }

      return false;
    },

    /**
     * Creates unique array using comparator function
     * @param {Array} array - array to make unique
     * @param {Function} comparator - function to compare elements
     * @returns {Array} unique array
     */
    uniqueWith: function(array, comparator) {
      var result = [];
      var $vm = this;

      array.forEach(function(item) {
        var isDuplicate = result.some(function(existing) {
          return comparator.call($vm, item, existing);
        });

        if (!isDuplicate) {
          result.push(item);
        }
      });

      return result;
    },

    updateValue: function() {
      var $vm = this;

      // Sort selected options by their index as a checkbox input option
      var ordered = this.sortBy(this.value, function(val) {
        return $vm.options.findIndex(function(option) {
          return (option.label || option.id) === val;
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
          return (Object.prototype.hasOwnProperty.call(option, 'label') && Object.prototype.hasOwnProperty.call(option, 'id')) ? option.id === value : option.label === value;
        });

        if (selectedOption) {
          selectedOptions.push(selectedOption);
        }
      });

      this.value = selectedOptions.length ? this.uniqueWith(this.value, this.isEqual) : [];
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
