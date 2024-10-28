Fliplet.FormBuilder.field('customButton', {
  name: 'Button',
  category: 'Buttons',
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

      Fliplet.FormBuilder.get().then(function(form) {
        var button = _.assign({}, _.find($vm.$parent.fields, { name: $vm.name }), { $el: $vm.$el });

        if ($vm.buttonAction) {
          $vm.buttonAction.context = {
            form,
            button,
            fields: $vm.$parent.fields
          };
        }

        try {
          return Fliplet.Navigate.to($vm.buttonAction);
        } catch (err) {
          var defaultError = T('widgets.form.customButton.defaultError', { label: $vm.buttonLabel });

          Fliplet.UI.Toast.error(err, defaultError);
        }
      });
    }
  }
});
