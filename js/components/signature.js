/* global SignaturePad */
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
    canHide: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    mediaFolderId: {
      type: Number,
      default: null
    },
    mediaFolderData: {
      type: Object,
      default: {}
    },
    mediaFolderNavStack: {
      type: Array,
      default: []
    }
  },
  data: function() {
    return {
      pad: null,
      previousClientWidth: 0,
      isEditable: true,
      isDestroyed: false,
      loadedFromData: false
    };
  },
  validations: function() {
    var $vm = this;
    var rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = function() {
        return !!($vm.pad && !$vm.pad.isEmpty());
      };
    }

    return rules;
  },
  computed: {
    borderColor: function() {
      return Fliplet.Themes && Fliplet.Themes.Current.get('bodyTextColor') || '#e5e5e5';
    }
  },
  created: function() {
    if (this.$parent.isLoading) {
      this.loadedFromData = true;
      this.isEditable = false;
    }
  },
  mounted: function() {
    if (this.readonly) {
      return;
    }

    var $vm = this;
    var canvas = this.$refs.canvas;

    canvas.style.width = '100%';
    canvas.style.height = parseInt(this.height, 10) + 'px';
    canvas.style.userSelect = 'none';
    canvas.style.borderBottom = '1px solid ' + this.borderColor;

    this.pad = new SignaturePad(canvas);

    // check is field valid when required
    this.pad.onEnd = function() {
      $vm.value = $vm.getPadValueAsData();
      $vm.updateValue();
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

      if (this.previousClientWidth !== canvas.clientWidth) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.onReset();
        this.previousClientWidth = canvas.width;
      }
    },
    onReset: function() {
      if (this.pad) {
        this.pad.clear();
      }
    },
    clean: function() {
      this.onReset();
      this.updateValue();
      this.isEditable = true;
    },
    getPadValueAsData: function(includeFilename) {
      return this.pad && this.pad.toDataURL('image/png') +
        (includeFilename
          ? ';filename:' + this.name + ' ' + moment().format('YYYY-MM-DD HH:mm') + '.png'
          : '');
    },
    onBeforeSubmit: function(data) {
      if (!this.pad || this.isDestroyed) {
        return;
      }

      // Get signature as base 64 string
      data[this.name] = this.getPadValueAsData(true);
    }
  }
});
