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
      buttonClicked: false,
      accuracy: null
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
    Fliplet.FormBuilder.on('reset', this.onReset);
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
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
        $vm.accuracy = result.coords.accuracy;
        $vm.value = $vm.setValue(result);
        $vm.firstTimeSaved = true;
        $vm.isLoading = false;

        setTimeout(function() {
          $vm.buttonClicked = false;
        }, 3000);
      }).catch(function(err) {
        $vm.isLoading = false;
        $vm.buttonClicked = false;
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
        $vm.accuracy = res.coords.accuracy;
        $vm.value = $vm.setValue(res);
        $vm.isLoading = false;

        setTimeout(function() {
          $vm.buttonClicked = false;
        }, 3000);
      }).catch(function(err) {
        $vm.isLoading = false;
        $vm.buttonClicked = false;
        $vm.openToastMessage(err.code);
      });
    },
    getErrorMessage: function(code) {
      switch (code) {
        case 0:
          return T('widgets.form.geolocation.unknownError');
        case 1:
          return T('widgets.form.geolocation.permissionDenied');
        case 2:
          return T('widgets.form.geolocation.positionUnavailable');
        case 3:
          return T('widgets.form.geolocation.timeout');
        case 'inaccurateCoords':
          return T('widgets.form.geolocation.inaccurateCoords');
        default:
          break;
      }
    },
    openToastMessage: function(code) {
      var supportsSettings = Fliplet.Navigator.supportsAppSettings();

      Fliplet.UI.Toast({
        type: 'minimal',
        message: this.getErrorMessage(code),
        actions: (code === 1 || code === 'inaccurateCoords') && supportsSettings ? [{
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
      if (this.isLoading) {
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
      } else if (this.preciseLocationRequired && this.accuracy > 100) {
        this.openToastMessage('inaccurateCoords');

        return Promise.reject('');
      } else if (!this.value && !this.required) {
        this.value = 'No data provided';
      }
    },
    onReset: function() {
      this.firstTimeSaved = false;
      this.buttonClicked = false;
    }
  },
  watch: {
    value: function(val) {
      this.$emit('_input', this.name, val, false, true);
    }
  }
});
