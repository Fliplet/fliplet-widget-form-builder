/**
 * Star rating field component – renders interactive star rating selection in forms.
 * Allows users to select ratings by clicking on star icons with customizable scales.
 */
Fliplet.FormBuilder.field('starRating', {
  name: 'Star rating',
  category: 'Advanced',
  props: {
    description: {
      type: String
    },
    values: {
      type: Array,
      default: [
        {
          id: '5'
        },
        {
          id: '4'
        },
        {
          id: '3'
        },
        {
          id: '2'
        },
        {
          id: '1'
        }
      ]
    }
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = function(value) {
        if (typeof value !== 'undefined' && value >= 0) {
          return value;
        }
      };
    }

    return rules;
  },
  methods: {
    /**
     * Get rating text description
     * @returns {String} Rating description
     */
    getRatingText: function() {
      if (!this.value || this.value <= 0) {
        return 'No rating selected';
      }

      const rating = parseInt(this.value, 10);
      const maxRating = this.values.length;

      if (rating === 1) {
        return '1 star out of ' + maxRating;
      }

      return rating + ' stars out of ' + maxRating;
    },

    /**
     * Handle rating group focus
     * @returns {void}
     */
    onRatingFocus: function() {
      if (this.readonly) {
        this.announceStatus('Star rating is disabled in read-only mode', 2000);

        return;
      }

      const instructions = `Star rating focused. Scale from 1 to ${this.values.length} stars. Use arrow keys to adjust rating, or click on stars to select.`;

      this.announceStatus(instructions, 4000);
    },

    /**
     * Handle individual star focus
     * @param {Number} index - Star index
     * @returns {void}
     */
    onStarFocus: function(index) {
      if (this.readonly) {
        this.announceStatus('Star rating is disabled in read-only mode', 2000);

        return;
      }

      const starNumber = index + 1;

      this.announceStatus(`Star ${starNumber} of ${this.values.length}`, 1500);
    },

    increaseRatingValue: function() {
      if (this.readonly) {
        this.announceStatus('Star rating is disabled in read-only mode', 2000);

        return;
      }

      if (this.value < this.values.length) {
        this.value = +this.value + 1;
        this.updateValue();

        // Announce rating increase
        this.announceAction(`Rating increased to ${this.getRatingText()}`, 2000);
      } else {
        this.announceStatus('Maximum rating reached', 1500);
      }
    },
    decreaseRatingValue: function() {
      if (this.readonly) {
        this.announceStatus('Star rating is disabled in read-only mode', 2000);

        return;
      }

      if (this.value > 0) {
        this.value = +this.value - 1;
        this.updateValue();

        // Announce rating decrease
        this.announceAction(`Rating decreased to ${this.getRatingText()}`, 2000);
      } else {
        this.announceStatus('Minimum rating reached', 1500);
      }
    }
  }
});
