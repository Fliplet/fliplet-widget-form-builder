/**
 * Number field component.
 *
 * @component number
 * @category Text inputs
 * @description Renders a numeric input with built-in validators for
 * integers, decimal precision and also has positive-only mode.
 * @prop {String}  placeholder   Placeholder text
 * @prop {Boolean} positiveOnly  Restrict input to ≥ 0
 * @prop {Number}  decimals      Allowed decimal places
 * @prop {String}  description   Additional helper text
 */
Fliplet.FormBuilder.field('number', {
  i18n: window.VueI18Next,
  name: 'Number input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    positiveOnly: {
      type: Boolean,
      default: false
    },
    decimals: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    }
  },
  validations: function() {
    var rules = {
      value: {
        integer: window.validators.integer,
        maxLength: window.validators.maxLength(15)
      }
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    if (this.positiveOnly) {
      rules.value.positive = this.positiveValidator();
    }

    if (this.decimals > 0) {
      rules.value.decimal = this.decimalValidator(this.decimals);
      delete rules.value.integer;
    }

    return rules;
  },
  methods: {
    /**
     * Handle focus events
     * @returns {void}
     */
    onFocus: function() {
      const instructions = this.positiveOnly
        ? 'Enter a positive number'
        : 'Enter a number';

      if (this.decimals > 0) {
        this.announceStatus(`${instructions} with up to ${this.decimals} decimal places`, 3000);
      } else {
        this.announceStatus(`${instructions}`, 2000);
      }
    },

    positiveValidator: function() {
      return window.validators.helpers.withParams(
        {
          type: 'positiveValidator'
        },
        function(value) {
          if (!value) {
            return true;
          }

          return parseFloat(value) >= 0;
        }
      );
    },
    decimalValidator: function(maxNumbersAfterPoint) {
      return window.validators.helpers.withParams(
        {
          type: 'decimalValidator',
          value: maxNumbersAfterPoint
        },
        function(value) {
          var decimal = /^(-?\d+((\.)\d{1,10})?)$/;

          if (!value) {
            return true;
          }

          if (!decimal.test(value)) {
            return false;
          }

          value = parseFloat(value);

          if (_.isNaN(value)) {
            return false;
          }

          var currentNumbersAfterPoint = 0;

          if (Math.floor(value) !== value) {
            var valueParts = value.toString().split('.');

            currentNumbersAfterPoint = valueParts[1] ? valueParts[1].length : 0;
          }

          return maxNumbersAfterPoint >= currentNumbersAfterPoint;
        }
      );
    }
  }
});
