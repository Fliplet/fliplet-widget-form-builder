Fliplet.FormBuilder.field('dateRange', {
  name: 'Date range',
  category: 'Date & time',
  props: {
    value: {
      type: Object,
      default: null
    },
    startValue: {
      type: String,
      default: ''
    },
    endValue: {
      type: String,
      default: ''
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
      today: this.formatDate(),
      selectedRange: null,
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
    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({
        source: this.defaultValueSource,
        key: this.defaultValueKey
      });
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

    this.initDaterange();

    this.$emit('_input', this.name, this.value, false, true);
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
    },
    isDefaultValueField: function() {
      return this.autofill === 'custom';
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

      if (this.dateRange) {
        this.dateRange.set(val, false);
      }

      if (this.isPreview && this.$v.value.$invalid) {
        this.highlightError();
      }

      this.$emit('_input', this.name, val, false, true);
    },
    selectedRange: function(range) {
      var newDate = range ? this.getDate(range.value) : this.getDate();

      this.value = newDate;
    }
  },
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  methods: {
    onReset: function() {
      this.selectedRange = null;

      this.dateRange.clear();
    },
    initDaterange: function() {
      var $vm = this;

      if (this.dateRange && !this.$refs.dateRange) {
        return;
      }

      this.dateRange = Fliplet.UI.DateRange(this.$refs.dateRange, {
        required: this.required || this.autofill === 'always',
        forceRequire: false,
        value: this.value,
        readonly: this.readonly
      });

      this.dateRange.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    },
    getDate: function(option) {
      switch (option) {
        case 'today':
          return {
            start: this.formatDate(),
            end: this.formatDate()
          };
        case 'yesterday':
          return {
            start: this.formatDate(moment().subtract(1, 'days')),
            end: this.formatDate(moment().subtract(1, 'days'))
          };
        case 'tomorrow':
          return {
            start: this.formatDate(moment().add(1, 'days')),
            end: this.formatDate(moment().add(1, 'days'))
          };
        case 'nextWeek':
          return {
            start: this.formatDate(moment().add(1, 'days')),
            end: this.formatDate(moment().add(7, 'days'))
          };
        case 'lastWeek':
          return {
            start: this.formatDate(moment().subtract(7, 'days')),
            end: this.formatDate(moment().subtract(1, 'days'))
          };
        case 'nextMonth':
          return {
            start: this.formatDate(moment().add(1, 'days')),
            end: this.formatDate(moment().add(30, 'days'))
          };
        case 'lastMonth':
          return {
            start: this.formatDate(moment().subtract(30, 'days')),
            end: this.formatDate(moment().subtract(1, 'days'))
          };
        default:
          return this.value;
      }
    },
    formatDate: function(date) {
      return typeof date !== 'undefined' && moment(date).isValid()
        ? moment(date).locale('en').format('YYYY-MM-DD')
        : moment().locale('en').format('YYYY-MM-DD');
    },
    onBeforeSubmit: function(data) {
      // Empty date fields are validated to null before this hook is called
      if (this.autofill === 'always' && data[this.name] === null) {
        data[this.name] = this.defaultSource === 'submission'
          ? { start: this.formatDate(), end: this.formatDate() }
          : { start: this.today, end: this.today };
      }
    }
  }
});

