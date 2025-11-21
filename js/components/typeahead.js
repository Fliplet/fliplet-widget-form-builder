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
        // Explicitly pass placeholder then immediately force-set it to avoid cross-instance leakage
        placeholder: this.placeholder,
        order: this.optionsType === 'dataSource' ? 'asc' : null
      });

      // Force placeholder on underlying DOM element (library may clone previous instance when some are hidden)
      this.ensurePlaceholder();

      this.typeahead.change(function(value) {
        $vm.value = value;
        $vm.updateValue();
        $vm.handleMaxItemsLock();
      });

      // Check if initial value already reaches maxItems limit
      this.handleMaxItemsLock();
    },
    /**
     * Ensures the DOM <select> placeholder matches this instance's prop
     */
    ensurePlaceholder: function() {
      if (!this.$refs.typeahead) {
        return;
      }

      const $el = this.$refs.typeahead.querySelector('select');

      if ($el) {
        $el.setAttribute('placeholder', this.placeholder || '');
      }

      // Some versions expose internal input element
      if (this.typeahead && this.typeahead.input) {
        this.typeahead.input.setAttribute('placeholder', this.placeholder || '');
      }
    },
    /**
     * Handles locking/unlocking the typeahead based on maxItems limit
     * Prevents further selection when the limit is reached
     * @returns {void}
     */
    handleMaxItemsLock: function() {
      if (!this.typeahead || !this.maxItems) {
        return;
      }

      if (this.reachedMaxItems) {
        this.typeahead.lock();
      } else {
        this.typeahead.unlock();
      }
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
     * Updates the typeahead component and handles max items locking
     * @param {Array} val - The new value array
     * @returns {void}
     */
    value: function(val) {
      if (this.typeahead) {
        this.typeahead.set(val);
      }

      this.handleMaxItemsLock();
      this.$emit('_input', this.name, val);
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
     * React to placeholder changes or reactivity side-effects (e.g. hiding fields) by force applying correct placeholder.
     */
    placeholder: function() {
      this.$nextTick(this.ensurePlaceholder);
    }
  }
});
