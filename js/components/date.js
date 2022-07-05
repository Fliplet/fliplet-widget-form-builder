Fliplet.FormBuilder.field('date', {
  name: 'Date picker',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    },
    autofill: {
      type: String,
      default: 'default'
    },
    defaultSource: {
      type: String,
      default: 'load'
    },
    empty: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      datePicker: null,
      isInputFocused: false,
      isPreview: Fliplet.Env.get('preview'),
      today: moment().locale('en').format('YYYY-MM-DD')
    };
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
  computed: {
    isApplyCurrentDateField: function() {
      return this.autofill === 'always' || this.autofill === 'default';
    },
    readonlyValue: function() {
      return this.value && moment(this.value).isValid()
        ? TD(this.value, { format: 'L' })
        : '';
    }
  },
  mounted: function() {
    this.initDatePicker();

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({
        source: this.defaultValueSource,
        key: this.defaultValueKey
      });
    }

    if ((!this.value && this.autofill === 'default') || this.autofill === 'always') {
      this.value = this.today;
      this.empty = false;
    }

    if (this.autofill === 'empty') {
      this.value = '';

      return;
    }

    this.$emit('_input', this.name, this.value, false, true);
    this.$v.$reset();
  },
  watch: {
    value: function(val) {
      if (val === '' &&  ['default', 'always'].indexOf(this.autofill) > -1 && (this.required || this.autofill === 'always')) {
        this.value = this.today;

        return;
      }

      if (this.datePicker) {
        this.datePicker.set(val, false);
      }

      if (this.isPreview && this.$v.value.$invalid) {
        this.highlightError();
      }

      this.$emit('_input', this.name, val, false, true);
    }
  },
  created: function() {
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  methods: {
    initDatePicker: function() {
      if (this.datePicker || !this.$refs.datePicker) {
        return;
      }

      var $vm = this;

      this.datePicker = Fliplet.UI.DatePicker(this.$refs.datePicker, {
        required: this.required || this.autofill === 'always',
        forceRequire: false,
        value: this.value
      });

      this.datePicker.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    },
    onBeforeSubmit: function(data) {
      // Empty date fields are validated to null before this hook is called
      if (this.autofill === 'always' && data[this.name] === null) {
        data[this.name] = this.defaultSource === 'submission' ? moment().locale('en').format('YYYY-MM-DD') : this.today;
      }
    }
  }
});
