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
    className: {
      type: String
    }
  }
});
