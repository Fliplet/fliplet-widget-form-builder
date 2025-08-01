/**
 * This component provides a password input field with advanced features including:
 * - Password strength validation with customizable rules
 * - Password confirmation field
 * - Auto-generation of secure passwords
 * - Password hashing support
 * - Progress saving and population on update
 */
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
    isPasswordConfirmed: {
      type: Boolean,
      default: true
    },
    isValid: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      isFocused: false,
      passwordMinLength: 8,
      defaultClass: 'panel-default',
      invalidClass: 'panel-danger',
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
      return this.autogenerate ? T('widgets.form.password.placeholder') : this.placeholder;
    },
    validationClass: function() {
      return {
        password: !this.isValid ? this.invalidClass : this.defaultClass,
        passwordConfirmation: !this.isPasswordConfirmed ? this.invalidClass : this.defaultClass
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
      var isValid = true;

      for (var x = 0; x < length; x++) {
        password += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }

      _.forEach(this.rules, function(value) {
        if (!value.test(password)) {
          isValid = false;
        }
      });

      return isValid ? password : this.generateRandomPassword(length);
    },
    updatePasswordConfirmation: function() {
      this.$v.passwordConfirmation.$touch();
      this.highlightError();
    },
    onPasswordConfirmationInput: function($event) {
      this.$emit('_input', this.name, $event.target.value, true, true);
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      if (this.autogenerate && !newVal && oldVal) {
        this.value = oldVal;
        this.updateValue();
      }
    },
    '$v.passwordConfirmation.$invalid': function(value) {
      if (!value) {
        this.isPasswordConfirmed = true;
      }
    }
  }
});
