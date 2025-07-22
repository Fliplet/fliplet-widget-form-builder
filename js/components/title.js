Fliplet.FormBuilder.field('title', {
  name: 'Format Title',
  category: 'Formatting',
  submit: false,
  props: {
    label: undefined,
    showLabel: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: 'Title'
    },
    canHide: {
      type: Boolean,
      default: false
    }
  }
});
