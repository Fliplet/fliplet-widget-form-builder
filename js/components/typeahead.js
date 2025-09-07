/**
 * This component renders a typeahead (autocomplete) input that supports multi-selection.
 * Options can be configured manually or fetched from a data source.
 */
Fliplet.FormBuilder.field('typeahead', {
  name: 'Typeahead (multi-select)',
  category: 'Multiple options',
  props: {
    value: {
      type: Array
    },
    defaultValue: {
      type: String,
      default: ''
    },
    description: {
      type: String
    },
    placeholder: {
      type: String
    },
    optionsType: {
      type: String,
      default: 'dataSource'
    },
    maxItems: {
      type: Number,
      default: null
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
    freeInput: {
      type: Boolean,
      default: false
    },
    dataSourceId: {
      type: Number
    },
    column: {
      type: String
    },
    columnOptions: {
      type: Array,
      default: null
    }
  },
  data: function() {
    return {
      typeahead: null
    };
  },
  computed: {
    reachedMaxItems: function() {
      return this.value && this.value.length === this.maxItems;
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
  created: function() {
    if (!!this.defaultValue && this.optionsType === 'manual') {
      this.value = this.defaultValue.split(/\n/);
      this.updateValue(this.name, this.value);
    } else if (!Array.isArray(this.value) && this.optionsType === 'manual') {
      this.value = [];
      this.updateValue(this.name, this.value);
    }

    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  mounted: function() {
    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({
        source: this.defaultValueSource,
        key: this.defaultValueKey
      });
    }

    this.initTypeahead();

    this.$emit('_input', this.name, this.value, false, true);
  },
  methods: {
    initTypeahead: function() {
      const $vm = this;

      if (this.typeahead && !this.$refs.typeahead) {
        return;
      }

      this.typeahead = Fliplet.UI.Typeahead(this.$refs.typeahead, {
        readonly: this.readonly,
        value: this.value,
        options: this.options,
        freeInput: this.freeInput,
        maxItems: this.maxItems,
        placeholder: this.placeholder,
        order: this.optionsType === 'dataSource' ? 'asc' : null
      });

      this.typeahead.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    },
    onBeforeSubmit: function() {
      this.value = this.typeahead.get();
    }
  },
  watch: {
    value: function(val) {
      if (this.maxItems && val.length > this.maxItems) {
        val = val.slice(0, this.maxItems);
      }

      if (this.typeahead) {
        this.typeahead.set(val);
      }

      this.$emit('_input', this.name, val);
    },
    options: function(val) {
      if (this.typeahead) {
        this.typeahead.options(val);
      }

      this.typeahead.set(this.value);
    }
  }
});
