Fliplet.FormBuilder.field('dateRange', {
  name: 'Date range',
  category: 'Date & time',
  props: {
    value: {
      type: Object,
      default: null
    },
    description: {
      type: String
    },
    autofill: {
      type: String,
      default: 'always'
    },
    defaultSource: {
      type: String,
      default: 'submission'
    },
    defaultRangeDuration: {
      type: Number,
      default: 2
    },
    showPredefinedRanges: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: function() {
        return '-- ' + T('widgets.form.dateRange.rangePlaceholder');
      }
    }
  },
  data: function() {
    return {
      dateRange: null,
      isInputFocused: false,
      isPreview: Fliplet.Env.get('preview'),
      today: this.formatLocaleDate(moment()),
      selectedRange: {
        label: T('widgets.form.dateRange.rangePlaceholder'),
        value: ''
      },
      predefinedRanges: [
        {
          label: T('widgets.form.dateRange.predefinedRanges.today'),
          value: 'today'
        },
        {
          label: T('widgets.form.dateRange.predefinedRanges.yesterday'),
          value: 'yesterday'
        },
        {
          label: T('widgets.form.dateRange.predefinedRanges.tomorrow'),
          value: 'tomorrow'
        },
        {
          label: T('widgets.form.dateRange.predefinedRanges.nextWeek'),
          value: 'nextWeek'
        },
        {
          label: T('widgets.form.dateRange.predefinedRanges.lastWeek'),
          value: 'lastWeek'
        },
        {
          label: T('widgets.form.dateRange.predefinedRanges.nextMonth'),
          value: 'nextMonth'
        },
        {
          label: T('widgets.form.dateRange.predefinedRanges.lastMonth'),
          value: 'lastMonth'
        }
      ]
    };
  },
  mounted: function() {
    this.initDaterange();

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({
        source: this.defaultValueSource,
        key: this.defaultValueKey
      });
    }

    switch (this.autofill) {
      case 'default':
      case 'always':
        this.value = {
          start: this.today,
          end: this.today
        };
        this.empty = false;
        break;
      case 'empty':
        this.value = null;
        break;
      default:
        break;
    }

    this.$emit('_input', this.name, this.value, false, true);
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
          start: this.today,
          end: this.today
        };
      }

      if (this.isPreview && this.$v.value.$invalid) {
        this.highlightError();
      }

      if (this.dateRange) {
        this.dateRange.set(val, true);
      }

      this.$emit('_input', this.name, val, false, true);
    },
    selectedRange: function(range) {
      var newDate = this.getDate(range.value);

      this.value = newDate;
    }
  },
  created: function() {
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  methods: {
    initDaterange: function() {
      var $vm = this;

      if (this.dateRange && !this.$refs.dateRange) {
        return;
      }

      if (!this.value.start || !this.value.end && ['default', 'always'].indexOf(this.autofill) > -1 && (this.required || this.autofill === 'always')) {
        $vm.value = {
          start: this.today,
          end: this.today
        };
      }

      this.dateRange = Fliplet.UI.DateRange(this.$refs.dateRange, {
        required: this.required || this.autofill === 'always',
        forceRequire: false,
        value: this.value,
        readonly: this.readonly
      });

      this.dateRange.change(function(value) {
        this.selectedRange = {
          label: T('widgets.form.dateRange.rangePlaceholder'),
          value: ''
        };

        $vm.value = value;
        $vm.updateValue();
      });
    },
    getDate: function(option) {
      switch (option) {
        case 'today':
          return {
            start: this.formatLocaleDate(moment()),
            end: this.formatLocaleDate(moment())
          };
        case 'yesterday':
          return {
            start: this.formatLocaleDate(moment().subtract(1, 'days')),
            end: this.formatLocaleDate(moment().subtract(1, 'days'))
          };
        case 'tomorrow':
          return {
            start: this.formatLocaleDate(moment().add(1, 'days')),
            end: this.formatLocaleDate(moment().add(1, 'days'))
          };
        case 'nextWeek':
          return {
            start: this.formatLocaleDate(moment().add(1, 'days')),
            end: this.formatLocaleDate(moment().add(7, 'days'))
          };
        case 'lastWeek':
          return {
            start: this.formatLocaleDate(moment().subtract(7, 'days')),
            end: this.formatLocaleDate(moment().subtract(1, 'days'))
          };
        case 'nextMonth':
          return {
            start: this.formatLocaleDate(moment().add(1, 'days')),
            end: this.formatLocaleDate(moment().add(30, 'days'))
          };
        case 'lastMonth':
          return {
            start: this.formatLocaleDate(moment().subtract(30, 'days')),
            end: this.formatLocaleDate(moment().subtract(1, 'days'))
          };
        default:
          return {
            start: this.formatLocaleDate(moment()),
            end: this.formatLocaleDate(moment())
          };
      }
    },
    formatLocaleDate: function(date) {
      return date.locale('en').format('YYYY-MM-DD');
    },
    onBeforeSubmit: function(data) {
      // Empty date fields are validated to null before this hook is called
      if (this.autofill === 'always' && data[this.name] === null) {
        data[this.name] = this.defaultSource === 'submission'
          ? { start: this.formatLocaleDate(moment()), end: this.formatLocaleDate(moment()) }
          : { start: this.today, end: this.today };
      }
    }
  }
});

