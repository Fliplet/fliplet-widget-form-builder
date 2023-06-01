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
      timerStatus: 'stopped',
      timerInterval: null,
      startTimestamp: moment().valueOf() / 1000,
      stringValue: ''
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
    Fliplet.Hooks.on('beforeFormSubmit', this.stop);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.reset);
    Fliplet.Hooks.off('beforeFormSubmit', this.stop);
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
      if (this.timerStatus === 'running') {
        return;
      }

      this.timerStatus = 'running';
      this.startTimestamp = moment().valueOf() / 1000;
      Fliplet.App.Storage.set(this.name, this.startTimestamp);
      this.setInterval();
    },
    stop: function() {
      if (this.timerStatus === 'stopped') {
        return;
      }

      this.value = this.updateValue();
      Fliplet.App.Storage.remove(this.name);
      this.timerStatus = 'stopped';
      this.stopInterval();
    },
    reset: function() {
      this.value = 0;

      if (this.timerStatus === 'running') {
        Fliplet.App.Storage.remove(this.name);
        this.timerStatus = 'stopped';
        this.stopInterval();
      }

      this.stringValue = this.formatSeconds(this.initialTimerValue);
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

          if (Math.round(totalSeconds) === 0) {
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

      data = parseFloat(data).toFixed(3);

      this.value = this.type === 'timer'
        ? Math.max(Math.min(this.initialTimerValue, data), 0)
        : Math.max(data, 0);
      this.stringValue = this.formatSeconds(this.value);

      if (this.timerStatus === 'running') {
        this.startTimestamp = moment().valueOf() / 1000;
        Fliplet.App.Storage.set(this.name, this.startTimestamp);
      }
    },
    updateValue() {
      return this.value + (moment().valueOf() / 1000 - this.startTimestamp);
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
        $vm.timerStatus = 'running';
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
    value: function() {
      this.value = Math.round(this.value * 1000) / 1000;

      this.$emit('_input', this.name, this.value, false, true);
    }
  }
});
