Fliplet.FormBuilder.field('input', {
  name: 'Text input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    },
    idType: {
      type: String,
      default: ''
    },
    generateGuid: {
      type: Boolean,
      default: false
    }
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
  watch: {
    value: function(val) {
      if (!val) {
        this.getNewGuid();
      }
    }
  },
  methods: {
    getNewGuid: function(data = {}) {
      if (!this.value && this.idType === 'guid' && data.id !== this.$parent.id) {
        this.value = Fliplet.guid();
        this.updateValue();
      }
    },
    onReset: function(data) {
      if (!data || data.id !== this.$parent.id) {
        return;
      }

      if (this.generateGuid) {
        this.value = '';
        this.getNewGuid(data);
      }
    }
  },
  created: function() {
    this.getNewGuid();

    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});
