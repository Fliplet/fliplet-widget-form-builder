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
    runCustomFunction: function() {
      var $vm = this;

      this.announceAction(`Executing ${this.buttonLabel || 'button'} action`, 1500);

      Fliplet.FormBuilder.get().then(function(form) {
        var button = _.assign({}, _.find($vm.$parent.fields, { name: $vm.name }), { $el: $vm.$el });

        if ($vm.buttonAction) {
          $vm.buttonAction.context = {
            form,
            button,
            fields: $vm.$parent.fields
          };
        }

        if (!($vm.buttonAction.action === 'next-slide' || $vm.buttonAction.action === 'previous-slide')) {
          try {
            $vm.announceStatus(`Navigating to ${$vm.buttonAction.action || 'target'}`, 2000);

            return Fliplet.Navigate.to($vm.buttonAction);
          } catch (err) {
            var defaultError = T('widgets.form.customButton.defaultError', { label: $vm.buttonLabel });

            $vm.announceError(`Button action failed: ${err.message || defaultError}`, 3000);

            Fliplet.UI.Toast.error(err, defaultError);
          }
        }
      }).catch(function(error) {
        // Announce form loading error
        $vm.announceError(`Failed to load form data: ${error.message}`, 3000);
      });
    },

    // Add method to handle keyboard navigation
    handleKeyDown: function(event) {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.runCustomFunction();
          break;

        default:
          break;
      }
    }
  }
});
