/**
 * This component renders a typeahead (autocomplete) input that supports multi-selection.
 * Options can be configured manually or fetched from a data source.
 */
Fliplet.FormBuilder.field('typeahead', {
  name: 'Typeahead (multi-select)',
  category: 'Multiple options',
  props: {
    value: {
      type: Array
    },
    defaultValue: {
      type: String,
      default: ''
    },
    description: {
      type: String
    },
    placeholder: {
      type: String
    },
    optionsType: {
      type: String,
      default: 'dataSource'
    },
    maxItems: {
      type: Number,
      default: null
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
    freeInput: {
      type: Boolean,
      default: false
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
      typeahead: null
    };
  },
  computed: {
    /**
     * Computed messages for typeahead field
     * @returns {Object} Messages object with translated strings
     */
    messages: function() {
      return {
        exceededMaxItems: T('widgets.form.typeahead.errors.limitExceeded', { maxItems: this.maxItems }),
        maxItemsHelper: T('widgets.form.typeahead.maxItemsHelper', { maxItems: this.maxItems })
      };
    },
    /**
     * Checks if the current selection exceeds the maximum allowed items
     * @returns {boolean} True if the selection exceeds maxItems limit
     */
    exceededMaxItems: function() {
      return this.maxItems && this.value && this.value.length > this.maxItems;
    },
    /**
     * Checks if the current selection has reached the maximum allowed items
     * @returns {boolean} True if the selection has reached or exceeded maxItems limit
     */
    reachedMaxItems: function() {
      return this.maxItems && this.value && this.value.length >= this.maxItems;
    }
  },
  /**
   * Defines validation rules for the typeahead field
   * @returns {Object} Validation rules object
   */
  validations: function() {
    const rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    if (this.maxItems) {
      rules.value.maxLength = window.validators.maxLength(this.maxItems);
    }

    return rules;
  },
  /**
   * Initializes default values and sets up form submission hooks
   * @returns {void}
   */
  created: function() {
    if (!!this.defaultValue && this.optionsType === 'manual') {
      this.value = this.defaultValue.split(/\n/);
      this.updateValue(this.name, this.value);
    } else if (!Array.isArray(this.value) && this.optionsType === 'manual') {
      this.value = [];
      this.updateValue(this.name, this.value);
    }

    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  /**
   * Cleans up event listeners to prevent memory leaks
   * @returns {void}
   */
  destroyed: function() {
    Fliplet.Hooks.off('beforeFormSubmit', this.onBeforeSubmit);
  },
  /**
   * Initializes the typeahead functionality and sets up default values
   * @returns {void}
   */
  mounted: function() {
    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({
        source: this.defaultValueSource,
        key: this.defaultValueKey
      });
    }

    this.initTypeahead();

    this.$emit('_input', this.name, this.value, false, true);
  },
  methods: {
    /**
     * Initializes the typeahead component with configuration options
     * Sets up event listeners and handles initial state
     * @returns {void}
     */
    initTypeahead: function() {
      const $vm = this;

      if (this.typeahead && !this.$refs.typeahead) {
        return;
      }

      this.typeahead = Fliplet.UI.Typeahead(this.$refs.typeahead, {
        readonly: this.readonly,
        value: this.value,
        options: this.options,
        freeInput: this.freeInput,
        placeholder: this.placeholder,
        order: this.optionsType === 'dataSource' ? 'asc' : null
      });

      // Ensure elements receive classes so Field border settings apply.
      //  - Add .form-group and .fl-typeahead to the selectize control wrapper
      //  - Add .form-control to the inner text input inside .selectize-input
      function annotateSelectizeDom() {
        const host = $vm.$refs.typeahead;

        if (!host || !host.querySelector) {
          return false;
        }

        const control = document.querySelector('.selectize-control');
        const input = document.querySelector('.selectize-input');


        if (!control) {
          return false;
        }

        control.classList.add('form-group', 'fl-typeahead');

        if (input) {
          input.classList.add('form-control');
        }

        return true;
      }

      annotateSelectizeDom();

      this.typeahead.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
        $vm.handleMaxItemsLock();
      });

      // Check if initial value already reaches maxItems limit
      this.handleMaxItemsLock();
    },
    /**
     * Handles locking/unlocking the typeahead based on maxItems limit
     * Prevents further selection when the limit is reached
     * Readonly fields should always be locked regardless of maxItems
     * @returns {void}
     */
    handleMaxItemsLock: function() {
      if (!this.typeahead) {
        return;
      }

      // Readonly fields should always be locked
      if (this.readonly) {
        this.typeahead.lock();

        return;
      }

      // Lock if maxItems limit is reached
      if (this.maxItems && this.reachedMaxItems) {
        this.typeahead.lock();
      } else {
        this.typeahead.unlock();
      }
    },
    /**
     * Removes duplicated entries from a value array, keeping the first occurrence
     * Entries are compared the way Selectize keys its items (hash_key), so the
     * result holds exactly what the typeahead can hold: 1 and '1' are one item
     * The array is returned untouched when it holds no duplicates, so an
     * already-clean value keeps its identity and does not re-trigger watchers
     * @param {Array} val - The value array to normalize
     * @returns {Array} The value array without duplicates, original order kept
     */
    dedupeValue: function(val) {
      if (!Array.isArray(val)) {
        return val;
      }

      const keys = [];
      const deduped = val.filter(function(item) {
        // Same keying as Selectize's hash_key(): null and undefined share a
        // key, booleans become '1' / '0', anything else its string form
        let key = null;

        if (typeof item === 'boolean') {
          key = item ? '1' : '0';
        } else if (item !== null && typeof item !== 'undefined') {
          key = String(item);
        }

        if (keys.indexOf(key) !== -1) {
          return false;
        }

        keys.push(key);

        return true;
      });

      return deduped.length === val.length ? val : deduped;
    },
    /**
     * Hook called before form submission
     * Ensures the current typeahead value is captured for submission
     * @returns {void}
     */
    onBeforeSubmit: function() {
      this.value = this.typeahead.get();
    }
  },
  watch: {
    /**
     * Watches for changes in the value prop
     * Removes duplicated entries so the typeahead and the emitted value hold
     * the same array, updates the typeahead and handles max items locking
     * @param {Array} val - The new value array
     * @returns {void}
     */
    value: function(val) {
      // PS-1759: Selectize only ever holds one item per value (addItem drops a
      // repeat), so a duplicated value never matches its items and every set()
      // fires another change event. De-duplicate here, before the value is used,
      // so the emit below publishes what the typeahead can actually hold —
      // emitting the raw array instead makes the form write the duplicate back
      // and the two writers never agree, which hangs edit mode.
      const value = this.dedupeValue(val);

      if (this.typeahead) {
        this.typeahead.set(value);
      }

      this.handleMaxItemsLock();
      this.$emit('_input', this.name, value);
    },
    /**
     * Watches for changes in the options prop
     * Updates the typeahead component with new options
     * @param {Array} val - The new options array
     * @returns {void}
     */
    options: function(val) {
      if (this.typeahead) {
        this.typeahead.options(val, this.value);
      }

      this.typeahead.set(this.value);
    },
    /**
     * Watches for changes in the readonly prop
     * Updates the typeahead instance's readonly state using lock/unlock methods
     * @param {boolean} val - The new readonly value
     * @returns {void}
     */
    readonly: function(val) {
      if (!this.typeahead) {
        return;
      }

      if (val) {
        this.typeahead.lock();
      } else {
        // When unlocking, check if maxItems locking should still apply
        this.handleMaxItemsLock();
      }
    }
  }
});
