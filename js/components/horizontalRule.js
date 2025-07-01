/**
 * Horizontal rule field component – renders a visual separator line in forms.
 * Provides styling options for thickness, color, and spacing customization.
 */
Fliplet.FormBuilder.field('horizontalRule', {
  name: 'Line break',
  category: 'Formatting',
  submit: false,
  props: {
    label: undefined,
    showLabel: {
      type: Boolean,
      default: false
    },
    canHide: {
      type: Boolean,
      default: false
    }
  }
});
