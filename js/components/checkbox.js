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
            label: T('widgets.form.checkbox.defaultOptions.option1')
          },
          {
            label: T('widgets.form.checkbox.defaultOptions.option2')
          }
        ];
      }
    },
    isSelectAll: {
      type: Array,
      default: function() {
        return [
          {
            label: T('widgets.form.checkbox.isSelectAll.isSelectAll')
          }
        ];
      }
    },
    checkValue: {
      type: Array,
      default: []
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
    updateValue: function() {
      var $vm = this;

      // Sort selected options by their index as a checkbox input option
      var ordered = _.sortBy(this.value, function(val) {
        return _.findIndex($vm.options, function(option) {
          return (option.label || option.id) === val;
        });
      });
      this.highlightError();

      this.$emit('_input', this.name, ordered);
    },
    updateCheckValue: function() {
      var $vm = this;
      var index = $vm.checkValue.indexOf('Select All');

      if (index === -1) {
        $vm.checkValue.push('Select All');
      } else {
        $vm.checkValue.splice(index, 1);
      }

      // Sort selected options by their index as a checkbox input option
      var ordered = _.sortBy($vm.checkValue, function(val) {
        return _.findIndex($vm.isSelectAll, function(option) {
          return (option.label) === val;
        });
      });

      this.highlightError();

      this.$emit('_input', $vm.name, ordered);
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
    checkAllHandler: function() {
      var $vm = this;

      $vm.updateCheckValue();
      $vm.value = [];

      if ($vm.checkValue.length > 0) {
        _.forEach(this.options, function(option) {
          var val = option.id || option.label;

          $vm.value.push(val);
        });
      }

      this.updateValue();
    }
  },
  created: function() {
    var $vm = this;
    
    if (this.value.length > 0) {
      var selectedOptions = [];

      this.value.forEach(function(value) {
        var selectedOption = _.find($vm.options, function(option) {
          return (_.has(option, 'label') && _.has(option, 'id')) ? option.id === value : option.label === value;
        });

        if (selectedOption) {
          selectedOptions.push(selectedOption);
        }
      });

      this.value = selectedOptions.length ? _.uniqWith(this.value, _.isEqual) : [];
    }

    if (this.checkValue.length > 0) {
      var selectedOptions = [];

      this.checkValue.forEach(function(value) {
        var selectedValueOption = _.find($vm.isSelectAll, function(option) {
          return (_.has(option, 'label') && _.has(option, 'id')) ? option.id === value : option.label === value;
        });

        if (selectedValueOption) {
          selectedValueOption.push(selectedValueOption);
        }
      });

      this.checkValue = selectedValueOption.length ? _.uniqWith(this.checkValue, _.isEqual) : [];
    }

    if (!!this.defaultValue) {
      this.value = this.defaultValue.split(/\n/);
      this.checkValue = this.defaultValue.split(/\n/);
      this.updateValue(this.name, this.value);
      this.updateValue(this.name, this.checkValue);
    } else if (!Array.isArray(this.value)) {
      this.value = [];
      this.updateValue(this.name, this.value);
    } else if (!Array.isArray(this.checkValue)) {
      this.checkValue = [];
      this.updateValue(this.name, this.checkValue);
    }
  }
});
