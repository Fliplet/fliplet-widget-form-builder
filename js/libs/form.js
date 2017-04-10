Fliplet.Widget.instance('form-builder', function (data) {
  var selector = '[data-form-builder-id="' + data.id + '"]';

  function getFields() {
    return JSON.parse(JSON.stringify(data.fields || []));
  }

  function isFile(value) {
    return value && typeof value.item === 'function';
  }

  new Vue({
    el: $(selector)[0],
    data: function () {
      return {
        isSent: false,
        isSending: false,
        isConfigured: !!data.templateId,
        fields: getFields(),
        error: null
      };
    },
    computed: {
      hasRequiredFields: function () {
        return this.fields.some(function(el) {
          return !!el.required;
        });
      }
    },
    methods: {
      start: function () {
        this.isSent = false;
      },
      reset: function () {
        this.fields = getFields();
        this.isSending = false;
        this.isSent = true;
      },
      onSubmit: function () {
        var $vm = this;
        var hasFileInputs = this.fields.some(function(field) {
          return isFile(field.value);
        });
        var formData = hasFileInputs ? (new FormData()) : {};

        function appendField(name, value) {
          if (hasFileInputs) {
            formData.append(name, value);
          } else {
            formData[name] = value;
          }
        }

        this.fields.forEach(function (field) {
          var value = field.value;

          if (isFile(value)) {
            // File input
            for (var i = 0; i < value.length; i++) {
              appendField(field.name, value.item(i));
            }
          } else {
            // Other inputs
            appendField(field.name, value);
          }
        });

        this.isSending = true;

        if (data.dataSourceId) {
          Fliplet.Hooks.run('beforeFormSubmit', formData).then(function () {
            return Fliplet.DataSources.connect(data.dataSourceId);
          }).then(function (connection) {
            return connection.insert(formData);
          }).then(function () {
            $vm.reset();
          }, function (err) {
            console.error(err);
            $vm.error = err.message || err.description || err;
            $vm.isSending = false;
          });
        }

        // We might use this code to save the form data locally when going away from the page
        // $(window).unload(function onWindowUnload() {
        //   localStorage.setItem('fl-form-data-' + data.id, this.fields.map(function (field) {
        //     return { name: field.name, value: field.value };
        //   }));
        // });
      }
    },
    mounted: function () {
      $(selector).removeClass('is-loading');

      Fliplet.Hooks.on('beforeFormSubmit', function (data) {
        console.log('[Hook] beforeFormSubmit', data);
      });
    }
  });
});