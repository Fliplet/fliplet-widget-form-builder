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
    afterFormSubmit: function(data) {
      let $vm = this;
      let dataSourceId = data.result.dataSourceId;

      Fliplet.DataSources.connect(dataSourceId).then(function(connection) {
        if (data.result.createdAt !== data.result.updatedAt && $vm.updatedAt) {
          connection.update(data.result.id, {
            'Last updated': data.result.updatedAt
          });
        } else if ($vm.createdAt) {
          connection.update(data.result.id, {
            'Created at': data.result.createdAt
          });
        }
      });
    }
  }
});
