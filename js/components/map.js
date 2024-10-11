Fliplet.FormBuilder.field('map', {
  name: 'Map',
  category: 'Location & Map',
  props: {
    enablePin: {
      type: Boolean,
      default: true
    },
    description: {
      type: String
    },
    mapType: {
      type: String,
      default: ''
    },
    autoCollectUserLocation: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Start typing your address...'
    },
    addressSuggestions: {
      type: Array,
      default: []
    },
    suggestionSelected: {
      type: Boolean,
      default: false
    },
    activeSuggestionIndex: {
      type: Number,
      default: -1
    },
    hasSelectOnMapOption: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      lastChosenAutocompleteValue: ''
    };
  },
  mounted: function() {
    this.initAutocomplete('', []);
    this.$emit('_input', this.name, this.value.address, false, true);
    this.initMap();
    this.value = {
      address: this.value.address || '',
      latLong: this.value.latLong || null
    };
  },
  methods: {
    handleKeyDown: function(event) {
      const suggestionsCount = this.addressSuggestions.length;

      if (!suggestionsCount) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();

          if (this.activeSuggestionIndex < suggestionsCount - 1) {
            this.activeSuggestionIndex += 1;
          }

          break;

        case 'ArrowUp':
          event.preventDefault();

          if (this.activeSuggestionIndex > 0) {
            this.activeSuggestionIndex -= 1;
          }

          break;

        case 'Enter':
          event.preventDefault();

          if (this.activeSuggestionIndex >= 0) {
            const selectedSuggestion = this.addressSuggestions[this.activeSuggestionIndex];

            this.lastChosenAutocompleteValue = selectedSuggestion;
            this.selectSuggestion(selectedSuggestion);
            this.activeSuggestionIndex = -1;
          }

          break;

        default:
          this.suggestionSelected = false;
          break;
      }
    },
    handleFocus: function(e) {
      if (!e.target.value && !this.readonly) {
        this.addressSuggestions = [{
          id: null,
          label: 'Select location on map'
        }];
      }
    },
    updateAddressSuggestions: function() {
      if (this.hasSelectOnMapOption) {
        this.addressSuggestions = [];
        this.hasSelectOnMapOption = false;
        return;
      }

      this.addressSuggestions = [{ id: null, label: 'Select location on map' }];
    },
    selectSuggestion: function(option) {
      if (option.label === 'Select location on map') {
        this.getAddressFromMap();
        Fliplet.UI.Toast.dismiss();
        this.hasSelectOnMapOption = true;
        return;
      }

      this.value.address = option;
      this.addressSuggestions = [];
      this.suggestionSelected = true;
      this.activeSuggestionIndex = -1;

      this.mapAddressField.set(option.label);
      this.lastChosenAutocompleteValue = option.label;
      this.mapField.set(option.label);
      this.updateValue();
    },
    getAddressFromMap: function() {
      this.addressSuggestions = [];
      this.mapAddressField.clear();
      this.mapField.clear();
    },
    displayAddressNotFoundToast: function() {
      Fliplet.UI.Toast({
        type: 'minimal',
        message: "We couldn't find the address. Please double-check and re-enter the correct details.",
        actions: [{
          label: 'Dismiss',
          action: () => {
            Fliplet.UI.Toast.dismiss();
          }
        }],
        duration: false,
        tapToDismiss: false
      });
    },
    initMap: function() {
      this.mapField = Fliplet.UI.MapField(this.$refs.mapField, this.$refs.mapAddressLookUp, {
        enablePin: this.enablePin,
        readonly: this.readonly,
        mapType: this.mapType,
        autoCollectUserLocation: this.autoCollectUserLocation,
        placeholder: this.placeholder,
        address: this.value.address
      });
    },
    initAutocomplete: async function() {
      this.mapAddressField = Fliplet.UI.AddressField(this.$refs.mapAddressLookUp);

      this.mapAddressField.change(this.onChange);
    },
    handleLocationPermissions: function() {
      this.mapField.handleLocationPermissions();
    },
    onChange: function(value) {
      this.mapAddressField.getAutocompleteSuggestions(value, [])
        .then((suggestions) => {
          if (suggestions[0]?.label !== 'Select location on map') {
            suggestions.unshift({ id: null, label: 'Select location on map' });
          }

          if (value === this.lastChosenAutocompleteValue) {
            this.suggestionSelected = true;
          }

          if (this.suggestionSelected && this.lastChosenAutocompleteValue === value.trim()) {
            this.value = this.mapField.getTotalAddress();
            this.updateAddressSuggestions();
          } else if (this.mapField.getAddressChangedByDrag()) {
            this.updateAddressSuggestions();
            this.mapField.getAddressChangedByDrag(false);
            this.value = this.mapField.getTotalAddress();
            this.suggestionSelected = false;
          } else {
            if (suggestions.length === 1 && value.trim() !== '') {
              this.addressSuggestions.unshift({ id: null, label: 'Select location on map' });
              this.displayAddressNotFoundToast();
            } else {
              Fliplet.UI.Toast.dismiss();
            }

            this.addressSuggestions = suggestions;
            this.suggestionSelected = false;
          }
        });
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function(val) {
        if (!val.address) {
          val = {
            address: val
          };
        } else if (val.address && val.address.label) {
          val = {
            address: val.address.label
          };
        }


        if (this.suggestionSelected && !this.lastChosenAutocompleteValue && !this.mapField.getAddressChangedByDrag()) {
          this.suggestionSelected = false;
        }

        this.$emit('_input', this.name, val);
      }
    },
    addressSuggestions: function(newSuggestions) {
      if (newSuggestions.length) {
        this.activeSuggestionIndex = -1;
      }
    }
  }
});
