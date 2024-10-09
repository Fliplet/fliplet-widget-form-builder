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
    readOnly: {
      type: Boolean,
      default: false
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

    // if (!this.value.address) {
    //   this.handleLocationPermissions();
    // }
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
    selectSuggestion: function(option) {
      if (option.label === 'Select location on map') {
        this.getAddressFromMap();

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
    initMap: function() {
      this.mapField = Fliplet.UI.MapField(this.$refs.mapField, this.$refs.mapAddressLookUp, {
        enablePin: this.enablePin,
        readOnly: this.readOnly,
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
      if (value === this.lastChosenAutocompleteValue) {
        this.suggestionSelected = true;
      }

      this.mapAddressField.getAutocompleteSuggestions(value, [])
        .then((suggestions) => {
          if (suggestions.length && suggestions[0].label !== 'Select location on map') {
            suggestions.unshift({ id: null, label: 'Select location on map' });
          }

          if (this.suggestionSelected && this.lastChosenAutocompleteValue === value.trim()) {
            this.value = this.mapField.getTotalAddress();
            this.addressSuggestions = [];
          } else if (this.mapField.getAddressChangedByDrag()) {
            this.addressSuggestions = [];
            this.mapField.getAddressChangedByDrag(false);
            this.value = this.mapField.getTotalAddress();
            this.suggestionSelected = false;
          } else {
            this.addressSuggestions = suggestions;
            this.suggestionSelected = false;
            this.value = { address: value || '' };
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
