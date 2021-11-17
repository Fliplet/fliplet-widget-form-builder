Fliplet.FormBuilder.field('password', {
  name: 'Password input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    hash: {
      type: Boolean,
      default: false
    },
    autogenerate: {
      type: Boolean,
      default: false
    },
    autogenerateLength: {
      type: Number,
      default: 10
    },
    confirm: {
      type: Boolean,
      default: false
    },
    passwordConfirmation: {
      type: String,
      default: ''
    },
    hasConfirmationError: {
      type: Boolean,
      default: false
    },
    saveProgress: {
      type: Boolean,
      default: false
    },
    populateOnUpdate: {
      type: Boolean,
      default: false
    },
    submitWhenFalsy: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    confirmationStatus: {
      type: Boolean,
      default: true
    },
    validationStatus: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      isFocused: false,
      isPreview: Fliplet.Env.get('preview'),
      passwordMinLength: 8,
      validationClasses: ['panel-danger', 'panel-default'],
      rules: {
        isUppercase: new RegExp('[A-Z]'),
        isLowercase: new RegExp('[a-z]'),
        isNumber: new RegExp('[0-9]'),
        isSpecial: new RegExp('[^A-Za-z0-9]')
      }
    };
  },
  validations: function() {
    var rules = {
      value: {
        required: this.required && window.validators.required,
        minLength: window.validators.minLength(this.passwordMinLength),
        containsUppercase: function(value) {
          return value ? this.rules.isUppercase.test(value) : true;
        },
        containsLowercase: function(value) {
          return value ? this.rules.isLowercase.test(value) : true;
        },
        containsNumber: function(value) {
          return value ? this.rules.isNumber.test(value) : true;
        },
        containsSpecial: function(value) {
          return value ? this.rules.isSpecial.test(value) : true;
        }
      },
      passwordConfirmation: {
        sameAsPassword: this.confirm && window.validators.sameAs('value')
      }
    };

    return rules;
  },
  computed: {
    fieldPlaceholder: function() {
      return this.autogenerate ? 'A password will be automatically generated' : this.placeholder;
    },
    validationClass: function() {
      return {
        password: !this.validationStatus && this.$v.value.$invalid ? this.validationClasses[0] : this.validationClasses[1],
        passwordConfirmation: !this.confirmationStatus && this.$v.passwordConfirmation.$invalid ? this.validationClasses[0] : this.validationClasses[1]
      };
    }
  },
  mounted: function() {
    if (this.autogenerate && !this.value) {
      this.value = this.generateRandomPassword(this.autogenerateLength);
      this.updateValue();
    }
  },
  methods: {
    generateRandomPassword: function(length) {
      var alphabet = 'abcdefghijklmnopqrstuvwxyz!#$%&*-ABCDEFGHIJKLMNOP1234567890';
      var password = '';

      for (var x = 0; x < length; x++) {
        password += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }

      return password;
    },
    updatePasswordConfirmation: function() {
      this.$v.passwordConfirmation.$touch();
      this.highlightError();
    },
    onPasswordConfirmationInput: function($event) {
      this.$emit('_input', this.name, $event.target.value, true, true);
    }
  }
});
