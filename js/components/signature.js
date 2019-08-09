Fliplet.FormBuilder.field('signature', {
  name: 'Signature',
  category: 'Advanced',
  props: {
    placeholder: {
      type: String
    },
    height: {
      type: Number,
      default: 150
    },
    previousClientWidth: {
      type: Number,
      default: 0
    }
  },
  validations: function () {
    var rules = {
      value: {}
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }
    return rules;
  },
  computed: {
    borderColor: function () {
      return Fliplet.Themes && Fliplet.Themes.Current.get('bodyTextColor') || '#e5e5e5';
    }
  },
  mounted: function () {
    var $vm = this;

    var canvas = this.$refs.canvas;
    canvas.style.width = '100%';
    canvas.style.height = parseInt(this.height, 10) + 'px';
    canvas.style.userSelect = 'none';
    canvas.style.borderBottom = '1px solid ' + this.borderColor;

    this.pad = new SignaturePad(canvas);

    // check is field valid when required
    this.pad.onEnd = function () {
      if ($vm.required) {
        $vm.value = true;
        $vm.updateValue();
      }
    };

    Fliplet.FormBuilder.on('reset', this.onReset);
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);

    $(window).on('resize', this.onResize);
    this.onResize();
  },
  destroyed: function() {
    this.isDestroyed = true;
    $(window).off('resize', this.onResize);
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  methods: {
    onResize: function() {
      var canvas = this.$refs.canvas;

      if ($vm.previousClientWidth !== canvas.clientWidth) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.onReset();
        $vm.previousClientWidth = canvas.width;
      }
    },
    onReset: function() {
      if (this.pad) {
        this.pad.clear();
        this.value = null;
      }
    },
    clean: function () {
      this.onReset();
      this.updateValue()
    },
    onBeforeSubmit: function(data) {
      $vm = this;
      if (!$vm.pad || $vm.isDestroyed) {
        return;
      }

      // highlight Error if not valid field when required
      if ($vm.required && $vm.pad.isEmpty()) {
        this.highlightError();
      }

      // Get signature as base 64 string
      data[this.name] = this.pad.toDataURL('image/png');
    }
  }
});
