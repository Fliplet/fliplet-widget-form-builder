/**
 * Telephone field component – renders a phone number input with validation in forms.
 */
Fliplet.FormBuilder.field('telephone', {
  name: 'Telephone input',
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
        phone: window.validators.helpers.regex('', /^[0-9;,.()\-+\s*#]+$/)
      }
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  methods: {
    /**
     * Handle telephone focus
     * @returns {void}
     */
    onTelephoneFocus: function() {
      if (this.readonly) {
        this.announceStatus('Telephone field is disabled in read-only mode', 2000);

        return;
      }

      this.announceStatus('Telephone field focused. Enter your phone number using digits, spaces, dashes, and parentheses', 4000);
    },

    /**
     * Handle telephone keyboard events
     * @param {Event} event - Keyboard event
     * @returns {void}
     */
    handleTelephoneKeyDown: function(event) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();

          // Clear the input
          this.value = '';
          this.$emit('_input', this.name, this.value);

          this.announceStatus('Telephone number cleared', 1500);
          break;

        default:
          break;
      }
    }
  }
});
