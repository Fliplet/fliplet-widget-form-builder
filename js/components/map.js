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
    }
  },

  mounted: function() {
    var self = this;

    console.log(this.$refs.mapField, 'pppppppppppppppppppppppppppppp');
    Fliplet.UI.MapField(this.$refs.mapField, {
      enablePin: true,
      readOnly: false,
      defaultMapType: 'roadmap',
      autocomplete: true,
      placeholder: 'Enter address or select on the map'
    });

    Fliplet.UI.AddressField(this.$refs.mapAddressLookUp);

    var mapField = Fliplet.UI.MapField.get(this.$refs.mapField);

    // Example of setting a value
    // mapField.set('1600 Amphitheatre Parkway, Mountain View, CA');

    // // Example of clearing the value
    // mapField.clear();

    // // Example of adding a change listener
    // mapField.change(function(value) {
    //   console.log('Map value changed:', value);
    // });
  }
});
