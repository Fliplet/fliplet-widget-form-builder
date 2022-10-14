Fliplet.FormBuilder.field('wysiwyg', {
  name: 'Rich text',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    rows: {
      type: Number,
      default: 5
    },
    description: {
      type: String
    },
    tinymceId: {
      type: Number
    }
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  computed: {
    isInterface: function() {
      return Fliplet.Env.get('interface');
    }
  },
  watch: {
    placeholder: function(val) {
      $(this.editor.contentAreaContainer).find('p').text(val);
    },
    value: function(val) {
      // This happens when the value is updated programmatically via the FormBuilder field().val() method
      val = _.isNumber(val) ? _.toString(val) : val;

      if (this.editor && val !== this.editor.getContent()) {
        return this.editor.setContent(val || '', { format: 'raw' });
      }

      if (val !== this.value) {
        this.value = val;
      }
    }
  },
  methods: {
    onReset: function() {
      if (this.editor) {
        try {
          return this.editor.setContent(this.value);
        } catch (e) {
          // nothing
        }
      }
    },
    placeholderLabel: function() {
      var placeholderText = this.editor.getElement().getAttribute('placeholder') || this.editor.settings.placeholder;
      var contentAreaContainer = this.editor.getContentAreaContainer();
      var defaultStyles = {
        style: {
          position: 'absolute',
          top: '17px',
          left: '8px',
          color: '#888',
          lineHeight: '19px',
          padding: tinymce.DOM.getStyle(contentAreaContainer, 'padding', true),
          width: '98%',
          overflow: 'hidden',
          'white-space': 'pre-wrap',
          'font-weight': 'normal',
          'font-size': '16px'
        }
      };
      var placeholderAttrs = this.editor.settings.placeholderAttrs || defaultStyles;

      tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative');

      // Create label element in the TinyMCE editor
      this.labelElement = tinymce.DOM.add(contentAreaContainer, this.editor.settings.placeholderTag || 'p', placeholderAttrs, placeholderText);
    },
    hidePlaceholderLabel: function() {
      tinymce.DOM.setStyle(this.labelElement, 'display', 'none');
    },
    showPlaceholderLabel: function() {
      tinymce.DOM.setStyle(this.labelElement, 'display', '');
    },
    onPlaceholderFocus: function() {
      if (!this.editor.settings.readonly) {
        this.hidePlaceholderLabel();
      }

      // for readonly rich text make placeholder text unselectable
      if (this.editor.settings.readonly) {
        tinymce.DOM.setStyle(this.labelElement, 'pointer-events', 'none');
      }

      this.editor.execCommand('mceFocus', false);
    },
    onPlaceholderBlur: function() {
      if (!this.editor.getContent()) {
        this.showPlaceholderLabel();
      } else {
        this.hidePlaceholderLabel();
      }
    },
    addPlaceholder: function() {
      // Init placeholder
      this.placeholderLabel();
      this.onPlaceholderBlur();

      // Add placeholder listeners
      tinymce.DOM.bind(this.labelElement, 'click', this.onPlaceholderFocus);
      this.editor.on('focus', this.onPlaceholderFocus);
      this.editor.on('blur', this.onPlaceholderBlur);
      this.editor.on('change', this.onPlaceholderBlur);
      this.editor.on('setContent', this.onPlaceholderBlur);
      this.editor.on('keydown', this.hidePlaceholderLabel);
    },
    addBulletedListShortcutsWindows: function() {
      var $vm = this;

      // For Windows
      this.editor.addShortcut('ctrl+shift+8', 'UnorderedList', function() {
        $vm.editor.execCommand('InsertUnorderedList');
      });
    },
    addBulletedListShortcutsMac: function(event) {
      if (event.metaKey && event.code === 'BracketLeft') {
        event.preventDefault();
        this.editor.execCommand('InsertUnorderedList');
      }
    }
  },
  mounted: function() {
    var $vm = this;
    var lineHeight = 40;

    this.tinymceId = _.kebabCase(this.name) + '-' + $(this.$refs.textarea).parents('[data-form-builder-id]').data('formBuilderId');

    var config = {
      target: this.$refs.textarea,
      theme: 'modern',
      mobile: {
        theme: 'mobile',
        plugins: [ 'autosave', 'lists', 'autolink' ],
        toolbar: [ 'bold', 'italic', 'underline', 'bullist', 'numlist', 'removeformat' ]
      },
      readonly: this.readonly,
      plugins: [
        'advlist autolink lists link directionality',
        'autoresize fullscreen code paste'
      ].join(' '),
      toolbar: this.readonly
        ? false
        : [
          'bold italic underline',
          'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
          'ltr rtl | link | removeformat code fullscreen'
        ].join(' | '),
      image_advtab: true,
      menubar: false,
      statusbar: false,
      // Prevent URLs from being altered
      // https://stackoverflow.com/questions/3796942
      relative_urls: false,
      remove_script_host: false,
      convert_urls: true,
      inline: false,
      resize: false,
      autoresize_bottom_margin: 0,
      autoresize_max_height: lineHeight * this.rows,
      autoresize_min_height: lineHeight * this.rows,
      autofocus: false,
      branding: false,
      content_style: 'body { background-color: transparent; }',
      setup: function(editor) {
        $vm.editor = editor;

        editor.on('init', function() {
          if (editor.settings.theme === 'mobile' && $vm.readonly) {
            editor.editorContainer.style.pointerEvents = 'none';
          }

          $vm.addPlaceholder();
          $vm.addBulletedListShortcutsWindows();

          if ($vm.defaultValueSource !== 'default') {
            $vm.setValueFromDefaultSettings({ source: $vm.defaultValueSource, key: $vm.defaultValueKey });
          }

          // initialise value if it was set prior to initialisation
          if ($vm.value) {
            editor.setContent($vm.value, { format: 'raw' });
          }

          if ($vm.isInterface) {
            // iFrames don't work with the form builder's Sortable feature
            // Instead, the iFrame is swapped with a <div></div> of the same dimensions
            var $el = $($vm.$refs.ghost);

            $el.width(editor.iframeElement.style.width).height(editor.iframeElement.style.height);
            $(editor.iframeElement).replaceWith($el);
          }
        });

        editor.on('keydown', $vm.addBulletedListShortcutsMac);

        editor.on('focus', function() {
          var $el = $(editor.iframeElement);

          $el.parent().parent().addClass('focus-outline');
        });

        editor.on('blur', function() {
          var $el = $(editor.iframeElement);

          $el.parent().parent().removeClass('focus-outline');
          $vm.onBlur();
        });

        editor.on('change', function() {
          $vm.value = editor.getContent();

          $vm.updateValue();
        });
      }
    };

    // Allow custom code to register hooks before this runs
    Fliplet().then(function() {
      Fliplet.Hooks.run('beforeRichFieldInitialize', {
        field: this,
        config: config
      }).then(function() {
        tinymce.init(config);
      });
    });

    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});
