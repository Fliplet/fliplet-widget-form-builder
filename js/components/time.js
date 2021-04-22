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
      LOCAL_FORMAT: moment.localeData().longDateFormat('LT'),
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
  methods: {
    updateValue: function(value) {
      if (value) {
        this.value = value;
      }

      this.highlightError();
      this.$emit('_input', this.name, this.value);
    },
    initTimePicker: function() {
      var $vm = this;

      this.timepicker = $($vm.$refs.timepicker).timeEntry()
        .on('change', function(event) {
          $vm.value = event.target.value;
          $vm.updateValue($vm.value);
        });

      this.timepicker.timeEntry('setTime', $vm.value);

      $vm.$v.$reset();
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
    if (Fliplet.Env.is('web') && (this.browserSupport('IE11') || this.browserSupport('Safari'))) {
      this.initTimePicker();
    }

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    if (!this.value || this.autofill === 'always') {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();

      if (hours < 10) {
        hours = '0' + hours;
      }

      if (minutes < 10) {
        minutes = '0' + minutes;
      }

      var formattedTime = moment(hours + ':' + minutes, 'HH:mm').format(this.LOCAL_FORMAT);

      this.updateValue(formattedTime);
      this.empty = false;
    }
  },
  watch: {
    value: function(val) {
      if (!val) {
        this.updateValue(moment().format(this.LOCAL_FORMAT));
      }
    }
  }
});
