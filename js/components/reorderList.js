/**
 * @fileoverview Reorder-list field – draggable list for item prioritisation in Fliplet forms.
 *
 * Users can drag to establish custom ordering.
 *
 * @component ReorderListField
 * @vue-prop {Array<Object>} options       – Default list items (`id`, `label`).
 * @vue-prop {String}        optionsType   – 'dataSource' or 'static'.
 * @vue-prop {Number}        dataSourceId  – Linked data-source ID when `optionsType` is 'dataSource'.
 */
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
        const allValuesPresent = val.every(value =>
          this.orderedOptions.some(option => option.id === value)
        );

        if (allValuesPresent && val.length === this.orderedOptions.length) {
          // Create a map to store the indexes of options based on their IDs
          const indexMap = new Map(this.orderedOptions.map((option, index) => [option.id, index]));

          // Sort the options based on the order of the values array
          this.orderedOptions = val.map(value => this.orderedOptions[indexMap.get(value)]);
        } else {
          // If any value is not present in options, keep the original order of options
          return;
        }
      }

      this.$emit('_input', this.name, val);
    }
  },
  methods: {
    onSort: function(event) {
      this.orderedOptions.splice(event.newIndex, 0, this.orderedOptions.splice(event.oldIndex, 1)[0]);

      this.value = this.orderedOptions.map((option) => option.id ? option.id : option.label);

      if (this.orderedOptions[event.newIndex]) {
        const movedItem = this.orderedOptions[event.newIndex];

        this.announceAction(`Moved ${movedItem.label || movedItem.id} to position ${event.newIndex + 1}`, 2000);
      }
    },
    onReset: function(data) {
      if (data.id === this.$parent.id) {
        this.orderedOptions = _.cloneDeep(this.options);

        this.announceStatus('List order reset to default', 1500);
      }
    }
  }
});
