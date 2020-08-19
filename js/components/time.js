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
      if (this.autofill === 'always') {
        this.value = this.getCurrentTime();
      } else if (value) {
        this.value = value;
      }

      this.highlightError();
      this.$emit('_input', this.name, this.value);
    },
    getCurrentTime: function() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();

      hours = ('0' + hours).slice(-2);
      minutes = ('0' + minutes).slice(-2);

      return hours + ':' + minutes;
    }
  },
  beforeUpdate: function() {
    /**
     * if the passed time is in the HH:mm A format,
     * that means that this must be an old record saved, 
     * so we need to re-format it to the correct format which is accepted by the native html5 time input,
     * which is HH:mm
     */
    if (moment(this.value, 'HH:mm A', true).isValid()){
      this.value = moment(this.value, 'HH:mm A').format('HH:mm');
    }
  },
  mounted: function() {
    var $vm = this;
    if (!this.value || this.autofill === 'always') {
      var currentTime = this.getCurrentTime();

      this.updateValue(currentTime);
      this.empty = false;
    }
    $vm.$v.$reset();
  }
});
