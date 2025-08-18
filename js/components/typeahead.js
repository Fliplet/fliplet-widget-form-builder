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
    var rules = {
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
    /**
     * Handle typeahead focus
     * @returns {void}
     */
    onTypeaheadFocus: function() {
      if (this.readonly) {
        this.announceStatus('Typeahead is disabled in read-only mode', 2000);

        return;
      }

      const instructions = `Typeahead focused. ${this.freeInput ? 'You can type custom values or ' : ''}Select from available options. ${this.maxItems ? `Maximum ${this.maxItems} items allowed.` : ''}`;

      this.announceStatus(instructions, 4000);
    },

    /**
     * Handle typeahead blur
     * @returns {void}
     */
    onTypeaheadBlur: function() {
      if (this.value && this.value.length > 0) {
        this.announceStatus(`Selected ${this.value.length} item${this.value.length !== 1 ? 's' : ''}`, 2000);
      }
    },


    initTypeahead: function() {
      var $vm = this;

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

        // Announce selection change
        if (value && value.length > 0) {
          $vm.announceStatus(`Selected ${value.length} item${value.length !== 1 ? 's' : ''}`, 2000);
        } else {
          $vm.announceStatus('Selection cleared', 1500);
        }
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
