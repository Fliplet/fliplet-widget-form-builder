Fliplet.FormBuilder.field('timeStamp', {
  name: 'Time Stamp',
  category: 'Date & time',
  props: {
    value: {
      type: Object
    },
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
  mounted: function() {
    this.value = {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
    this.$emit('_input', this.name, this.value);
  },
  watch: {
    createdAt: function(val) {
      this.value = {
        createdAt: val,
        updatedAt: this.updatedAt
      };
      this.$emit('_input', this.name, this.value);
    },
    updatedAt: function(val) {
      this.value = {
        createdAt: this.createdAt,
        updatedAt: val
      };
      this.$emit('_input', this.name, this.value);
    }
  },
  methods: {
    afterFormSubmit: async function(data, form) {
      const fields = form.$instance.fields;
      const hasTimeStamp = fields.some(field => field._type === 'flTimeStamp');

      if (!hasTimeStamp) {
        return;
      }

      const dataSourceId = data.result && data.result.dataSourceId;

      if (!dataSourceId) {
        return;
      }

      const connection = await Fliplet.DataSources.connect(dataSourceId);

      if (data.result.createdAt !== data.result.updatedAt && this.updatedAt && this.createdAt) {
        connection.update(data.result.id, {
          'Created at': data.result.createdAt,
          'Last updated': data.result.updatedAt
        });
      } else if (data.result.createdAt !== data.result.updatedAt && this.updatedAt) {
        connection.update(data.result.id, {
          'Last updated': data.result.updatedAt
        });
      } else {
        connection.update(data.result.id, {
          'Created at': data.result.createdAt
        });
      }
    }
  }
});
