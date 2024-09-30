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
    this.onChange();
    this.$emit('_input', this.name, this.value.address, false, true);
    this.initMap();
  },
  methods: {
    selectSuggestion: function(option) {
      this.value.address = option;
      this.addressSuggestions = [];
      this.suggestionSelected = true;

      this.mapAddressField.set(option.label);
      this.updateValue();

      this.onChange();
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

      const suggestions =  await this.mapAddressField.getAutocompleteSuggestions(input, countryRestrictions);

      if (typeof this.value.address === 'object') {
        this.addressSuggestions = [];
        this.suggestionSelected = true;
      } else {
        this.addressSuggestions = suggestions;
      }
    },
    handleLocationPermissions: function() {
      this.mapField.handleLocationPermissions();
    },
    onChange: function() {
      this.mapAddressField.change((value) => {
        this.value = { address: value };
        this.updateValue();
      });
    }
  },
  watch: {
    value: function(val) {
      if (!this.suggestionSelected &&  this.lastChosenAutocompleteValue !== val.address.trim()) {
        this.initAutocomplete(val.address, []);
        this.onChange();
      } else {
        this.lastChosenAutocompleteValue = val.address;
        this.mapField.set(val.address);
      }

      this.suggestionSelected = false;
      this.mapAddressField.set(val.address);
      this.$emit('_input', this.name, val.address);
    }
  }
});
