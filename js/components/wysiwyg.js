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

    const warnedScopes = new Set();
    const logWarn = (scope, err) => {
      if (warnedScopes.has(scope)) return;

      warnedScopes.add(scope);

      // eslint-disable-next-line no-console
      if (window.console && console.warn) console.warn('[fl-rt-style]', scope, err);
    };

    let probeEl = null;
    const getProbe = () => {
      if (probeEl && probeEl.isConnected) return probeEl;

      probeEl = document.createElement('input');
      probeEl.className = 'form-control';
      probeEl.placeholder = 'x';
      probeEl.setAttribute('aria-hidden', 'true');
      probeEl.tabIndex = -1;
      probeEl.style.cssText = 'position:absolute;visibility:hidden;height:0;padding:0;margin:0;pointer-events:none';

      const host = (this.$el && this.$el.closest && this.$el.closest('.form-group')) || document.body;

      host.appendChild(probeEl);

      return probeEl;
    };
    const destroyProbe = () => {
      if (probeEl && probeEl.parentNode) {
        probeEl.parentNode.removeChild(probeEl);
      }

      probeEl = null;
    };

    /**
     * Collect text input and placeholder styles from the host page so the editor
     * inside the TinyMCE iframe matches the app Appearance settings.
     *
     * @returns {{ text: Object, placeholder: Object }} Text and placeholder CSS property maps
     */
    const collectEditorStyles = () => {
      try {
        const probe = getProbe();
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

        return { text, placeholder };
      } catch (e) {
        logWarn('collectEditorStyles', e);

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

    /**
     * Build the CSS string injected into the TinyMCE iframe from collected styles.
     *
     * @param {{ text: Object, placeholder: Object }} styles Style maps from collectEditorStyles()
     * @param {boolean} includePlaceholder Whether to include placeholder CSS blocks
     * @returns {string} The complete content_style CSS
     */
    const buildContentStyleCss = (styles, includePlaceholder) => {
      const bodyCss = [
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

      if (!includePlaceholder) return bodyCss;

      const placeholderCss = [
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

      const typingHideCss = '.mce-content-body.fl-typing[data-mce-placeholder]::before{content:none !important;opacity:0 !important;}';

      return bodyCss + placeholderCss + typingHideCss;
    };

    const hasPlaceholder = typeof this.placeholder === 'string' && this.placeholder.trim().length > 0;
    const contentStyleCss = buildContentStyleCss(collectEditorStyles(), hasPlaceholder);

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

        let containerEl = null;
        let styleWatch = null;

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

            const hasPh = !!($vm.placeholder && String($vm.placeholder).trim().length > 0);
            const css = buildContentStyleCss(collectEditorStyles(), hasPh);
            const id = 'fl-rt-style';
            let s = d.getElementById(id);

            if (!s) {
              s = d.createElement('style');
              s.id = id;
              d.head.appendChild(s);
            }

            s.textContent = css;
          } catch (e) {
            logWarn('updateIframeStyles', e);
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

          let debounceId = null;
          const scheduleDebounced = () => {
            if (debounceId) clearTimeout(debounceId);
            debounceId = setTimeout(maybeUpdateIframeStyles, 100);
          };

          // Observe <head> for added/removed stylesheets
          const headObserver = new MutationObserver(scheduleDebounced);

          try {
            headObserver.observe(document.head, { childList: true, subtree: true });
          } catch (e) {
            logWarn('headObserver.observe', e);
          }

          // Observe the form root (not the whole document) for Appearance-affecting attribute changes
          const rootTarget = ($vm.$el && $vm.$el.closest && $vm.$el.closest('form'))
            || $vm.$el
            || document.body;
          const rootObserver = new MutationObserver(scheduleDebounced);

          try {
            rootObserver.observe(rootTarget, {
              attributes: true,
              attributeFilter: ['class', 'style']
            });
          } catch (e) {
            logWarn('rootObserver.observe', e);
          }

          // Keep references for cleanup
          styleWatch = {
            headObserver,
            rootObserver,
            timers: new Set(),
            rafs: new Set()
          };

          // Short backoff schedule to capture late async CSS loads (3 attempts)
          [100, 500, 1500].forEach((delay) => {
            trackTimeout(maybeUpdateIframeStyles, delay);
          });
        };

        const stopLiveStyleWatch = () => {
          const refs = styleWatch || {};

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

          if (refs.timers) {
            refs.timers.forEach((id) => clearTimeout(id));
          }

          if (refs.rafs && window.cancelAnimationFrame) {
            refs.rafs.forEach((id) => window.cancelAnimationFrame(id));
          }

          styleWatch = null;
          destroyProbe();
        };

        /**
         * Track a setTimeout so stopLiveStyleWatch can cancel it on teardown.
         *
         * @param {Function} fn Callback to run after the delay
         * @param {number} delay Delay in milliseconds
         * @returns {void}
         */
        const trackTimeout = (fn, delay) => {
          const refs = styleWatch;
          const id = setTimeout(() => {
            if (refs && refs.timers) refs.timers.delete(id);
            fn();
          }, delay);

          if (refs && refs.timers) refs.timers.add(id);
        };

        /**
         * Schedule multiple updates to catch late-loaded Appearance CSS.
         * This avoids requiring a refresh to see placeholder color changes.
         *
         * @returns {void}
         */
        const scheduleStyleRefreshBurst = () => {
          updateIframeStyles();

          const refs = styleWatch;

          if (window.requestAnimationFrame) {
            const rafId = window.requestAnimationFrame(() => {
              if (refs && refs.rafs) refs.rafs.delete(rafId);
              updateIframeStyles();
            });

            if (refs && refs.rafs) refs.rafs.add(rafId);
          }

          trackTimeout(updateIframeStyles, 50);
          trackTimeout(updateIframeStyles, 300);
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

          // Sync styles on init (startLiveStyleWatch first so the burst timers can be tracked)
          startLiveStyleWatch();
          scheduleStyleRefreshBurst();

          // Ensure elements receive classes so Field border settings apply
          try {
            containerEl = editor.editorContainer
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
          trackTimeout(updateIframeStyles, 0);
        });

        const clearTypingIfEmpty = () => {
          try {
            const body = editor.getBody && editor.getBody();

            if (body && editor.dom && editor.dom.isEmpty(body)) {
              body.classList.remove('fl-typing');
            }
          } catch (err) {
            // no-op
          }
        };

        editor.on('keyup', function() {
          clearTypingIfEmpty();
        });

        editor.on('focus', function() {
          const $el = $(editor.iframeElement);

          $el.parent().parent().addClass('focus-outline');

          // Focus the wrapper so .form-control:focus rules from Appearance apply
          if (containerEl && containerEl.focus) {
            containerEl.classList.add('focus');

            // Ensure form-group retains the marker class even if Vue re-rendered
            const formGroup = containerEl.closest && containerEl.closest('.form-group');

            if (formGroup && !formGroup.classList.contains('fl-rich-text')) {
              formGroup.classList.add('fl-rich-text');
            }
          }

          // Refresh styles on focus (e.g., after returning from preview)
          updateIframeStyles();
        });

        editor.on('blur', function() {
          const $el = $(editor.iframeElement);

          $el.parent().parent().removeClass('focus-outline');

          // Remove focus from wrapper to clear :focus styles
          if (containerEl && containerEl.blur) {
            containerEl.classList.remove('focus');
          }

          $vm.onBlur();
          updateIframeStyles();

          // On blur, ensure placeholder can appear again if content is empty
          clearTypingIfEmpty();
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
