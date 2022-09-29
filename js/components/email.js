Fliplet.FormBuilder.field('email', {
  name: 'Email input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    }
  },
  validations: function() {
    var rules = {
      value: {
        email: window.validators.email
      }
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  created: function() {
    this.removeInvalidCharacters();
  },
  methods: {
    removeInvalidCharacters: function() {
      if (this.value) {
        // Remove invalid characters to avoid invisible characters
        this.value = this.value.replace(/([^a-zA-Z0-9!#$%&\'*@+-/=?^_`{|}~.]+)/gi, '');
        this.updateValue();
      }
    }
  },
  watch: {
    value: function() {
      this.removeInvalidCharacters();
    }
  }
});
