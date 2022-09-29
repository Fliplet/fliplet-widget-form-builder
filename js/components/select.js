Fliplet.FormBuilder.field('select', {
  name: 'Dropdown (single-select)',
  category: 'Multiple options',
  props: {
    options: {
      type: Array,
      default: function() {
        return [
          {
            label: T('widgets.form.select.defaultOptions.option1')
          },
          {
            label: T('widgets.form.select.defaultOptions.option2')
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
        return '-- ' + T('widgets.form.select.placeholder');
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

    if (this.defaultValueSource !== 'default') {
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
