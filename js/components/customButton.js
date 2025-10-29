/**
 * Custom button field component – renders configurable action buttons in forms.
 * Supports custom styling, actions, and conditional display logic.
 */
Fliplet.FormBuilder.field('customButton', {
  name: 'Button',
  category: 'Buttons',
  submit: false,
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
    runCustomFunction: async function() {
      const $vm = this;
      let dynamicContext;

      try {
        dynamicContext = await Fliplet.Widget.getDynamicContext($($vm.$el));
      } catch (err) {
        dynamicContext = {};
      }

      Fliplet.FormBuilder.get().then(function(form) {
        const foundField = $vm.$parent.fields.find(function(field) { return field.name === $vm.name; });
        const button = Object.assign({}, foundField, { $el: $vm.$el });

        if ($vm.buttonAction) {
          $vm.buttonAction.dynamicContext = dynamicContext;
          $vm.buttonAction.context = {
            form,
            button,
            fields: $vm.$parent.fields
          };
        }

        if (!($vm.buttonAction.action === 'next-slide' || $vm.buttonAction.action === 'previous-slide')) {
          try {
            return Fliplet.Navigate.to($vm.buttonAction);
          } catch (err) {
            const defaultError = T('widgets.form.customButton.defaultError', { label: $vm.buttonLabel });

            Fliplet.UI.Toast.error(err, defaultError);
          }
        }
      });
    }
  }
});
