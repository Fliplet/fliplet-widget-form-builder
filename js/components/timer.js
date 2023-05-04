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
      timer: null,
      isPreview: Fliplet.Env.get('preview'),
      timerStatus: 'initial',
      startValue: 0,
      runningTimer: null
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
      return this.getStringTime(this.hours, this.minutes, this.seconds);
    }
  },
  created: function() {
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  methods: {
    initTimer: function() {
      if (this.timer || !this.$refs.timer) {
        return;
      }

      var $vm = this;

      if (this.type === 'timer') {
        this.value = this.toSeconds(this.hours, this.minutes, this.seconds);
      } else {
        this.toHoursAndMinutes(this.value);
      }

      this.timer = Fliplet.UI.Timer(this.$refs.timer, {
        forceRequire: false,
        value: +this.value,
        readonly: this.readonly,
        type: this.type
      });

      this.timer.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
      });
    },
    getStringTime: function(hours, minutes, seconds) {
      return `${hours < 10 ? '0' + hours : hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds}`;
    },
    toHoursAndMinutes: function(totalSeconds) {
      const totalMinutes = Math.floor(totalSeconds / 60);

      this.seconds = totalSeconds % 60;
      this.hours = Math.floor(totalMinutes / 60);
      this.minutes = totalMinutes % 60;
    },
    toSeconds: function(hours, minutes, seconds) {
      return (+hours * 60 * 60) + (+minutes * 60) + +seconds;
    },
    start: function() {
      var $vm = this;

      if (this.timerStatus === 'running') {
        return;
      }

      this.timerStatus = 'running';
      Fliplet.App.Storage.set(this.name, moment());

      if (this.type === 'stopwatch') {
        this.runningTimer = setInterval(function() {
          $vm.value++;
        }, 1000);
      } else if (this.type === 'timer') {
        this.runningTimer = setInterval(function() {
          if ($vm.value === 0) {
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
            $vm.value--;
          }
        }, 1000);
      }
    },
    stop: function() {
      if (this.timerStatus === 'paused') {
        return;
      }

      clearInterval(this.runningTimer);
      this.timerStatus = 'paused';
      Fliplet.App.Storage.remove(this.name);
    },
    reset: function() {
      this.timerStatus = 'initial';
      this.value = this.startValue;
      Fliplet.App.Storage.remove(this.name);
    },
    onBeforeSubmit: function() {
      this.reset();
    }
  },
  mounted: async function() {
    if (this.type === 'stopwatch' && !this.value) {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }

    this.initTimer();

    var $vm = this;

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    await Fliplet.App.Storage.get(this.name).then(function(value) {
      if (value) {
        $vm.timerStatus = 'running';
        $vm.value = $vm.type === 'timer' ? $vm.value - moment().diff(value, 'seconds') : $vm.value + moment().diff(value, 'seconds');
      }

      this.value = $vm.value;
    });

    if (this.autostart) {
      this.start();
    }

    this.$emit('_input', this.name, +this.value);
    this.$v.$reset();
  },
  watch: {
    value: function(val) {
      this.toHoursAndMinutes(val);

      if (this.timer) {
        this.timer.set(val, false);
      }

      this.$emit('_input', this.name, +val);
    },
    timerStatus: function(val) {
      if (val === 'running' && this.runningTimer) {
        this.start();
      }
    }
  }
});
