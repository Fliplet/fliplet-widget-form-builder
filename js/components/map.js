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

      const suggestions =  await this.mapAddressField.getAutocompleteSuggestions(input, countryRestrictions);

      console.log(this.suggestionSelected, '33333333333333333333333 this.suggestionSelected');

      if (this.suggestionSelected &&  this.lastChosenAutocompleteValue === this.value.address.trim()) {
        console.log('sssssssssssssssssssssssssssssss44444444444444444444444444');
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
        console.log(value, this.lastChosenAutocompleteValue, '000000zzzzzzzzzzxxxxxxxxxxxxxxx;;;;;;;;;;;;;;;');

        if (value === this.lastChosenAutocompleteValue) {
          this.suggestionSelected = false;

          return;
        }

        this.value = { address: value };
        this.updateValue();
      });
    }
  },
  watch: {
    value: function(val) {
      console.log('suggestionSelected', this.suggestionSelected);
      console.log('lastChosenAutocompleteValue', this.lastChosenAutocompleteValue);

      console.log('al.address.trim', val.address.trim());

      if (!this.suggestionSelected &&  this.lastChosenAutocompleteValue !== val.address.trim()) {
        console.log('88888888888888888888888888888888888888888');
        this.initAutocomplete(val.address, []);
        this.onChange();
      } else {
        console.log('999999999999999999999999999999999999999999');

        this.lastChosenAutocompleteValue = val.address;
        this.mapField.set(val.address);
      }

      this.suggestionSelected = false;
      this.mapAddressField.set(val.address);
      this.$emit('_input', this.name, val.address);
    }
  }
});
