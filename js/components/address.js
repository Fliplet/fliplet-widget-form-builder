/**
 * Address field component – renders a smart address autocomplete field in forms.
 * Supports Google Places API integration and manual address input options.
 */
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
      default: function() {
        return {
          streetNumber: '',
          streetName: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        };
      }
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
  created: function() {
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);

    this.separateFieldsName.forEach((field) => {
      if (!this.selectedFieldOptions[field.key]) {
        this.$set(this.selectedFieldOptions, field.key, '');
      }
    });
    this.updateDisabledOptions();
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  mounted: function() {
    this.initAutocomplete('', this.countryRestrictions);
    this.onChange();
    document.addEventListener('click', this.handleClickOutside);

    this.$emit('_input', this.name, this.value, false, true);

    if (this.value) {
      this.addressField.set(this.value);
    }

    if (!this.manualInput) {
      this.updateSelectedFieldsProperty('readonly', this.manualInput);
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
      this.activeSuggestionIndex = -1;

      const data = await this.addressField.getAddressComponents(option.id);

      this.addressComponents = data;

      this.addressField.set(option.label);
      this.lastChosenAutocompleteValue = option.label;
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
            case 'postal_town':
              if (!addressData.city) {
                addressData.city = longName;
              }

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
    updateSelectedFieldsOptions: function() {
      Object.keys(this.selectedFieldOptions).forEach(key => {
        const selectedFieldLabel = this.selectedFieldOptions[key];
        const isValidOption = this.fieldOptions.find(option => option.label === selectedFieldLabel);

        if (!isValidOption) {
          this.selectedFieldOptions[key] = '';
        }
      });
    },
    updateFieldOptions: function() {
      const fields = this.$parent.fields;

      this.fieldOptions = fields.map(function(field) {
        if (field._type !== 'flButtons' && field._type !== 'flAddress') {
          return { label: field.label, disabled: false };
        }
      }).filter(Boolean);
    },
    updateDisabledOptions: function() {
      this.updateFieldOptions();
      this.updateSelectedFieldsOptions();

      const assignedValues = Object.values(this.selectedFieldOptions)
        .filter(value => value && this.fieldOptions.some(option => option.label === value))
        .map(value => value);

      this.fieldOptions.forEach(option => {
        option.disabled = assignedValues.includes(option.label);
      });
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

            const fields = this.$parent.fields;

            fields.forEach(field =>{
              if (field.label === fieldName) {
                field.value = matchedField.value;
              }
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
  validations: function() {
    const rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  watch: {
    value: function(val) {
      if (typeof val === 'object') {
        this.lastChosenAutocompleteValue = val.label;
        this.suggestionSelected = true;
        val = val.label;
      } else if (val.trim() !== this.lastChosenAutocompleteValue) {
        this.initAutocomplete(val, this.countryRestrictions);
        this.onChange();
      }

      this.addressField.set(val);
      this.$emit('_input', this.name, val);
    },
    addressSuggestions: function(newSuggestions) {
      if (newSuggestions.length) {
        this.activeSuggestionIndex = -1;
      }
    }
  }
});
