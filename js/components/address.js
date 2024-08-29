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
      var addressData = {
        streetNumber: '',
        streetName: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      };

      if (place.length) {
        place.forEach(component => {
          var types = component.types;

          if (types.includes('street_number')) {
            addressData.streetNumber = component.long_name;
          }

          if (types.includes('route')) {
            addressData.streetName = component.long_name;
          }

          if (types.includes('locality')) {
            addressData.city = component.long_name;
          }

          if (types.includes('administrative_area_level_1')) {
            addressData.state = component.long_name;
          }

          if (types.includes('country')) {
            addressData.country = component.long_name;
          }

          if (types.includes('postal_code')) {
            addressData.postalCode = component.long_name;
          }
        });
      }

      return addressData;
    },
    assignValuesToSeparateFields: function(place, separateFieldsName) {
      var addressData = this.extractAddressComponents(place);

      separateFieldsName.forEach(field => {
        field.value = addressData[field.key];
      });
    },
    updateSelectedFieldsProperty: function(attr, value) {
      if (attr === 'readonly') {
        value = !value;
      }

      var fields = this.$parent.fields;
      var selectedValues = Object.values(this.selectedFieldOptions);

      fields.forEach(field => {
        if (selectedValues.includes(field.name)) {
          field[attr] = value;
        }
      });
    },
    updateDisabledOptions: function() {
      var selectedValues = Object.values(this.selectedFieldOptions);

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
      await this.addressField.getAutocompleteSuggestions(input, countryRestrictions)
        .then(suggestions => {
          if (typeof this.value === 'object') {
            this.addressSuggestions = [];
            this.suggestionSelected = true;
          } else {
            this.addressSuggestions = suggestions;
          }
        });
    },
    onChange: function() {
      var $vm = this;

      this.addressField.change((value) => {
        if (this.addressComponents.length) {
          this.assignValuesToSeparateFields(this.addressComponents, this.separateFieldsName);

          for (const key in this.selectedFieldOptions) {
            if (this.selectedFieldOptions[key]) {
              var matchedField = this.separateFieldsName.find(field => field.key === key);
              var fieldName = this.selectedFieldOptions[key];

              if (matchedField) {
                (function(fieldName, matchedFieldValue) {
                  Fliplet.FormBuilder.get()
                    .then(function(form) {
                      form.field(fieldName).set(matchedFieldValue);
                    });
                })(fieldName, matchedField.value);
              }
            }
          }
        }

        this.updateSelectedFieldsProperty('readonly', this.manualInput);


        if (!$vm.manualInput && this.addressComponents.length) {
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
      var $vm = this;
      var value = $vm.lastChosenAutocompleteValue;

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
      var $vm = this;

      if (typeof val === 'object') {
        $vm.lastChosenAutocompleteValue = val.label;
        $vm.suggestionSelected = true;
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

        for (var key in newVal) {
          if (newVal.hasOwnProperty(key)) {
            this.resetOptionsOnSelectOne(key);
          }
        }
      },
      deep: true
    }
  }
});
