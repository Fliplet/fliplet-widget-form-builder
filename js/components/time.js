Fliplet.FormBuilder.field('time', {
  name: 'Time picker',
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
      timePicker: null,
      isInputFocused: false,
      isPreview: Fliplet.Env.get('preview'),
      now: moment().format('HH:mm')
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
  methods: {
    initTimePicker: function() {
      if (this.timePicker || !this.$refs.timePicker) {
        return;
      }

      var $vm = this;

      this.timePicker = Fliplet.UI.TimePicker(this.$refs.timePicker, {
        required: this.required || this.autofill === 'always',
        value: this.value
      });

      this.timePicker.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    }
  },
  computed: {
    isApplyCurrentDateField: function() {
      return this.autofill === 'always' || this.autofill === 'default';
    },
    readonlyValue: function() {
      return /^([01]\d|2[0-3]):?([0-5]\d)$/.test(this.value)
        ? TD(this.value, { format: 'LT' })
        : '';
    }
  },
  beforeUpdate: function() {
    /**
     * if the passed time is in the HH:mm A format,
     * that means that this must be an old record saved,
     * so we need to re-format it to the correct format which is accepted by the native html5 time input,
     * which is HH:mm
     */
    if (moment(this.value, 'HH:mm A', true).isValid()) {
      this.value = moment(this.value, 'HH:mm A').format('HH:mm');
    }
  },
  mounted: function() {
    this.initTimePicker();

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    if (!this.value || this.autofill === 'always') {
      this.value = this.now;
      this.empty = false;
    }

    if (this.autofill === 'empty') {
      this.value = '';

      return;
    }

    this.$emit('_input', this.name, this.value);
    this.$v.$reset();
  },
  watch: {
    value: function(val) {
      if (this.autofill === 'always' && val === '') {
        this.value = this.now;

        return;
      }

      this.timePicker.set(val, false);

      if (this.isPreview && this.$v.value.$invalid) {
        this.highlightError();
      }

      this.$emit('_input', this.name, val, false, true);
    }
  }
});
