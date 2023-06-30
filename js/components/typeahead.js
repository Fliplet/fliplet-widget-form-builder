Fliplet.FormBuilder.field('typeahead', {
  name: 'Typeahead (multi-select)',
  category: 'Multiple options',
  props: {
    value: {
      type: Array,
      default: null
    },
    description: {
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
      if (this.typeahead && !this.$refs.typeahead) {
        return;
      }

      this.typeahead = Fliplet.UI.Typeahead(this.$refs.typeahead, {
        value: this.value,
        options: this.options,
        freeInput: this.freeInput,
        maxItems: this.maxItems
      });
    },
    onBeforeSubmit: function() {
      this.typeahead.get();
    }
  }
});
