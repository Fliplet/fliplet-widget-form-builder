Fliplet.FormBuilder.field('address', {
  name: 'Address',
  category: 'Location & Map',
  props: {
    placeholder: {
      type: String,
      default: 'Start typing your address...'
    },
    description: {
      type: String
    },
    countryRestrictions: {
      type: Array,
      default: []
    },
    manualInput: {
      type: Boolean,
      default: true
    },
    storeInSeparateFields: {
      type: Boolean,
      default: false
    },
    separateFieldsName: {
      type: Array,
      default: [
        {
          label: 'Street number of the address',
          key: 'streetNumber'
        },
        {
          label: 'Street name of the address',
          key: 'streetName'
        },
        {
          label: 'City name',
          key: 'city'
        },
        {
          label: 'State name',
          key: 'state'
        },
        {
          label: 'Postal code',
          key: 'postalCode'
        },
        {
          label: 'Country',
          key: 'country'
        }
      ]
    },
    fieldOptions: {
      type: Array,
      default: []
    },
    selectedFieldOptions: {
      type: Object,
      default: {}
    },
    addressSuggestions: {
      type: Array,
      default: []
    },
    choosenAddress: {
      type: Object,
      default: {}
    },
    addressComponents: {
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
  created: function() {
    this.separateFieldsName.forEach((field) => {
      if (!this.selectedFieldOptions[field.key]) {
        this.$set(this.selectedFieldOptions, field.key, '');
      }
    });
    this.updateDisabledOptions();

    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  mounted: function() {
    this.initAutocomplete('', this.countryRestrictions);
    this.onChange();
    document.addEventListener('click', this.handleClickOutside);

    this.$emit('_input', this.name, this.value, false, true);
  },
  methods: {
    handleClickOutside: function(event) {
      const suggestionsList = this.$el.querySelector('.google-autocomplete');

      if (suggestionsList && !suggestionsList.contains(event.target) && this.manualInput) {
        this.addressSuggestions = [];
        this.suggestionSelected = false;
      }
    },
    selectSuggestion: async function(option) {
      this.value = option;
      this.addressSuggestions = [];
      this.suggestionSelected = true;

      const data = await this.addressField.getAddressComponents(option.id);

      this.addressComponents = data;

      this.addressField.set(option.label);
      this.updateValue();

      this.onChange();
    },
    extractAddressComponents: function(place) {
      const addressData = {
        streetNumber: '',
        streetName: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      };

      for (const component of place) {
        const { types, long_name: longName } = component;

        for (const type of types) {
          switch (type) {
            case 'street_number':
              addressData.streetNumber = longName;
              break;
            case 'route':
              addressData.streetName = longName;
              break;
            case 'locality':
              addressData.city = longName;
              break;
            case 'administrative_area_level_1':
              addressData.state = longName;
              break;
            case 'country':
              addressData.country = longName;
              break;
            case 'postal_code':
              addressData.postalCode = longName;
              break;

            default:
              break;
          }
        }
      }

      return addressData;
    },
    assignValuesToSeparateFields: function(place, separateFieldsName) {
      const addressData = this.extractAddressComponents(place);

      separateFieldsName.forEach(field => {
        field.value = addressData[field.key];
      });
    },
    updateSelectedFieldsProperty: function(attr, value) {
      if (attr === 'readonly') {
        value = !value;
      }

      const fields = this.$parent.fields;
      const selectedValues = Object.values(this.selectedFieldOptions);

      fields.forEach(field => {
        if (selectedValues.includes(field.name)) {
          field[attr] = value;
        }
      });
    },
    updateDisabledOptions: function() {
      const selectedValues = Object.values(this.selectedFieldOptions);

      this.fieldOptions.forEach(option => {
        if (selectedValues.includes(option.label)) {
          option.disabled = true;
        } else {
          option.disabled = false;
        }
      });
    },
    resetOptionsOnSelectOne: function(key) {
      if (this.selectedFieldOptions[key] === '') {
        this.updateDisabledOptions();
      }
    },
    initAutocomplete: async function(input, countryRestrictions) {
      this.addressField = Fliplet.UI.AddressField(this.$refs.addressField);

      const suggestions = await this.addressField.getAutocompleteSuggestions(input, countryRestrictions);

      if (typeof this.value === 'object') {
        this.addressSuggestions = [];
        this.suggestionSelected = true;
      } else {
        this.addressSuggestions = suggestions;
      }
    },
    onChange: function() {
      this.addressField.change((value) => {
        if (this.addressComponents.length) {
          this.assignValuesToSeparateFields(this.addressComponents, this.separateFieldsName);

          for (const key in this.selectedFieldOptions) {
            if (!this.selectedFieldOptions[key]) continue;

            const matchedField = this.separateFieldsName.find(field => field.key === key);
            const fieldName = this.selectedFieldOptions[key];

            if (!matchedField) continue;

            Fliplet.FormBuilder.get()
              .then(function(form) {
                form.field(fieldName).set(matchedField.value);
              });
          }
        }

        this.updateSelectedFieldsProperty('readonly', this.manualInput);


        if (!this.manualInput && this.addressComponents.length) {
          this.suggestionSelected = true;
          this.value = value;
          this.updateValue();
        } else {
          this.value = value;
          this.updateValue();
        }

        this.suggestionSelected = true;
      });
    },
    onBeforeSubmit: function(data) {
      const value = this.lastChosenAutocompleteValue;

      if (!this.manualInput) {
        if (data.hasOwnProperty(this.name)) {
          data[this.name] = value;
        }
      }

      this.updateSelectedFieldsProperty('value', '');
    }
  },
  watch: {
    value: function(val) {
      if (typeof val === 'object') {
        this.lastChosenAutocompleteValue = val.label;
        this.suggestionSelected = true;
        val = val.label;
      } else {
        this.initAutocomplete(val, this.countryRestrictions);
        this.onChange();
      }

      this.addressField.set(val);
      this.$emit('_input', this.name, val);
    },
    selectedFieldOptions: {
      handler: function(newVal) {
        this.updateDisabledOptions();

        for (let key in newVal) {
          if (newVal.hasOwnProperty(key)) {
            this.resetOptionsOnSelectOne(key);
          }
        }
      },
      deep: true
    }
  }
});
