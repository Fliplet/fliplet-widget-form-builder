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
    selectSuggestion: function(option) {
      this.value.address = option;
      this.addressSuggestions = [];
      this.suggestionSelected = true;

      this.mapAddressField.set(option.label);
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
      if (this.mapField.getAddressChangedByDrag()) {
        this.suggestionSelected = true;
      }

      this.mapAddressField.getAutocompleteSuggestions(value, [])
        .then((suggestions) => {
          debugger;

          if (this.suggestionSelected && this.lastChosenAutocompleteValue === value.trim()) {
            this.addressSuggestions = [];
            this.suggestionSelected = true;
          } else {
            this.addressSuggestions = suggestions;
          }

          if (value === this.lastChosenAutocompleteValue) {
            this.suggestionSelected = false;

            return;
          }
        });


      // this.value = { address: value || '' };
      // this.updateValue();
    }
  },
  watch: {
    value: function(val) {
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


      if (this.suggestionSelected) {
        this.lastChosenAutocompleteValue = val.address;
        this.mapField.set(val.address);
      }

      this.suggestionSelected = false;
      this.mapAddressField.set(val.address);
      this.$emit('_input', this.name, val);
    }
  }
});
