Fliplet.FormBuilder.field('customButton', {
  name: 'Custom button',
  category: 'Buttons',
  props: {
    description: {
      type: String
    },
    buttonLabel: {
      type: String,
      default: 'Button'
    },
    buttonStyle: {
      type: String,
      default: 'btn-primary'
    },
    className: {
      type: String
    },
    buttonAction: {
      type: Object
    }
  },
  methods: {
    runCustomFunction: function() {
      try {
        Fliplet.Navigate.to(this.buttonAction);
      } catch (err) {
        var defaultError = T('widgets.form.customButton.defaultError', { label: this.buttonLabel });

        Fliplet.UI.Toast.error(err, defaultError);
      }
    }
  }
});
