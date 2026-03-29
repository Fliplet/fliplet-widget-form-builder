/**
 * WYSIWYG field component - Renders a rich text editor powered by TinyMCE that allows users to create and edit
 * formatted HTML content within forms. Supports text styling, links, tables, lists,
 * and various formatting options with a comprehensive toolbar interface.
 *
 */
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
    const rules = {
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
      const formattedVal = Fliplet.FormBuilderUtils.isNumber(val) ? val.toString() : val;

      if (this.editor && formattedVal !== this.editor.getContent()) {
        return this.editor.setContent(formattedVal || '', { format: 'raw' });
      }

      if (formattedVal !== this.value) {
        this.value = formattedVal;
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
      const $vm = this;

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
    const $vm = this;
    const lineHeight = 55;

    this.tinymceId = Fliplet.FormBuilderUtils.kebabCase(this.name) + '-' + $(this.$refs.textarea).parents('[data-form-builder-id]').data('formBuilderId');

    const config = {
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

          const mobileEditorSocket = $('.tinymce-mobile-editor-socket');

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

          // Ensure elements receive classes so Field border settings apply
          try {
            const containerEl = editor.editorContainer
              || (editor.iframeElement && editor.iframeElement.parentElement && editor.iframeElement.parentElement.parentElement)
              || null;

            if (containerEl) {
              // Allow base Form input border rules to apply
              containerEl.classList.add('form-control');
              // Mark the editor container for styling regardless of Vue re-renders
              containerEl.classList.add('fl-rich-text');

              // Make wrapper focusable so :focus rules from Appearance can apply
              if (!containerEl.hasAttribute('tabindex')) {
                containerEl.setAttribute('tabindex', '0');
              }

              // Mark the field wrapper so Field border rules can target it
              const formGroup = containerEl.closest && containerEl.closest('.form-group');

              if (formGroup) {
                formGroup.classList.add('fl-rich-text');
              }

              // Save on instance for focus/blur handlers below
              editor._fl_containerEl = containerEl;
            }
          } catch (e) {
            // no-op
          }

          if ($vm.isInterface) {
            // iFrames don't work with the form builder's Sortable feature
            // Instead, the iFrame is swapped with a <div></div> of the same dimensions
            const $el = $($vm.$refs.ghost);

            $el.width(editor.iframeElement.style.width).height(editor.iframeElement.style.height);
            $(editor.iframeElement).replaceWith($el);
          }
        });

        editor.on('keydown', $vm.addBulletedListShortcutsMac);

        editor.on('focus', function() {
          const $el = $(editor.iframeElement);

          $el.parent().parent().addClass('focus-outline');

          // Focus the wrapper so .form-control:focus rules from Appearance apply
          if (editor._fl_containerEl && editor._fl_containerEl.focus) {
            editor._fl_containerEl.classList.add('focus');

            // Ensure form-group retains the marker class even if Vue re-rendered
            const formGroup = editor._fl_containerEl.closest && editor._fl_containerEl.closest('.form-group');

            if (formGroup && !formGroup.classList.contains('fl-rich-text')) {
              formGroup.classList.add('fl-rich-text');
            }
          }
        });

        editor.on('blur', function() {
          const $el = $(editor.iframeElement);

          $el.parent().parent().removeClass('focus-outline');

          // Remove focus from wrapper to clear :focus styles
          if (editor._fl_containerEl && editor._fl_containerEl.blur) {
            editor._fl_containerEl.classList.remove('focus');
          }

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
        const pluginPaths = ['plugins', 'mobile.plugins'];

        pluginPaths.forEach(function(path) {
          let plugins = Fliplet.FormBuilderUtils.get(config, path);

          if (typeof plugins === 'string') {
            // Use array of plugins (as TinyMCE's preferred format) if string is provided
            plugins = plugins.split(' ');
          }

          Fliplet.FormBuilderUtils.set(config, path, plugins);
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
