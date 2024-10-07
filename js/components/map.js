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
    autocomplete: {
      type: Boolean,
      default: true
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
    // this.onChange();
    this.$emit('_input', this.name, this.value.address, false, true);
    this.initMap();

    if (!this.value.address) {
      this.handleLocationPermissions();
    }
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
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

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

            this.lastChosenAutocompleteValue = selectedSuggestion.label;
            this.selectSuggestion(selectedSuggestion);
            this.activeSuggestionIndex = -1;
          }

          break;

        default:
          break;
      }
    },
    selectSuggestion: function(option) {
      this.value.address = option;
      this.addressSuggestions = [];
      this.suggestionSelected = true;
      this.activeSuggestionIndex = -1;

      this.mapAddressField.set(option.label);
      this.lastChosenAutocompleteValue = option.label;
      this.updateValue();

      // this.onChange();
    },
    initMap: function() {
      this.mapField = Fliplet.UI.MapField(this.$refs.mapField, this.$refs.mapAddressLookUp, {
        enablePin: this.enablePin,
        readOnly: this.readOnly,
        mapType: this.mapType,
        autocomplete: this.autocomplete,
        placeholder: this.placeholder,
        address: this.value.address
      });
    },
    initAutocomplete: async function(input, countryRestrictions) {
      this.mapAddressField = Fliplet.UI.AddressField(this.$refs.mapAddressLookUp);

      this.mapAddressField.change(this.onChange);

      // const suggestions =  await this.mapAddressField.getAutocompleteSuggestions(input, countryRestrictions);

      // if (this.suggestionSelected && this.lastChosenAutocompleteValue === this.value.address.trim()) {
      //   this.addressSuggestions = [];
      //   this.suggestionSelected = true;
      // } else {
      //   this.addressSuggestions = suggestions;
      // }
    },
    handleLocationPermissions: function() {
      this.mapField.handleLocationPermissions();
    },
    onChange: function(value) {
      // if (this.mapField.getAddressChangedByDrag()) {
      //   this.suggestionSelected = true;
      // }

      console.log(this.suggestionSelected, '5555 suggestionSelected');
      console.log(this.mapField.getAddressChangedByDrag(), 'this.mapField.getAddressChangedByDrag()');
      console.log(this.lastChosenAutocompleteValue, 'this.lastChosenAutocompleteValue');
      console.log(value, 'value');


      this.mapAddressField.getAutocompleteSuggestions(value, [])
        .then((suggestions) => {
          if (this.suggestionSelected && this.lastChosenAutocompleteValue === value.trim()) {
            console.log('111111111111111111111111111111111111111');
            this.addressSuggestions = [];
            this.suggestionSelected = true;
          } else {
            console.log('222222222222222222222');

            this.addressSuggestions = suggestions;
          }

          if (value === this.lastChosenAutocompleteValue) {
            this.suggestionSelected = true;

            return;
          }
        });


      // this.value = { address: value || '' };
      // this.updateValue();
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function(val) {
        console.log(val, '3333333333333333 val');

        if (!val.address) {
          val = {
            address: val
          };
        } else if (val.address && val.address.label) {
          val = {
            address: val.address.label
          };
        }


        // if (!this.suggestionSelected && this.lastChosenAutocompleteValue !==  val.address.trim() && !this.mapField.getAddressChangedByDrag()) {
        //   this.initAutocomplete(val.address, []);
        //   // this.onChange();
        // } else {
        console.log(this.suggestionSelected, 'val.this.suggestionSelected');

        if (this.suggestionSelected) {
          this.lastChosenAutocompleteValue = val.address;
          this.mapField.set(val.address);
        }

        this.mapAddressField.set(val.address);
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
