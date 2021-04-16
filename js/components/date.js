var DATE_FORMAT = 'YYYY-MM-DD';
var LOCAL_FORMAT = moment.localeData().longDateFormat('L');

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
      isInputFocused: false
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
    isWeb: function() {
      return Fliplet.Env.get('platform') === 'web';
    }
  },
  methods: {
    updateValue: function(value) {
      if (value) {
        this.value = value;
      }

      this.highlightError();
      this.$emit('_input', this.name, this.value);
    }
  },
  mounted: function() {
    var $vm = this;

    if (Fliplet.Env.get('platform') === 'web') {
      this.datePicker = $(this.$el).find('input.date-picker').datepicker({
        format: {
          toDisplay: function(date) {
            return moment(date).format(LOCAL_FORMAT);
          },
          toValue: function(date) {
            return date;
          }
        },
        todayHighlight: true,
        autoclose: true
      }).on('changeDate', function(e) {
        $vm.value = moment(e.date).format(DATE_FORMAT);

        $vm.updateValue();
      });

      this.datePicker.datepicker('setDate', new Date(this.value) || new Date());
    }

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    if (!this.value || this.autofill === 'always') {
      // HTML5 date field wants YYYY-MM-DD format
      this.value = moment().format(DATE_FORMAT);
      this.empty = false;
    }

    this.$emit('_input', this.name, this.value);
    $vm.$v.$reset();
  },
  watch: {
    value: function(val) {
      if (!val) {
        this.updateValue(moment().format(DATE_FORMAT));
      }
    }
  }
});
