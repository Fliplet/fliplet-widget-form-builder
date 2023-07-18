Fliplet.FormBuilder.field('geolocation', {
  name: 'Geolocation',
  category: 'Advanced',
  props: {
    description: {
      type: String
    },
    autofill: {
      type: Boolean,
      default: false
    },
    preciseLocationRequired: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      buttonContent: T('widgets.form.geolocation.getLocation')
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
  }
});
