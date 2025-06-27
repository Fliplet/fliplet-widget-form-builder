/* Purpose: Vue component for 'horizontalRule' field in Fliplet apps. See AGENTS.md. */

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
