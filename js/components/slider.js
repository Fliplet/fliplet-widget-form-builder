/**
 * Slider field component – renders a range slider input for numeric selection in forms.
 * Supports min/max values, step increments, and real-time value display.
 */
Fliplet.FormBuilder.field('slider', {
  name: 'Slider',
  category: 'Advanced',
  props: {
    description: {
      type: String
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    value: {
      type: String
    },
    step: {
      type: Number
    }
  },
  data: function() {
    return {
      slider: null
    };
  },
  watch: {
    value: function(val) {
      if (this.slider) {
        this.slider.set(val);
      }

      this.$emit('_input', this.name, val);
    }
  },
  mounted: function() {
    this.initSlider();
  },
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  methods: {
    /**
     * Get formatted slider value text
     * @returns {String} Formatted value text
     */
    getSliderValueText: function() {
      if (this.value === null || this.value === undefined || this.value === '') {
        return 'No value selected';
      }

      const numValue = parseFloat(this.value);

      if (isNaN(numValue)) {
        return this.value;
      }

      // Format based on step precision
      if (this.step && this.step < 1) {
        const decimalsToken = this.step.toString().split('.')[1];
        const decimals = decimalsToken ? decimalsToken.length : 0;

        return numValue.toFixed(decimals);
      }

      return numValue.toString();
    },

    /**
     * Handle slider focus
     * @returns {void}
     */
    onSliderFocus: function() {
      if (this.readonly) {
        this.announceStatus('Slider is disabled in read-only mode', 2000);

        return;
      }

      const instructions = `Slider focused. Current value: ${this.getSliderValueText()}. Use arrow keys to adjust, or drag to change value. Range: ${this.min} to ${this.max}`;

      this.announceStatus(instructions, 4000);
    },

    initSlider: function() {
      if (this.slider || !this.$refs.slider) {
        return;
      }

      this.slider = Fliplet.UI.RangeSlider(this.$refs.slider, {
        min: this.min,
        max: this.max,
        step: this.step,
        value: this.value,
        readonly: this.readonly
      });

      var $vm = this;

      if (this.defaultValueSource !== 'default' && this.defaultValueSource !== 'profile') {
        this.setValueFromDefaultSettings({
          source: this.defaultValueSource,
          key: this.defaultValueKey
        });
      }

      this.slider.change(function(val) {
        $vm.value = val;

        $vm.announceStatus(`Slider value: ${$vm.getSliderValueText()}`, 1500);
      });

      if (this.value !== this.slider.get()) {
        this.value = this.slider.get();
      }
    },
    onReset: function(data) {
      if (data.id === this.$parent.id) {
        if (this.defaultValueSource !== 'default') {
          this.setValueFromDefaultSettings({
            source: this.defaultValueSource,
            key: this.defaultValueKey
          });
        }

        this.slider.set(this.value);
      }
    }
  }
});
