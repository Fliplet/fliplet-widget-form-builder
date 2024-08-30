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

    console.log(this.mapAddressField.get(), 'pppppppppppppppppppppppppppppp');
    Fliplet.UI.MapField(this.$refs.mapField, {
      enablePin: true,
      readOnly: false,
      defaultMapType: 'roadmap',
      autocomplete: true,
      placeholder: 'Enter address or select on the map',
      address: this.value
    });


    var mapField = Fliplet.UI.MapField.get(this.$refs.mapField);

    // Example of setting a value
    mapField.set('1600 Amphitheatre Parkway, Mountain View, CA');

    // // Example of clearing the value
    // mapField.clear();

    // // Example of adding a change listener
    // mapField.change(function(value) {
    //   console.log('Map value changed:', value);
    // });
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
    initAutocomplete: async function(input, []) {
      this.mapAddressField = Fliplet.UI.AddressField(this.$refs.mapAddressLookUp);

      const suggestions =  await this.mapAddressField.getAutocompleteSuggestions(input, []);

      if (typeof this.value === 'object') {
        this.addressSuggestions = [];
        this.suggestionSelected = true;
      } else {
        this.addressSuggestions = suggestions;
      }
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
      }

      this.suggestionSelected = false;
      this.mapAddressField.set(val);
      this.$emit('_input', this.name, val);
    }
  }
});
