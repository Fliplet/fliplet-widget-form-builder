Fliplet.FormBuilder.field('map', {
  name: 'Map',
  category: 'Location & Map',
  props: {
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
    isSelectOnMapClicked: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      lastChosenAutocompleteValue: ''
    };
  },
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  mounted: function() {
    this.initAutocomplete('', []);

    if (this.value.latLong) {
      this.$emit('_input', this.name, this.value, false, true);
    }

    this.initMap();
    this.value = {
      address: this.value.address || '',
      latLong: this.value.latLong || null
    };
    document.addEventListener('click', this.handleClickOutside);

    setTimeout(() => {
      if (!this.value.address && (this.autoCollectUserLocation || this.readonly)) {
        this.mapField.handleLocationPermissions();
      }
    }, 3000);

    this.updateValue();
  },
  methods: {
    handleInput: function(e) {
      const value = {
        address: e.target.value,
        latLong: null
      };

      this.$emit('_input', this.name, value);
      this.mapField.clear();
    },
    handleClickOutside: function(e) {
      const suggestionsList = this.$el.querySelector('.google-autocomplete');

      if (suggestionsList && !suggestionsList.contains(e.target)) {
        this.addressSuggestions = [];
        this.suggestionSelected = false;
      }
    },
    handleKeyDown: function(e) {
      const suggestionsCount = this.addressSuggestions.length;

      if (!suggestionsCount) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();

          if (this.activeSuggestionIndex < suggestionsCount - 1) {
            this.activeSuggestionIndex += 1;
          }

          break;

        case 'ArrowUp':
          e.preventDefault();

          if (this.activeSuggestionIndex > 0) {
            this.activeSuggestionIndex -= 1;
          }

          break;

        case 'Enter':
          e.preventDefault();

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
    updateAddressSuggestions: function() {
      if (this.isSelectOnMapClicked) {
        this.addressSuggestions = [];
        this.isSelectOnMapClicked = false;

        return;
      }

      this.addressSuggestions = [{ id: null, label: 'Select location on map' }];
    },
    selectSuggestion: function(option) {
      if (option.label === 'Select location on map') {
        this.clearAddressAndMapValues();
        Fliplet.UI.Toast.dismiss();
        this.isSelectOnMapClicked = true;

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
    clearAddressAndMapValues: function() {
      this.addressSuggestions = [];
      this.mapAddressField.clear();
      this.mapField.clear();
      this.value = {
        address: '',
        latLong: null
      };
      this.$emit('_input', this.name, this.value, false, true);
    },
    initMap: function() {
      this.mapField = Fliplet.UI.MapField(this.$refs.mapField, this.$refs.mapAddressLookUp, {
        readonly: this.readonly,
        mapType: this.mapType,
        value: this.value
      });
    },
    initAutocomplete: async function() {
      this.mapAddressField = Fliplet.UI.AddressField(this.$refs.mapAddressLookUp);

      this.mapAddressField.change(this.onChange);
    },
    onChange: function(value) {
      if (this.readonly) {
        return;
      }

      if (!value) {
        this.mapField.clear();

        return;
      }

      this.mapAddressField.getAutocompleteSuggestions(value, [])
        .then((suggestions) => {
          if (suggestions.length && suggestions[0].label !== 'Select location on map') {
            suggestions.unshift({ id: null, label: 'Select location on map' });
          } else if (!suggestions.length) {
            suggestions.unshift({ id: null, label: 'Select location on map' });
          }

          if (value.length > 1 && value === this.lastChosenAutocompleteValue) {
            this.suggestionSelected = true;
          } else {
            this.suggestionSelected = false;
          }

          if (this.suggestionSelected && this.lastChosenAutocompleteValue === value.trim()) {
            this.value = this.mapField.getTotalAddress();
            this.updateAddressSuggestions();
          } else if (this.mapField.checkIfAddressChangedByDragging()) {
            this.updateAddressSuggestions();
            this.mapField.checkIfAddressChangedByDragging(false);
            this.value = {
              address: value,
              latLong: `${this.mapField.get().lat}/${this.mapField.get().lng}`
            };
            this.suggestionSelected = false;
          } else {
            if (suggestions.length === 1 && value.trim() !== '') {
              if (this.addressSuggestions.length && this.addressSuggestions[0].label === 'Select location on map') {
                this.addressSuggestions.unshift({ id: null, label: 'Select location on map' });
              }

              this.mapField.displayToastMessage("We couldn't find the address. Please double-check and re-enter the correct details.");
            } else {
              Fliplet.UI.Toast.dismiss();
            }

            this.addressSuggestions = suggestions;
            this.suggestionSelected = false;
          }

          this.$emit('_input', this.name, this.value, false, true);
        });
    },
    onReset: function() {
      this.clearAddressAndMapValues();
    }
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = function() {
        return  !!(this.value && this.value.address);
      };
    }

    return rules;
  },
  watch: {
    value: {
      deep: true,
      handler: function(val) {
        if (!val) {
          return;
        }

        if (val.address && val.address.label) {
          val = {
            address: val.address.label
          };
        }

        if (val.address && !this.suggestionSelected && !this.lastChosenAutocompleteValue && !this.readonly) {
          if (val.latLong) {
            this.mapAddressField.set(val.address);
            this.mapField.set(val.address);
          } else {
            this.mapAddressField.set(val.address);
          }

          this.suggestionSelected = true;
          this.lastChosenAutocompleteValue = val.address;
          this.addressSuggestions = [];
          this.isSelectOnMapClicked = true;

          return;
        }

        if (val.address === '' && !this.readonly && !this.autoCollectUserLocation) {
          this.mapAddressField.clear();
          this.mapField.clear();
          this.addressSuggestions = [];
        }

        if (this.suggestionSelected && !this.lastChosenAutocompleteValue && !this.mapField.checkIfAddressChangedByDragging()) {
          this.suggestionSelected = false;
        }

        this.$emit('_input', this.name, this.value, false, true);
      }
    },
    addressSuggestions: function(newSuggestions) {
      if (newSuggestions.length) {
        this.activeSuggestionIndex = -1;
      }
    }
  }
});
