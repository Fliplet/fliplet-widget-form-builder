Fliplet.FormBuilder.field('buttons', {
  name: 'Form buttons',
  category: 'Buttons',
  submit: false,
  props: {
    label: undefined,
    showLabel: {
      type: Boolean,
      default: false
    },
    showSubmit: {
      type: Boolean,
      default: true
    },
    showClear: {
      type: Boolean,
      default: true
    },
    submitValue: {
      type: String,
      default: 'Submit'
    },
    clearValue: {
      type: String,
      default: 'Clear'
    },
    submitType: {
      type: String,
      default: 'submit'
    },
    clearType: {
      type: String,
      default: 'button'
    },
    type: {
      type: String,
      default: 'flButtons'
    }
  },
  mounted: function() {
    this.label = this.label || this.name;
  }
});
