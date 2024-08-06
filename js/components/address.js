Fliplet.FormBuilder.field('address', {
  name: 'Address',
  category: 'Location & Map',
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    },
    countryRestrictions: { // Restricting the search predictions
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
          key: 'streetNumber',
          value: null
        },
        {
          label: 'Street name of the address',
          key: 'streetName',
          value: null
        },
        {
          label: 'City name',
          key: 'city',
          value: null
        },
        {
          label: 'State name',
          key: 'state',
          value: null
        },
        {
          label: 'Postal code',
          key: 'postCode',
          value: null
        },
        {
          label: 'Country',
          key: 'country',
          value: null
        }
      ]
    },
    fieldOptions: {
      type: Array,
      default: []
    }
  }
});
