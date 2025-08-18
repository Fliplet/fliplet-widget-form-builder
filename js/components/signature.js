/* global SignaturePad */
/**
 * Signature field component – renders a signature capture pad in forms.
 * Enables users to draw signatures using touch or mouse input with save functionality.
 */
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

      $vm.announceAction('Signature drawn', 2000);
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
    /**
     * Handle signature area focus
     * @returns {void}
     */
    onSignatureFocus: function() {
      if (this.readonly) {
        this.announceStatus('Signature field is disabled in read-only mode', 2000);

        return;
      }

      this.announceStatus('Signature drawing area focused. Use mouse or touch to draw your signature', 3000);
    },

    /**
     * Handle signature keyboard events
     * @param {Event} event - Keyboard event
     * @returns {void}
     */
    handleSignatureKeyDown: function(event) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();

          if (this.pad && !this.pad.isEmpty()) {
            this.clean();
            this.announceStatus('Signature cleared', 1500);
          }

          break;

        default:
          break;
      }
    },

    /**
     * Handle clear button focus
     * @returns {void}
     */
    onClearFocus: function() {
      if (this.readonly) {
        this.announceStatus('Clear button is disabled in read-only mode', 2000);

        return;
      }

      this.announceStatus('Clear signature button. Press Space or Enter to clear', 2000);
    },

    /**
     * Handle edit button focus
     * @returns {void}
     */
    onEditFocus: function() {
      if (this.readonly) {
        this.announceStatus('Edit button is disabled in read-only mode', 2000);

        return;
      }

      this.announceStatus('Edit signature button. Press Enter to edit', 2000);
    },

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

      this.announceStatus('Signature field reset', 1500);
    },
    clean: function() {
      this.onReset();
      this.updateValue();
      this.isEditable = true;

      this.announceAction('Signature cleared', 1500);
    },
    getPadValueAsData: function(includeFilename) {
      return this.pad && this.pad.toDataURL('image/png')
        + (includeFilename
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
