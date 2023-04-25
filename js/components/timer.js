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
      timeInSeconds: 0,
      startValue: 0
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
  methods: {
    initTimer: function() {
      if (this.timer || !this.$refs.timer) {
        return;
      }

      var $vm = this;

      this.timer = Fliplet.UI.Timer(this.$refs.timer, {
        forceRequire: false,
        value: this.timeInSeconds,
        readonly: this.readonly,
        type: this.type,
        startValue: this.startValue
      });

      this.timer.change(function(value, status) {
        $vm.timerStatus = status;
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
    }
  },
  mounted: function() {
    if (this.type === 'timer') {
      this.startValue = this.toSeconds(this.hours, this.minutes, this.seconds);
    } else if (this.type === 'stopwatch') {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }

    this.timeInSeconds = this.toSeconds(this.hours, this.minutes, this.seconds);
    this.value = this.getStringTime(this.hours, this.minutes, this.seconds);
    this.initTimer();

    if (this.autostart) {
      this.timer.start();
    }

    this.$emit('_input', this.name, this.value);
    this.$v.$reset();
  },
  watch: {
    value: function(val) {
      if (!val) {
        this.value = this.getStringTime(0, 0, 0);

        return;
      }

      if (typeof val !== 'string') {
        this.toHoursAndMinutes(val);
        this.value = this.getStringTime(this.hours, this.minutes, this.seconds);
      }

      this.$emit('_input', this.name, this.value, false, true);
    }
  }
});
