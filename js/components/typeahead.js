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
    var $vm = this;

    if (this.value && this.value.length > 0) {
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

    if (!!this.defaultValue) {
      this.value = this.defaultValue.split(/\n/);
      this.updateValue(this.name, this.value);
    } else if (!Array.isArray(this.value)) {
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
      this.value = this.typeahead.get();
    }
  },
  watch: {
    value: function(val) {
      if (this.typeahead) {
        this.typeahead.set(val);
      }

      this.$emit('_input', this.name, val);
    },
    options: function(val) {
      if (this.typeahead) {
        this.typeahead.options(val);
      }
    }
  }
});
