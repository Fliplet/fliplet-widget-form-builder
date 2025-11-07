Fliplet.FormBuilder.field('paragraph', {
  name: 'Format Paragraph',
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
      default: 'Paragraph'
    },
    canHide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    htmlValue: function() {
      return this.value;
    }
  }
});
