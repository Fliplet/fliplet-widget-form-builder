Fliplet.FormBuilder = (function() {
  var fields = [];
  var components = {};
  var eventHub = new Vue();

  Vue.use(window.vuelidate.default);

  var templates = Fliplet.Widget.Templates;

  function name(component) {
    return 'fl' + component.charAt(0).toUpperCase() + component.slice(1);
  }

  return {
    on: function(eventName, fn) {
      eventHub.$on(eventName, fn);
    },
    off: function(eventName, fn) {
      eventHub.$off(eventName, fn);
    },
    emit: function(eventName, data) {
      eventHub.$emit(eventName, data);
    },
    components: function() {
      return components;
    },
    categories: function() {
      var categories = [];

      _.forIn(components, function(component, componentName) {
        var categoryName = component.category || 'Generic';
        var category = _.find(categories, {
          name: categoryName
        });
        var isExisting = !!category;

        if (!isExisting) {
          category = {
            name: categoryName,
            fields: []
          };
        }

        category.fields.push(componentName);

        if (!isExisting) {
          categories.push(category);
        }
      });

      return categories;
    },
    field: function(componentName, component) {
      if (!component.name) {
        throw new Error('The component name is required');
      }

      var template = templates['templates.components.' + componentName];

      if (!template) {
        throw new Error('A template for the ' + componentName + ' component has not been found');
      }

      if (!component.methods) {
        component.methods = {};
      }

      // Define method to emit the new input value on change
      if (!component.methods.updateValue) {
        component.methods.updateValue = function() {
          this.highlightError();
          this.$emit('_input', this.name, this.value);
        }
      }

      // Define method to highlight Error on blur form field
      component.methods.highlightError = function () {
        var $vm = this;

        if ($vm.$v && $vm.$v.value) {
          $vm.$v.$touch();

          if ($vm.$v.value.$error) {
            $($vm.$el).addClass('has-error');
          } else {
            $($vm.$el).removeClass('has-error');
          }
        }
      }

      // Define method to trigger the form reset from a children
      if (!component.methods.resetForm) {
        component.methods.resetForm = function() {
          this.$emit('_reset');
        }
      }

      if (!component.computed) {
        component.computed = {};
      }

      component.computed._isFormField = function() {
        return this.showLabel || this.showLabel === undefined;
      };

      component.template = templates['templates.components.field']({
        template: template()
      });

      componentName = name(componentName);
      components[componentName] = component;

      // All fields have these properties
      component.props = _.assign({
        name: {
          type: String,
          required: true
        },
        label: {
          type: String,
          default: component.name || 'Label text'
        },
        showLabel: {
          type: Boolean,
          default: true
        },
        value: {
          type: String,
          default: ''
        },
        required: {
          type: Boolean,
          default: false
        }
      }, component.props);

      Vue.component(componentName, component);
    },
    fields: function() {
      return Object.keys(components);
    },
    configuration: function(componentName, component) {
      if (!component) {
        component = {};
      }

      var template = templates['templates.configurations.' + componentName];

      componentName = name(componentName);

      // Extend from base component
      component = _.assign({
        computed: {},
        methods: {},
        props: {}
      }, _.pick(components[componentName], [
        'props', 'computed'
      ]), component);

      // On submit event
      component.methods._onSubmit = function() {
        if (this._fieldNameError || this._fieldLabelError) {
          return;
        }

        var $vm = this;
        var data = {};

        Object.keys($vm.$props).forEach(function(prop) {
          if (prop.indexOf('_') !== 0) {
            data[prop] = $vm[prop];
          }
        });

        eventHub.$emit('field-settings-changed', data);
      };

      if (!component.methods.onSubmit) {
        component.methods.onSubmit = component.methods._onSubmit;
      }

      component.props._fields = {
        type: Array
      };

      component.props._idx = {
        type: Number,
        default: -1
      };

      component.props._isEditingName = {
        type: Boolean,
        default: false
      };
  
      component.props._showNameField = {
        type: Boolean,
        default: false
      };

      component.computed._fieldNameError = function() {
        if (!this.name) {
          return 'Please provide a Field Name';
        }

        var existing = _.findIndex(this._fields, {
          name: this.name
        });

        if (existing > -1 && existing !== this._idx) {
          return this.name + ' is taken. Please use another Field Name.';
        }

        return '';
      };
  
      component.computed._fieldLabelError = function() {
        if (!this.label) {
          return 'Please provide a Field Label';
        }
    
        var existing = _.findIndex(this._fields, {
          name: this.name
        });
    
        if (existing > -1 && existing !== this._idx) {
          return this.name + ' is taken. Please use another Field Label.';
        }
    
        return '';
      };
  
      component.methods._addCustomName = function() {
        this._showNameField = !this._showNameField;
        this.initTooltip();
      };

      if (!component.methods.addCustomName) {
        component.methods.addCustomName = component.methods._addCustomName;
      }

      component.methods._compareFieldName = function() {
        this.name = this.label;
        this.initTooltip();
      };

      if (!component.methods.compareFieldName) {
        component.methods.compareFieldName = component.methods._compareFieldName;
      }
  
      component.methods._initTooltip = function() {
        var $vm = this;
        
        $vm.$nextTick(function () {
          var tooltip = $vm.$refs.tooltip;
  
          if (tooltip) {
            $(tooltip).tooltip();
          }
        });
      };
  
      if (!component.methods.initTooltip) {
        component.methods.initTooltip = component.methods._initTooltip;
      }
      
      component.methods._openFilePicker = function() {
        var $vm = this;

        var config = {
          selectedFiles: {},
          selectMultiple: false,
          type: 'folder'
        };

        window.currentProvider = Fliplet.Widget.open('com.fliplet.file-picker', {
          data: config,
          onEvent: function(e, data) {
            switch (e) {
              case 'widget-set-info':
                Fliplet.Studio.emit('widget-save-label-reset');
                Fliplet.Studio.emit('widget-save-label-update', {
                  text: 'Select'
                });
                Fliplet.Widget.toggleSaveButton(!!data.length);
                var msg = data.length ? data.length + ' folder selected' : 'no selected folders';
                Fliplet.Widget.info(msg);
                break;
            }
          }
        });

        window.currentProvider.then(function(result) {
          Fliplet.Widget.info('');
          Fliplet.Studio.emit('widget-save-label-update');
          $vm.mediaFolderData = result.data[0];
          $vm.mediaFolderId = result.data[0].id;
          $vm.mediaFolderNavStack = result.data[0].navStackRef || {};
          window.currentProvider = null;
        });
      };

      if (!component.methods.openFilePicker) {
        component.methods.openFilePicker = component.methods._openFilePicker;
      }

      component.methods._openFileManager = function() {
        var $vm = this;

        Fliplet.Studio.emit('overlay', {
          name: 'widget',
          options: {
            size: 'large',
            package: 'com.fliplet.file-manager',
            title: 'File Manager',
            classes: 'data-source-overlay',
            data: {
              context: 'overlay',
              appId: Fliplet.Env.get('appId'),
              folder: $vm.mediaFolderData,
              navStack: $vm.mediaFolderNavStack
            }
          }
        });
      };

      if (!component.methods.openFileManager) {
        component.methods.openFileManager = component.methods._openFileManager;
      }

      var hasOptions = component.props.options && Array.isArray(component.props.options.type());

      // If options is an array, automatically deal with options
      if (hasOptions) {
        component.computed._options = function generateOptions() {
          return this.options.map(function (option) {
            if (option.id && option.label && option.id != option.label) {
              return option.label + ' <' + option.id + '>';
            }
            return option.label || option.id;
          }).join('\r\n');
        };

        component.methods._setOptions = function setOptions(str) {
          this.options = _.compact(str.split(/\r?\n/).map(function (rawOption) {
            rawOption = rawOption.trim();

            var regex = /<.*>$/g;
            var match = rawOption.match(regex);
            var option = {};

            if (match) {
              option.label = rawOption.replace(regex, '').trim();
              var value = match[0].substring(1, match[0].length - 1).trim();
              option.id = value || option.label;
            } else {
              option.label = rawOption;
              option.id = rawOption;
            }

            return option;
          }));
        };
      }

      component.template = templates['templates.configurations.form']({
        template: template && template() || '',
        hasOptions: hasOptions
      });

      Vue.component(componentName + 'Config', component);
    }
  };
})();
