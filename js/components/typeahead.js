Fliplet.FormBuilder.field('typeahead', {
  name: 'Typeahead (multi-select)',
  category: 'Multiple options',
  props: {
    value: {
      type: Array,
      default: null
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
            id: '1',
            label: 'Option 1'
          },
          {
            id: '2',
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
    Fliplet.FormBuilder.on('reset', this.onReset);
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
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
      var $vm = this;

      if (this.typeahead && !this.$refs.typeahead) {
        return;
      }

      this.typeahead = Fliplet.UI.Typeahead(this.$refs.typeahead, {
        readonly: this.readonly,
        value: this.value,
        options: this.options,
        freeInput: this.freeInput,
        maxItems: this.maxItems
      });

      this.typeahead.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    },
    onBeforeSubmit: function() {
      this.typeahead.get();
    },
    onReset: function(data) {
      if (data.id === this.$parent.id) {
        if (this.defaultValueSource !== 'default') {
          this.setValueFromDefaultSettings({
            source: this.defaultValueSource,
            key: this.defaultValueKey
          });
        }

        this.typeahead.set(this.value);
      }
    }
  },
  watch: {
    value: function(val) {
      if (this.typeahead) {
        this.typeahead.set(val);
      }
    },
    options: function(val) {
      if (this.typeahead) {
        this.typeahead.options(val);
      }
    }
  }
});
