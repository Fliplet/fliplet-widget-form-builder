Fliplet.FormBuilder.field('geolocation', {
  name: 'Geolocation',
  category: 'Advanced',
  props: {
    value: {
      type: String
    },
    description: {
      type: String
    },
    autofill: {
      type: Boolean,
      default: false
    },
    preciseLocationRequired: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      firstTimeSaved: false,
      isLoading: false,
      buttonClicked: false
    };
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  mounted: function() {
    if (this.autofill) {
      this.getLocation();
    }
  },
  created: function() {
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  methods: {
    setValue: function(result) {
      return `${result.coords.latitude}, ${result.coords.longitude}`;
    },
    getLocation: function() {
      var $vm = this;

      $vm.buttonClicked = true;
      $vm.isLoading = true;

      var location = Fliplet.Navigator.location({
        maximumAge: 0,
        timeout: 30000,
        enableHighAccuracy: true
      });

      location.then(function(result) {
        $vm.value = $vm.setValue(result);

        setTimeout(function() {
          $vm.isLoading = false;
          $vm.firstTimeSaved = true;
        }, 3000);
      }).catch(function(err) {
        $vm.openToastMessage(err.code);
      });
    },
    updateLocation: function() {
      var $vm = this;

      $vm.buttonClicked = true;
      $vm.isLoading = true;

      var location = Fliplet.Navigator.location({
        maximumAge: 0,
        timeout: 30000,
        enableHighAccuracy: true
      });

      location.then(function(res) {
        $vm.value = $vm.setValue(res);

        setTimeout(function() {
          $vm.isLoading = false;
        }, 3000);
      }).catch(function(err) {
        $vm.openToastMessage(err.code);
      });
    },
    getErrorMessage: function(code) {
      switch (code) {
        case 'PERMISSION_DENIED':
          return T('widgets.form.geolocation.permissionDenied');
        case 'POSITION_UNAVAILABLE':
          return T('widgets.form.geolocation.positionUnavailable');
        case 'TIMEOUT':
          return T('widgets.form.geolocation.timeout');
        case 'UNKNOWN_ERROR':
          return T('widgets.form.geolocation.unknownError');
        default:
          break;
      }
    },
    openToastMessage: function(code) {
      var permission = Fliplet.Navigator.supportsAppSettings();

      Fliplet.UI.Toast({
        type: 'minimal',
        message: this.getErrorMessage(code),
        actions: code === 'PERMISSION_DENIED' && permission ? [{
          label: 'SETTINGS',
          action: function() {
            Fliplet.Navigator.openAppSettings();
          }
        }] : null,
        duration: false, // Ensures the toast message doesn't auto-dismiss
        tapToDismiss: false // Ensures the toast message is only dismissed through the action button
      });
    },
    onBeforeSubmit: function() {
      if (!this.value || this.value === '') {
        Fliplet.UI.Toast({
          type: 'regular',
          message: 'Loading location ...',
          actions: [
            {
              label: 'Ok',
              action: function() {
                Fliplet.UI.Toast.dismiss();
              }
            }
          ]
        });

        return Promise.reject('');
      }
    }
  },
  watch: {
    value: function(val) {
      this.$emit('_input', this.name, val, false, true);
    }
  }
});
