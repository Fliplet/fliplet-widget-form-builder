Fliplet.FormBuilder.field('timeStamp', {
  name: 'Time Stamp',
  category: 'Date & time',
  submit: false,
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    },
    createdAt: {
      type: Boolean,
      default: true
    },
    updatedAt: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    label: undefined
  },
  created: function() {
    Fliplet.Hooks.on('afterFormSubmit', this.afterFormSubmit);
  },
  destroyed: function() {
    Fliplet.Hooks.off('afterFormSubmit', this.afterFormSubmit);
  },
  methods: {
    afterFormSubmit: async function(data) {
      let dataSourceId = data.result.dataSourceId;

      const connection = await Fliplet.DataSources.connect(dataSourceId);

      if (data.result.createdAt !== data.result.updatedAt && this.updatedAt) {
        connection.update(data.result.id, {
          'Last updated': data.result.updatedAt
        });
      } else if (this.createdAt) {
        connection.update(data.result.id, {
          'Created at': data.result.createdAt
        });
      }
    }
  }
});
