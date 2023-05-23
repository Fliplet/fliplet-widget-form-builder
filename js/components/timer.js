Fliplet.FormBuilder.field('timer', {
  name: 'Timer',
  category: 'Date & time',
  props: {
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
    }
  },
  data: function() {
    return {
      isPreview: Fliplet.Env.get('preview'),
      timerStatus: 'stopped',
      initialValue: 0,
      timerInterval: null,
      startTimestamp: moment().unix()
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
  computed: {
    stringValue: function() {
      return `${this.hours < 10 ? '0' + this.hours : this.hours} : ${this.minutes < 10 ? '0' + this.minutes : this.minutes} : ${this.seconds < 10 ? '0' + this.seconds : this.seconds}`;
    }
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
    setDisplayValues: function(totalSeconds) {
      const totalMinutes = Math.floor(totalSeconds / 60);

      this.seconds = totalSeconds % 60;
      this.hours = Math.floor(totalMinutes / 60);
      this.minutes = totalMinutes % 60;
    },
    toSeconds: function(hours, minutes, seconds) {
      return (+hours * 60 * 60) + (+minutes * 60) + +seconds;
    },
    start: function() {
      if (this.timerStatus === 'running') {
        return;
      }

      this.timerStatus = 'running';
      this.startTimestamp = moment().unix();
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

      this.setDisplayValues(this.initialValue);
    },
    setInterval: function() {
      var $vm = this;

      if (this.type === 'stopwatch') {
        this.timerInterval = setInterval(function() {
          var totalSeconds = $vm.updateValue();

          $vm.setDisplayValues(totalSeconds);
        }, 500);
      } else if (this.type === 'timer') {
        this.timerInterval = setInterval(function() {
          if (!$vm.hours && !$vm.minutes && !$vm.seconds) {
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
            var totalSeconds = $vm.initialValue - $vm.updateValue();

            $vm.setDisplayValues(totalSeconds);
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

      this.value = this.type === 'timer' ? Math.min(this.initialValue, data) : Math.max(data, 0);
      this.setDisplayValues(this.value);

      if (this.timerStatus === 'running') {
        this.startTimestamp = moment().unix();
        Fliplet.App.Storage.set(this.name, this.startTimestamp);
      }
    },
    updateValue() {
      return Math.floor(this.value) + (moment().unix() - this.startTimestamp);
    }
  },
  mounted: async function() {
    var $vm = this;

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    if (this.type === 'timer') {
      this.initialValue = this.toSeconds(this.hours, this.minutes, this.seconds);
    } else {
      this.initialValue = 0;
    }

    await Fliplet.App.Storage.get(this.name).then(function(value) {
      if (value) {
        $vm.startTimestamp = value;
        $vm.timerStatus = 'running';
        $vm.setInterval();
      }
    });

    this.setDisplayValues(+this.initialValue);

    if (this.autostart) {
      this.start();
    }

    this.$v.$reset();
  }
});
