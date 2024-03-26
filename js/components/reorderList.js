Fliplet.FormBuilder.field('reorderList', {
  name: 'Reorder list',
  category: 'Multiple options',
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    },
    optionsType: {
      type: String,
      default: 'dataSource'
    },
    options: {
      type: Array,
      default: function() {
        return [
          {
            id: 'Option 1',
            label: 'Option 1'
          },
          {
            id: 'Option 2',
            label: 'Option 2'
          }
        ];
      }
    },
    dataSourceId: {
      type: Number
    },
    column: {
      type: String
    },
    columnOptions: {
      type: Array,
      default: null
    }
  },
  data: function() {
    return {
      orderedOptions: _.cloneDeep(this.options),
      sortableOptions: {
        sort: true,
        group: {
          name: 'lists',
          pull: false
        },
        disabled: this.readonly,
        ghostClass: 'readonly',
        chosenClass: 'chosen-class',
        dragClass: 'chosen-class',
        onSort: this.onSort
      }
    };
  },
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  directives: {
    sortable: {
      inserted(el, binding) {
        if (Sortable) {
          new Sortable(el, binding.value || {});
        }
      }
    }
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        this.orderedOptions = _.cloneDeep(val);
      }
    },
    value: function(val) {
      if (val) {
        this.orderedOptions = val.map(value => this.options.find(option => option.id === value));
      }

      this.$emit('_input', this.name, val);
    }
  },
  methods: {
    onSort: function(event) {
      this.orderedOptions.splice(event.newIndex, 0, this.orderedOptions.splice(event.oldIndex, 1)[0]);

      this.value = this.orderedOptions.map((option) => option.id ? option.id : option.label);
    },
    onReset: function(data) {
      if (data.id === this.$parent.id) {
        this.orderedOptions = _.cloneDeep(this.options);

        return;
      }
    }
  }
});
