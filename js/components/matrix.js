/**
 * Matrix field component – renders a grid-based selection interface in forms.
 * Supports multiple rows and columns with radio selection mode.
 */
Fliplet.FormBuilder.field('matrix', {
  name: 'Matrix',
  category: 'Multiple options',
  props: {
    description: {
      type: String
    },
    value: {
      type: String
    },
    rowOptions: {
      type: Array,
      default: function() {
        return [
          {
            label: 'Row 1'
          },
          {
            label: 'Row 2'
          }
        ];
      }
    },
    columnOptions: {
      type: Array,
      default: function() {
        return [
          {
            label: 'Column 1'
          },
          {
            label: 'Column 2'
          }
        ];
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function(val) {
        this.clearValue();

        if (this.checkValue(val) === 'set') {
          this.setValue();
        }
      }
    }
  },
  methods: {
    /**
     * Returns unique ID to the row with combination of form widget instance, name, rowIndex and columnIndex.
     * @param {Number} rowIndex - a row index
     * @param {Number} columnIndex - a column index
     * @param {String} type - an element type
     * @returns {String} an ID unique to the row
     */
    getOptionId: function(rowIndex, columnIndex, type) {
      return Fliplet.FormBuilderUtils.kebabCase(this.$parent.id + '-' + this.name + '-' + rowIndex + '-' + columnIndex + '-' + type);
    },

    /**
     * Returns unique name to the row with combination of name and rowIndex.
     * @param {Number} rowIndex - a row index
     * @returns {String} a name unique to the row
     */
    getOptionName: function(rowIndex) {
      return Fliplet.FormBuilderUtils.kebabCase(this.name + '-' + rowIndex);
    },

    /**
     * Click handler for each radio button in matrix
     * @param {Object} row - a row object which includes id and label
     * @param {Object} column - a column object which includes id and label
     * @param {Number} rowIndex - a row index
     * @param {Number} colIndex - a column index
     * @returns {undefined}
     */
    clickHandler: function(row, column, rowIndex, colIndex) {
      if (rowIndex >= 0 && colIndex >= 0) {
        var el = this.getOptionId(rowIndex, colIndex, 'input');

        $('#' + el).prop('checked', true);
      }

      if (row.id && this.value[row.id]) {
        delete this.value[row.id];
      }

      if (this.value[row.label]) {
        delete this.value[row.label];
      }

      this.value[row.id || row.label] = column ? column.id || column.label : undefined;

      this.$emit('_input', this.name, this.value);
    },

    /**
     * Focus handler for each radio button in matrix
     * @param {Number} rowIndex - a row index
     * @param {Number} colIndex - a column index
     * @returns {undefined}
     */
    focusHandler: function(rowIndex, colIndex) {
      var $vm = this;

      if (rowIndex >= 0 && colIndex >= 0) {
        var row = this.rowOptions[rowIndex];
        var col = this.columnOptions[colIndex];

        $('#' + $vm.getOptionId(rowIndex, colIndex, 'span')).focus();

        this.value[row.id || row.label] = col.id || col.label;
        this.clickHandler(row, col, rowIndex, colIndex);
      }
    },

    /**
     * Set default undefined value for each row if value is blank
     * @returns {undefined}
     */
    setDefaultValue: function() {
      var $vm = this;

      $vm.value = {};

      this.rowOptions.forEach(function(row) {
        $vm.$set($vm.value, row.id || row.label, undefined);
      });
    },

    /**
     * Set value for each row as per selection and default value
     * @returns {undefined}
     */
    setValue: function() {
      var $vm = this;

      if ($vm.value === undefined || Fliplet.FormBuilderUtils.isEmpty($vm.value)) {
        this.setDefaultValue();
      } else {
        if (typeof $vm.value === 'string') {
          $vm.value = JSON.parse($vm.value);
        }

        Object.keys($vm.value).forEach(function(value) {
          var key = $vm.value[value];
          var rowIndex = $vm.rowOptions.findIndex(function(row) {
            return (Fliplet.FormBuilderUtils.has(row, 'label') && Fliplet.FormBuilderUtils.has(row, 'id')) ? row.id === value || row.label === value : row.label === value;
          });

          var row = $vm.rowOptions[rowIndex];

          var colIndex = $vm.columnOptions.findIndex(function(col) {
            return (Fliplet.FormBuilderUtils.has(col, 'label') && Fliplet.FormBuilderUtils.has(col, 'id')) ? col.id === key || col.label === key : col.label === key;
          });

          var col = $vm.columnOptions[colIndex];

          // setTimeout using to load all HTML and then execute below piece of code.
          setTimeout(function() {
            if (row && col) {
              $vm.clickHandler(row, col, rowIndex, colIndex);
            }
          }, 0);
        });
      }
    },

    /**
     * Clears the value for each row
     * @returns {undefined}
     */
    clearValue() {
      if (!this.$refs.matrix) {
        return;
      }

      $(this.$refs.matrix).find('.matrix-radio-input:checked').prop('checked', false);

      if (this.value === '') {
        this.setDefaultValue();
      }

      if (typeof this.value === 'string' && this.value !== '') {
        try {
          this.value = JSON.parse(this.value);
        } catch (e) {
          this.value = '';
        }
      }
    },

    /**
     * Check if all rows has column values or not
     * @param {object} val - value of selected options
     * @returns {String} checkFlag
     */
    checkValue: function(val) {
      if (typeof val === 'string' && val !== '') {
        try {
          val = JSON.parse(this.value);
        } catch (e) {
          val = '';
        }
      }

      var checkFlag = 'set';
      var $vm = this;
      var columnOpt = [];

      if (val === '') {
        val = {};
        checkFlag = 'clear';
      } else if (!Fliplet.FormBuilderUtils.isEmpty(val)) {
        var result = [];

        Object.keys(val).forEach(function(key) {
          var value = val[key];

          if (typeof value !== 'undefined') {
            result.push(value);
          }
        });

        if (result.length > 0) {
          result.forEach(function(col) {
            var foundColumn = $vm.columnOptions.find(function(column) {
              return column.label === col || column.id === col;
            });

            if (foundColumn) {
              columnOpt.push(foundColumn);
            }
          });
        }

        if (result.length === 0 && columnOpt.length === 0) {
          checkFlag = 'clear';
        }
      }

      return checkFlag;
    },

    onReset: function(data) {
      if (data.id === this.$parent.id) {
        this.clearValue();

        if (this.defaultValueSource !== 'default') {
          this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
        }
      }
    },

    onBeforeSubmit: function(data) {
      var $vm = this;

      Object.keys(data[this.name]).forEach(function(val) {
        var row = $vm.rowOptions.find(function(row) {
          return (Fliplet.FormBuilderUtils.has(row, 'label') && Fliplet.FormBuilderUtils.has(row, 'id')) ? row.id === val : row.label === val;
        });

        if (!row) {
          delete data[$vm.name][val];
        }
      });
    },

    /**
     * Check if the value has correct rowOptions and columnOptions or not
     * @returns {undefined}
     */
    checkInvalidValue: function() {
      if (!this.value) {
        return;
      }

      var validColumns = [];
      var $vm = this;

      Object.keys(this.value).forEach(function(rowKey) {
        var columnKey = $vm.value[rowKey];
        var foundCol = $vm.columnOptions.find(function(col) {
          return col.label === columnKey || col.id === columnKey;
        });

        if (foundCol) {
          validColumns.push(foundCol);
        }
      });

      return validColumns.length > 0;
    }
  },
  validations: function() {
    var $vm = this;
    var rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = function() {
        // Check that every row has a non-empty value
        return $vm.rowOptions.every(function(row) {
          return typeof $vm.value[row.id || row.label] !== 'undefined';
        });
      };
    }

    return rules;
  },
  mounted: function() {
    if (['default', 'profile'].indexOf(this.defaultValueSource) === -1) {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }
  },
  created: function() {
    if (typeof this.value === 'string' && this.value !== '') {
      try {
        this.value = JSON.parse(this.value);
      } catch (e) {
        this.value = {};
      }
    }

    if (!this.checkInvalidValue()) {
      this.value = {};
    }

    this.setValue();

    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});
