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
    defaultMapType: {
      type: String,
      default: 'roadmap'
    },
    autocomplete: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Start typing your address..'
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

  mounted: function() {
    this.initAutocomplete('', []);
    this.onChange();
    this.$emit('_input', this.name, this.value, false, true);
    this.initMap();
  },
  methods: {
    selectSuggestion: function(option) {
      this.value = option;
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
        defaultMapType: this.defaultMapType,
        autocomplete: this.autocomplete,
        placeholder: this.placeholder,
        address: this.value
      });
    },
    initAutocomplete: async function(input, countryRestrictions) {
      this.mapAddressField = Fliplet.UI.AddressField(this.$refs.mapAddressLookUp);

      const suggestions =  await this.mapAddressField.getAutocompleteSuggestions(input, countryRestrictions);

      if (typeof this.value === 'object') {
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
        this.value = value;
        this.updateValue();
      });
    }
  },
  watch: {
    value: function(val) {
      if (!this.suggestionSelected) {
        this.initAutocomplete(val, []);
        this.onChange();
      } else {
        this.mapField.set(val);
      }

      this.suggestionSelected = false;
      this.mapAddressField.set(val);
      this.$emit('_input', this.name, val);
    }
  }
});
