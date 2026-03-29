/**
 * Select field component – renders a dropdown selection input in forms.
 * Supports custom options, data source integration, and multiple selection modes.
 */
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
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  mounted: function() {
    const $vm = this;

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
    const rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  methods: {
    isNumber: Fliplet.FormBuilderUtils.isNumber,
    isString: Fliplet.FormBuilderUtils.isString,
    onReset: function(data) {
      if (!data || data.id !== this.$parent.id) {
        return;
      }

      if (this.defaultValueSource !== 'default') {
        this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
      }
    }
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});
