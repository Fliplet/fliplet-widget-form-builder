/**
 * Geolocation field component – captures and stores user's GPS coordinates in forms.
 * Automatically detects location using device GPS with user permission.
 */
Fliplet.FormBuilder.field('geolocation', {
  name: 'Geolocation',
  category: 'Location & Map',
  props: {
    value: {
      type: Array,
      default: null
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
      showFeedback: false,
      timeOut: null,
      errorOccurred: false
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

    if (this.value && this.value.length) {
      this.firstTimeSaved = true;
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
      if (!result || !result.coords) {
        this.value = null;

        return;
      }

      this.value = [
        `${result.coords.latitude},${result.coords.longitude}`,
        result.coords.accuracy
      ];
    },
    getDeviceLocation: function() {
      return Fliplet.Navigator.location({
        maximumAge: 0,
        timeout: 30000,
        enableHighAccuracy: true
      });
    },
    getLocation: function() {
      var $vm = this;

      $vm.showFeedback = true;
      $vm.isLoading = true;
      $vm.errorOccurred = false;

      var location = this.getDeviceLocation();

      location.then(function(result) {
        $vm.setValue(result);
        $vm.firstTimeSaved = true;
        $vm.isLoading = false;

        this.timeOut = setTimeout(function() {
          $vm.showFeedback = false;
        }, 3000);
      }).catch(function(err) {
        $vm.isLoading = false;
        $vm.showFeedback = false;
        $vm.openToastMessage(err);
      });
    },
    updateLocation: function() {
      this.timeOut = undefined;

      var $vm = this;
      var location = this.getDeviceLocation();

      $vm.showFeedback = true;
      $vm.isLoading = true;
      $vm.errorOccurred = false;

      location.then(function(res) {
        $vm.setValue(res);
        $vm.isLoading = false;

        clearTimeout(this.timeOut);

        this.timeOut = setTimeout(function() {
          $vm.showFeedback = false;
        }, 3000);
      }).catch(function(err) {
        $vm.isLoading = false;
        $vm.showFeedback = false;
        $vm.openToastMessage(err);
      });
    },
    getErrorMessage: function(error) {
      error = error || {};

      switch (error.code) {
        case -1:
          return T('widgets.form.geolocation.errors.locationRequired');
        case 0:
          return T('widgets.form.geolocation.errors.unknownError');
        case 1:
          return T('widgets.form.geolocation.errors.permissionDenied');
        case 2:
          return T('widgets.form.geolocation.errors.positionUnavailable');
        case 3:
          return T('widgets.form.geolocation.errors.timeout');
        case 'inaccurateCoords':
          return T('widgets.form.geolocation.errors.inaccurateCoords');
        default:
          return T('widgets.form.geolocation.errors.unknownError');
      }
    },
    openToastMessage: function(error) {
      var supportsSettings = Fliplet.Navigator.supportsAppSettings();

      this.errorOccurred = true;

      Fliplet.UI.Toast({
        type: 'minimal',
        message: this.getErrorMessage(error),
        actions: (error.code === 1 || error.code === 'inaccurateCoords') && supportsSettings
          ? [{
            label: T('widgets.form.geolocation.settings'),
            action: function() {
              Fliplet.Navigator.openAppSettings();
            }
          }]
          : null,
        duration: false, // Ensures the toast message doesn't auto-dismiss
        tapToDismiss: false // Ensures the toast message is only dismissed through the action button
      });
    },
    onBeforeSubmit: function() {
      if (this.isLoading) {
        Fliplet.UI.Toast({
          type: 'regular',
          message: T('widgets.form.geolocation.loadingLocation'),
          actions: [
            {
              label: T('widgets.form.geolocation.accept'),
              action: function() {
                Fliplet.UI.Toast.dismiss();
              }
            }
          ]
        });

        return Promise.reject('');
      } else if (this.preciseLocationRequired && this.value && this.value[0] && this.value[1] > 100) {
        var error = {
          code: 'inaccurateCoords'
        };

        this.openToastMessage(error);

        return Promise.reject('');
      } else if (this.errorOccurred) {
        return Promise.reject('');
      }
    },
    onReset: function(data) {
      if (data.id === this.$parent.id) {
        this.firstTimeSaved = false;
        this.showFeedback = false;
      }
    }
  },
  watch: {
    value: function(val) {
      this.firstTimeSaved = !!this.value;

      this.$emit('_input', this.name, val, false, true);
    }
  }
});
