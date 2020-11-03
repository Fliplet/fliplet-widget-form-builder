Fliplet.FormBuilder.configuration('password', {
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
