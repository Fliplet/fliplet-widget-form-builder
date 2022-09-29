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
      now: moment().locale('en').format('HH:mm')
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
  methods: {
    initTimePicker: function() {
      if (this.timePicker || !this.$refs.timePicker) {
        return;
      }

      var $vm = this;

      this.timePicker = Fliplet.UI.TimePicker(this.$refs.timePicker, {
        required: this.required || this.autofill === 'always',
        forceRequire: false,
        value: this.value,
        readonly: this.readonly
      });

      this.timePicker.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    },
    onBeforeSubmit: function(data) {
      if (this.autofill === 'always' && data[this.name] === '') {
        data[this.name] = this.defaultSource === 'submission' ? moment().format('HH:mm') : this.now;
      }
    }
  },
  computed: {
    isApplyCurrentDateField: function() {
      return this.autofill === 'always' || this.autofill === 'default';
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
      this.value = moment(this.value, 'HH:mm A').locale('en').format('HH:mm');
    }
  },
  mounted: function() {
    this.initTimePicker();

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    if ((!this.value && this.autofill === 'default') || this.autofill === 'always') {
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
      if (val === '' &&  ['default', 'always'].indexOf(this.autofill) > -1 && (this.required || this.autofill === 'always')) {
        this.value = this.now;

        return;
      }

      if (this.timePicker) {
        this.timePicker.set(val, false);
      }

      if (this.isPreview && this.$v.value.$invalid) {
        this.highlightError();
      }

      this.$emit('_input', this.name, val, false, true);
    }
  }
});
