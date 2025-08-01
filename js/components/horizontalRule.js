/**
- * Horizontal rule (LIne Break) field component – renders a visual separator line in forms.
+ * Horizontal rule (Line Break) field component – renders a visual separator line in forms.
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
