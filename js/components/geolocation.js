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
    }
  },
  watch: {
    value: function(val) {
      this.$emit('_input', this.name, val, false, true);
    }
  }
});
