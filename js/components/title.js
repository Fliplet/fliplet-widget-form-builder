/**
 * Title field component – renders formatted heading text in forms.
 * Supports multiple heading levels and custom styling for form section headers.
 */
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
