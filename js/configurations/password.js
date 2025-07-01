/**
 * Password field configuration – handles password validation and generation settings.
 * Manages mutual exclusivity between password confirmation and autogeneration features.
 * Enforces minimum password length validation (8 characters minimum).
 */
Fliplet.FormBuilder.configuration('password', {
  methods: {
    validatePasswordLength: function() {
      if (!isNaN(Number(this.autogenerateLength)) && Number(this.autogenerateLength) > 7) {
        return;
      }

      this.autogenerateLength = 8;
    }
  },
  watch: {
    autogenerate: function(val) {
      if (!val) {
        return;
      }

      if (this.confirm) {
        Fliplet.Modal.alert({
          message: 'Password confirmation and autogeneration can\'t both be enabled. Enabling one disables the other.'
        });
      }

      this.confirm = false;
    }
  }
});
