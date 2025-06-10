/* Purpose: Vue component for 'wysiwyg' field in Fliplet apps. See AGENTS.md. */

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
    var lineHeight = 55;

    this.tinymceId = _.kebabCase(this.name) + '-' + $(this.$refs.textarea).parents('[data-form-builder-id]').data('formBuilderId');

    var config = {
      target: this.$refs.textarea,
      mobile: {
        toolbar_mode: 'floating',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'directionality',
          'autoresize', 'fullscreen', 'code', 'wordcount', 'table'
        ]
      },
      readonly: this.readonly,
      placeholder: this.placeholder,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'directionality',
        'autoresize', 'fullscreen', 'code', 'wordcount', 'table'
      ],
      toolbar: this.readonly
        ? false
        : [
          'undo redo',
          'bold italic underline',
          'alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent',
          'ltr rtl | link | removeformat code fullscreen',
          'table tabledelete | tableprops tablerowprops tablecellprops',
          'tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol'
        ].join(' | '),
      image_advtab: true,
      menubar: false,
      statusbar: true,
      elementpath: false,
      // Prevent URLs from being altered
      // https://stackoverflow.com/questions/3796942
      relative_urls: false,
      remove_script_host: false,
      convert_urls: true,
      inline: false,
      resize: false,
      bottom_margin: 0,
      max_height: lineHeight * this.rows,
      min_height: lineHeight * this.rows,
      autofocus: false,
      branding: false,
      setup: function(editor) {
        $vm.editor = editor;

        editor.on('click', function() {
          if (tinymce.activeEditor.queryCommandState('ToggleToolbarDrawer')) {
            tinymce.activeEditor.execCommand('ToggleToolbarDrawer');
          }
        });

        editor.on('init', function() {
          $vm.addBulletedListShortcutsWindows();

          var mobileEditorSocket = $('.tinymce-mobile-editor-socket');

          if (mobileEditorSocket) {
            mobileEditorSocket.height('auto');
          }

          if ($vm.defaultValueSource !== 'default' && !$vm.value) {
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

        editor.on('undo', function() {
          $vm.value = editor.getContent();

          $vm.updateValue();
        });

        editor.on('redo', function() {
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
        var pluginPaths = ['plugins', 'mobile.plugins'];

        _.forEach(pluginPaths, function(path) {
          var plugins = _.get(config, path);

          if (typeof plugins === 'string') {
            // Use array of plugins (as TinyMCE's preferred format) if string is provided
            plugins = plugins.split(' ');
          }

          _.set(config, path, plugins);
        });

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
