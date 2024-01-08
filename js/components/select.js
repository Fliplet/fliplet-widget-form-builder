Fliplet.FormBuilder.field('select', {
  name: 'Dropdown (single-select)',
  category: 'Multiple options',
  props: {
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
    source: {
      type: String
    },
    placeholder: {
      type: String,
      default: function() {
        return '-- Select one';
      }
    },
    description: {
      type: String
    }
  },
  data: function() {
    return {
      isInputFocused: false
    };
  },
  mounted: function() {
    var $vm = this;

    if ($vm.source === 'dataSources') {
      Fliplet.DataSources.get().then(function(dataSources) {
        $vm.options = dataSources;
      });
    }

    if (this.defaultValueSource !== 'default' && this.defaultValueSource !== 'profile') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
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
  }
});
