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
            label: 'Option 1'
          },
          {
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
      sortableOptions: {
        sort: true,
        disabled: this.readonly,
        ghostClass: 'readonly',
        chosenClass: 'chosen-class',
        dragClass: 'chosen-class'
      }
    };
  },
  directives: {
    sortable: {
      inserted(el, binding) {
        if (Sortable) {
          new Sortable(el, binding.value || {});
        }
      }
    }
  }
});
