Fliplet.FormBuilder.field('timer', {
  name: 'Timer',
  category: 'Date & time',
  props: {
    value: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    type: {
      type: String,
      default: 'stopwatch'
    },
    autostart: {
      type: Boolean,
      default: false
    },
    hours: {
      type: Number,
      default: 0
    },
    minutes: {
      type: Number,
      default: 0
    },
    seconds: {
      type: Number,
      default: 0
    },
    initialTimerValue: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      isPreview: Fliplet.Env.get('preview'),
      status: 'stopped',
      timerInterval: null,
      startTimestamp: moment().valueOf() / 1000,
      stringValue: '',
      hasError: false
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
    Fliplet.FormBuilder.on('reset', this.reset);
    Fliplet.Hooks.on('beforeFormSubmit', this.beforeFormSubmit);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.reset);
    Fliplet.Hooks.off('beforeFormSubmit', this.beforeFormSubmit);
  },
  computed: {
    hasRequiredError: function() {
      return this.hasError;
    }
  },
  methods: {
    formatSeconds: function(seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds % 3600) / 60);
      var remainingSeconds = Math.floor(seconds % 60);

      // Add leading zeros if necessary
      var hoursStr = hours.toString().padStart(2, '0');
      var minutesStr = minutes.toString().padStart(2, '0');
      var secondsStr = remainingSeconds.toString().padStart(2, '0');

      return hoursStr + ' : ' + minutesStr + ' : ' + secondsStr;
    },
    toSeconds: function(hours, minutes, seconds) {
      return (+hours * 60 * 60) + (+minutes * 60) + +seconds;
    },
    start: function() {
      if (this.status === 'running') {
        return;
      }

      this.status = 'running';
      this.startTimestamp = moment().valueOf() / 1000;
      Fliplet.App.Storage.set(this.name, this.startTimestamp);
      this.setInterval();
    },
    stop: function() {
      if (this.status === 'stopped') {
        return;
      }

      this.value = this.updateValue();
      Fliplet.App.Storage.remove(this.name);
      this.status = 'stopped';
      this.stopInterval();
    },
    reset: function() {
      this.value = 0;

      if (this.status === 'running') {
        Fliplet.App.Storage.remove(this.name);
        this.status = 'stopped';
        this.stopInterval();
      }

      this.stringValue = this.formatSeconds(this.initialTimerValue);
    },
    isRunning: function() {
      return this.status === 'running';
    },
    setInterval: function() {
      var $vm = this;

      if (this.type === 'stopwatch') {
        this.timerInterval = setInterval(function() {
          var totalSeconds = $vm.updateValue();

          $vm.stringValue = $vm.formatSeconds(totalSeconds);
        }, 500);
      } else if (this.type === 'timer') {
        this.timerInterval = setInterval(function() {
          var totalSeconds = $vm.initialTimerValue - $vm.updateValue();

          if (totalSeconds <= 0) {
            Fliplet.UI.Toast({
              type: 'minimal',
              message: 'Countdown Timer has reached 0',
              actions: [{
                label: 'Dismiss',
                action: () => {
                  Fliplet.UI.Toast.dismiss();
                  $vm.reset();
                }
              }],
              duration: false, // Ensures the toast message doesn't auto-dismiss
              tapToDismiss: false // Ensures the toast message is only dismissed through the action button
            });

            $vm.stop();
          } else {
            $vm.stringValue = $vm.formatSeconds(totalSeconds);
          }
        }, 500);
      }
    },
    stopInterval: function() {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    },
    get: function() {
      return this.updateValue();
    },
    set: function(data) {
      if (!/^(\d+.)*(\d+)$/.test(data)) {
        return;
      }

      data = Math.round(data * 1000) / 1000;

      this.value = this.type === 'timer'
        ? Math.max(Math.min(this.initialTimerValue, data), 0)
        : Math.max(data, 0);
      this.stringValue = this.formatSeconds(this.value);

      if (this.status === 'running') {
        this.startTimestamp = moment().valueOf() / 1000;
        Fliplet.App.Storage.set(this.name, this.startTimestamp);
      }
    },
    updateValue() {
      return this.value + (moment().valueOf() / 1000 - this.startTimestamp);
    },
    beforeFormSubmit: function(data) {
      if (this.status === 'running') {
        this.stop();

        data[this.name] = Math.round(this.value * 1000) / 1000;
      }

      if (this.required && !this.value) {
        this.hasError = true;

        return Promise.reject('');
      }
    }
  },
  mounted: async function() {
    var $vm = this;

    this.value = 0;

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    Fliplet.App.Storage.get(this.name).then(function(value) {
      if (value) {
        $vm.startTimestamp = value;
        $vm.status = 'running';
        $vm.setInterval();
      }
    });

    this.stringValue = this.formatSeconds(this.initialTimerValue);

    if (this.autostart) {
      this.start();
    }

    this.$emit('_input', this.name, this.value);
    this.$v.$reset();
  },
  watch: {
    value: function(val) {
      val = Math.round(val * 1000) / 1000;

      this.$emit('_input', this.name, val, false, true);
    }
  }
});
