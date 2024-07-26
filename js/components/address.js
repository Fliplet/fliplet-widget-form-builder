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
      type: Array
    },
    storeInSeparateFields: {
      type: Boolean,
      default: false
    },
    separateFieldsName: {
      type: Object,
      default: {
        'streetNumber': null,
        'streetName': null,
        'city': null,
        'state': null,
        'postCode': null,
        'country': null
      }
    }
  }
});
