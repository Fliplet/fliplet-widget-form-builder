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

    /**
     * Collect text input and placeholder styles from the host page so the editor
     * inside the TinyMCE iframe matches the app Appearance settings.
     *
     * @returns {{ text: Object, placeholder: Object }} Text and placeholder CSS property maps
     */
    const collectEditorStyles = () => {
      try {
        const probe = document.createElement('input');

        probe.className = 'form-control';
        probe.placeholder = 'x';
        probe.style.cssText = 'position:absolute;visibility:hidden;height:0;padding:0;margin:0';

        const formGroup = this.$el && this.$el.closest ? this.$el.closest('.form-group') : null;

        (formGroup || document.body).appendChild(probe);

        const cs = getComputedStyle(probe);
        const csp = getComputedStyle(probe, '::placeholder') || {};

        const pick = (obj, prop, fallback) => {
          const value = obj && (obj[prop] || obj[prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())]);

          // Treat empty, 'initial' or 'normal' values as absent to improve fallbacks
          if (!value || value === 'initial' || value === 'normal') {
            return fallback;
          }

          return value;
        };

        const text = {
          color: cs.color || 'rgba(34,47,62,.9)',
          fontFamily: cs.fontFamily || 'inherit',
          fontSize: cs.fontSize || 'inherit',
          fontWeight: cs.fontWeight || 'normal',
          fontStyle: cs.fontStyle || 'normal',
          lineHeight: cs.lineHeight || '1.4',
          letterSpacing: cs.letterSpacing || 'normal',
          textTransform: cs.textTransform || 'none',
          textDecoration: (cs.textDecorationLine || cs.textDecoration || 'none')
        };

        const placeholder = {
          color: pick(csp, 'color', text.color),
          fontFamily: pick(csp, 'fontFamily', text.fontFamily),
          fontSize: pick(csp, 'fontSize', text.fontSize),
          fontWeight: pick(csp, 'fontWeight', text.fontWeight),
          fontStyle: pick(csp, 'fontStyle', text.fontStyle),
          lineHeight: pick(csp, 'lineHeight', text.lineHeight),
          letterSpacing: pick(csp, 'letterSpacing', text.letterSpacing),
          textTransform: pick(csp, 'textTransform', text.textTransform),
          textDecoration: pick(csp, 'textDecorationLine', (csp.textDecoration || text.textDecoration))
        };

        probe.remove();

        return { text, placeholder };
      } catch (e) {
        // Conservative, readable defaults
        return {
          text: {
            color: 'rgba(34,47,62,.9)',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'normal',
            fontStyle: 'normal',
            lineHeight: '1.4',
            letterSpacing: 'normal',
            textTransform: 'none',
            textDecoration: 'none'
          },
          placeholder: {
            color: 'rgba(34,47,62,.7)',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'normal',
            fontStyle: 'normal',
            lineHeight: '1.4',
            letterSpacing: 'normal',
            textTransform: 'none',
            textDecoration: 'none'
          }
        };
      }
    };

    // Build CSS to ensure TinyMCE body and placeholder inherit host input and placeholder styles
    const { text: textStyles, placeholder: placeholderStyles } = collectEditorStyles();
    const hasPlaceholder = typeof this.placeholder === 'string' && this.placeholder.trim().length > 0;

    const bodyCss = [
      '.mce-content-body{',
      'color:', textStyles.color, ' !important;',
      'font-family:', textStyles.fontFamily, ' !important;',
      'font-size:', textStyles.fontSize, ' !important;',
      'font-weight:', textStyles.fontWeight, ' !important;',
      'font-style:', textStyles.fontStyle, ' !important;',
      'line-height:', textStyles.lineHeight, ' !important;',
      'letter-spacing:', textStyles.letterSpacing, ' !important;',
      'text-transform:', textStyles.textTransform, ' !important;',
      'text-decoration:', textStyles.textDecoration, ' !important;',
      '}'
    ].join('');

    const placeholderCss = [
      '.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before{',
      'color:', placeholderStyles.color, ' !important;',
      'font-family:', placeholderStyles.fontFamily, ' !important;',
      'font-size:', placeholderStyles.fontSize, ' !important;',
      'font-weight:', placeholderStyles.fontWeight, ' !important;',
      'font-style:', placeholderStyles.fontStyle, ' !important;',
      'line-height:', placeholderStyles.lineHeight, ' !important;',
      'letter-spacing:', placeholderStyles.letterSpacing, ' !important;',
      'text-transform:', placeholderStyles.textTransform, ' !important;',
      'text-decoration:', placeholderStyles.textDecoration, ' !important;',
      'opacity:1 !important;',
      '}'
    ].join('');

    const typingHideCss = [
      '.mce-content-body.fl-typing[data-mce-placeholder]::before{',
      'content:none !important;',
      'opacity:0 !important;',
      '}'
    ].join('');

    const contentStyleCss = hasPlaceholder
      ? (bodyCss + placeholderCss + typingHideCss)
      : bodyCss;

    const config = {
      target: this.$refs.textarea,
      mobile: {
        toolbar_mode: 'floating',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'directionality',
          'autoresize', 'fullscreen', 'code', 'wordcount', 'table'
        ]
      },
      // Ensure TinyMCE body and placeholder match Appearance input and placeholder styles
      content_style: contentStyleCss,
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

        /**
         * Inject or update a <style> tag inside the TinyMCE iframe to keep styles
         * in sync with the current Appearance settings without requiring reload.
         *
         * @returns {void}
         */
        const updateIframeStyles = () => {
          try {
            const d = editor.getDoc && editor.getDoc();

            if (!d || !d.head) return;

            const styles = collectEditorStyles();

            const bodyCssLive = [
              '.mce-content-body{',
              'color:', styles.text.color, ' !important;',
              'font-family:', styles.text.fontFamily, ' !important;',
              'font-size:', styles.text.fontSize, ' !important;',
              'font-weight:', styles.text.fontWeight, ' !important;',
              'font-style:', styles.text.fontStyle, ' !important;',
              'line-height:', styles.text.lineHeight, ' !important;',
              'letter-spacing:', styles.text.letterSpacing, ' !important;',
              'text-transform:', styles.text.textTransform, ' !important;',
              'text-decoration:', styles.text.textDecoration, ' !important;',
              '}'
            ].join('');

            const placeholderCssLive = [
              '.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before{',
              'color:', styles.placeholder.color, ' !important;',
              'font-family:', styles.placeholder.fontFamily, ' !important;',
              'font-size:', styles.placeholder.fontSize, ' !important;',
              'font-weight:', styles.placeholder.fontWeight, ' !important;',
              'font-style:', styles.placeholder.fontStyle, ' !important;',
              'line-height:', styles.placeholder.lineHeight, ' !important;',
              'letter-spacing:', styles.placeholder.letterSpacing, ' !important;',
              'text-transform:', styles.placeholder.textTransform, ' !important;',
              'text-decoration:', styles.placeholder.textDecoration, ' !important;',
              'opacity:1 !important;',
              '}'
            ].join('');

            const typingHideCssLive = [
              '.mce-content-body.fl-typing[data-mce-placeholder]::before{',
              'content:none !important;',
              'opacity:0 !important;',
              '}'
            ].join('');

            const css = ($vm.placeholder && String($vm.placeholder).trim().length > 0)
              ? (bodyCssLive + placeholderCssLive + typingHideCssLive)
              : bodyCssLive;
            const id = 'fl-rt-style';
            let s = d.getElementById(id);

            if (!s) {
              s = d.createElement('style');
              s.id = id;
              d.head.appendChild(s);
            }

            s.textContent = css;
          } catch (e) {
            // no-op
          }
        };

        /**
         * Compute a simple signature of current Appearance-derived styles to detect changes.
         *
         * @returns {string} JSON signature of text/placeholder styles and placeholder presence
         */
        const computeStyleSignature = () => {
          try {
            const styles = collectEditorStyles();

            return JSON.stringify({
              t: styles.text,
              p: styles.placeholder,
              hasPh: !!($vm.placeholder && String($vm.placeholder).trim().length > 0)
            });
          } catch (e) {
            return '';
          }
        };

        let lastStyleSignature = '';
        /**
         * Re-apply iframe styles only when styles have actually changed.
         *
         * @returns {void}
         */
        const maybeUpdateIframeStyles = () => {
          const sig = computeStyleSignature();

          if (!sig || sig === lastStyleSignature) return;

          lastStyleSignature = sig;
          updateIframeStyles();
        };

        /**
         * Observe Appearance/class/style/stylesheet changes and refresh styles when needed.
         *
         * @returns {void}
         */
        const startLiveStyleWatch = () => {
          // Initial signature
          lastStyleSignature = computeStyleSignature();

          // Observe <head> for added/removed stylesheets
          const headObserver = new MutationObserver(() => {
            // Debounce to coalesce bursts
            setTimeout(maybeUpdateIframeStyles, 0);
          });

          try {
            headObserver.observe(document.head, { childList: true, subtree: true });
          } catch (e) {
            // no-op
          }

          // Observe the root for class/style changes that could affect Appearance
          const rootObserver = new MutationObserver(() => {
            setTimeout(maybeUpdateIframeStyles, 0);
          });

          try {
            rootObserver.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ['class', 'style'],
              subtree: true,
              childList: false
            });
          } catch (e) {
            // no-op
          }

          // Short polling window to capture late async CSS loads
          let attemptsLeft = 24; // ~6s @ 250ms
          const intervalId = setInterval(() => {
            maybeUpdateIframeStyles();
            attemptsLeft -= 1;

            if (attemptsLeft <= 0) {
              clearInterval(intervalId);
            }
          }, 250);

          // Keep references for cleanup
          editor._fl_styleWatch = {
            headObserver,
            rootObserver,
            intervalId
          };
        };

        const stopLiveStyleWatch = () => {
          const refs = editor._fl_styleWatch || {};

          try {
            if (refs.headObserver && refs.headObserver.disconnect) refs.headObserver.disconnect();
          } catch (e) {
            // no-op
          }

          try {
            if (refs.rootObserver && refs.rootObserver.disconnect) refs.rootObserver.disconnect();
          } catch (e) {
            // no-op
          }

          try {
            if (refs.intervalId) clearInterval(refs.intervalId);
          } catch (e) {
            // no-op
          }

          editor._fl_styleWatch = null;
        };

        /**
         * Schedule multiple updates to catch late-loaded Appearance CSS.
         * This avoids requiring a refresh to see placeholder color changes.
         *
         * @returns {void}
         */
        const scheduleStyleRefreshBurst = () => {
          updateIframeStyles();

          if (window.requestAnimationFrame) {
            requestAnimationFrame(updateIframeStyles);
          }

          setTimeout(updateIframeStyles, 50);
          setTimeout(updateIframeStyles, 300);
        };

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

          // Sync styles on init
          scheduleStyleRefreshBurst();
          startLiveStyleWatch();

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

        editor.on('keydown', function(e) {
          $vm.addBulletedListShortcutsMac(e);
          // Hide placeholder overlay immediately on first keystroke

          try {
            const body = editor.getBody && editor.getBody();

            if (body && !body.classList.contains('fl-typing')) {
              body.classList.add('fl-typing');
            }
          } catch (err) {
            // no-op
          }

          // Styles may change due to theme toggles; refresh shortly after keystrokes
          setTimeout(updateIframeStyles, 0);
        });

        editor.on('keyup', function() {
          // If content is still empty, re-allow placeholder to show

          try {
            const body = editor.getBody && editor.getBody();

            if (body) {
              const rawHtml = editor.getContent({ format: 'raw' }) || '';
              const textOnly = (editor.getContent({ format: 'text' }) || '').replace(/\u00a0/g, ' ').trim();
              const htmlWithoutEmptyParas = rawHtml
                .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
                .replace(/<br\s*\/?>/gi, '')
                .replace(/&nbsp;/gi, '')
                .trim();

              if (textOnly.length === 0 && htmlWithoutEmptyParas.length === 0) {
                body.classList.remove('fl-typing');
              }
            }
          } catch (err) {
            // no-op
          }
        });

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
          updateIframeStyles();

          // On blur, ensure placeholder can appear again if content is empty

          try {
            const body = editor.getBody && editor.getBody();

            if (body) {
              const rawHtml = editor.getContent({ format: 'raw' }) || '';
              const textOnly = (editor.getContent({ format: 'text' }) || '').replace(/\u00a0/g, ' ').trim();
              const htmlWithoutEmptyParas = rawHtml
                .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
                .replace(/<br\s*\/?>/gi, '')
                .replace(/&nbsp;/gi, '')
                .trim();

              if (textOnly.length === 0 && htmlWithoutEmptyParas.length === 0) {
                body.classList.remove('fl-typing');
              }
            }
          } catch (err) {
            // no-op
          }
        });

        editor.on('change', function() {
          $vm.value = editor.getContent();

          $vm.updateValue();
          updateIframeStyles();
        });

        editor.on('undo', function() {
          $vm.value = editor.getContent();

          $vm.updateValue();
          updateIframeStyles();
        });

        editor.on('redo', function() {
          $vm.value = editor.getContent();

          $vm.updateValue();
          updateIframeStyles();
        });

        // Refresh styles when editor gains focus (e.g., after returning from preview)
        editor.on('focus', function() {
          updateIframeStyles();
        });

        // Cleanup watchers when editor is removed
        editor.on('remove', function() {
          stopLiveStyleWatch();
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
