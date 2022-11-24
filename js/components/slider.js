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

      if (this.defaultValueSource !== 'default') {
        this.setValueFromDefaultSettings({
          source: this.defaultValueSource,
          key: this.defaultValueKey
        });
      }

      this.slider.change(function(val) {
        $vm.value = val;
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
