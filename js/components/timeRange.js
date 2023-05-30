Fliplet.FormBuilder.field('timeRange', {
  name: 'Time range',
  category: 'Date & time',
  props: {
    value: {
      type: Object,
      default: null
    },
    autofill: {
      type: String,
      default: 'default'
    },
    description: {
      type: String
    },
    defaultSource: {
      type: String,
      default: 'load'
    },
    empty: {
      type: Boolean,
      default: true
    },
    startValue: {
      type: String,
      default: ''
    },
    endValue: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      timeRange: null,
      isInputFocused: false,
      isPreview: Fliplet.Env.get('preview'),
      now: moment().locale('en').format('HH:mm')
    };
  },
  mounted() {
    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({
        source: this.defaultValueSource,
        key: this.defaultValueKey
      });
    }

    if (this.value && typeof this.value !== 'object') {
      this.value = {
        start: this.value,
        end: this.value
      };
    }

    switch (this.autofill) {
      case 'custom':
        this.value = {
          start: this.startValue,
          end: this.endValue
        };
        break;
      case 'default':
      case 'always':
        this.value = {
          start: this.now,
          end: this.now
        };
        this.empty = false;
        break;
      case 'empty':
        this.value = null;
        break;
      default:
        break;
    }

    this.initTimeRange();

    this.$emit('_input', this.name, this.value);
    this.$v.$reset();
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
  computed: {
    isApplyCurrentDateField: function() {
      return this.autofill === 'always' || this.autofill === 'default';
    }
  },
  watch: {
    value: function(val) {
      if (!val && ['default', 'always'].indexOf(this.autofill) > -1 && (this.required || this.autofill === 'always')) {
        this.value = {
          start: this.now,
          end: this.now
        };
      }

      if (this.isPreview && this.$v.value.$invalid) {
        this.highlightError();
      }

      if (this.timeRange) {
        this.timeRange.set(val, true);
      }

      this.$emit('_input', this.name, this.value, false, true);
    }
  },
  created: function() {
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  methods: {
    initTimeRange: function() {
      var $vm = this;

      if (this.timeRange && !this.$refs.timeRange) {
        return;
      }

      this.timeRange = Fliplet.UI.TimeRange(this.$refs.timeRange, {
        required: this.required || this.autofill === 'always',
        forceRequire: false,
        value: this.value,
        readonly: this.readonly
      });

      this.timeRange.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    },
    onBeforeSubmit: function(data) {
      // Empty date fields are validated to null before this hook is called
      if (this.autofill === 'always' && data[this.name] === null) {
        data[this.name] = this.defaultSource === 'submission'
          ? { start: moment().locale('en').format('HH:mm'), end: moment().locale('en').format('HH:mm') }
          : { start: this.now, end: this.now };
      }
    }
  }
});

