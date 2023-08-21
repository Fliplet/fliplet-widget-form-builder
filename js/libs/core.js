/* eslint-disable eqeqeq */
Fliplet.FormBuilder = (function() {
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
        };
      }

      /**
       * This function is responsible personalizing a default value when we need to get it from user personalized data
       * For example: set default value to the user email
       *
       * @param {Object} data - an object with source and key properties
       *  Where source - is defining the value  source type
       *  And key - tell us what key in the source we should take as a value
       *
       * @return {void} - this method does not return anything but updates the value directly on the target field.
       */
      component.methods.setValueFromDefaultSettings = function(data) {
        var result;
        var $vm = this;

        switch (data.source) {
          case 'profile':
            if (!data.key) {
              throw new Error('A key is required to fetch data from the user\'s profile');
            }

            result = Fliplet.User.getCachedSession({ force: true })
              .then(function(session) {
                if (session && session.entries) {
                  if (session.entries.dataSource) {
                    return session.entries.dataSource.data[data.key];
                  }

                  if (session.entries.saml2) {
                    return session.entries.saml2.data[data.key];
                  }

                  if (session.entries.flipletLogin) {
                    return session.entries.flipletLogin.data[data.key];
                  }
                }

                return Fliplet.Profile.get(data.key);
              });
            break;
          case 'query':
            if (!data.key) {
              throw new Error('A key is required to fetch data from the navigation query parameters');
            }

            if (this._componentName === 'flMatrix') {
              var matrixValue = {};

              _.mapKeys(Fliplet.Navigate.query, function(value, key) {
                if (key === data.key) {
                  _.forEach(this.rowOptions, function(row) {
                    var val = row.id ? row.id : row.label;

                    if (!_.has(matrixValue, val)) {
                      matrixValue[val] = value;
                    }
                  });
                } else if (_.includes(key, data.key)) {
                  var regex = /\[(.*)\]/g;
                  var match = key.split(regex).filter(r => r !== '');

                  if (match.length > 1) {
                    matrixValue[match[1]] = value;
                  } else {
                    matrixValue = value;
                  }
                }
              });

              result = matrixValue;
            } else {
              result = Fliplet.Navigate.query[data.key];
            }

            break;
          case 'appStorage':
            if (!data.key) {
              throw new Error('A key is required to fetch data from app storage');
            }

            result = Fliplet.App.Storage.get(data.key);
            break;
          default:
            result = this.value;
        }

        if (!(result instanceof Promise)) {
          result = Promise.resolve(result);
        }

        return result.then(function(value) {
          if (typeof value === 'undefined') {
            value = '';
          }

          if (componentName === 'flCheckbox' || componentName === 'flTypeahead') {
            value = Array.isArray(value) ? value : [value];
          }

          var isValueChanged = value !== $vm.value;

          $vm.value = value;

          if (isValueChanged) {
            $vm.updateValue();
          }
        });
      };

      // Define method to highlight Error on blur form field
      component.methods.highlightError = function() {
        var $vm = this;

        if ($vm.$v && $vm.$v.value) {
          if ($vm.$v.passwordConfirmation) {
            $vm.isValid = !$vm.$v.value.$error;

            return;
          }

          $vm.isValid = !$vm.$v.value.$error;
        }
      };

      component.methods.onInput = _.debounce(function($event) {
        this.$emit('_input', this.name, $event.target.value, false, true);
      }, 200);

      // Define method to execute on blur form field
      component.methods.onBlur = function() {
        this.$v.value.$touch();
        this.highlightError();
      };

      // Define method to trigger the form reset from a children
      if (!component.methods.resetForm) {
        component.methods.resetForm = function() {
          this.$emit('_reset');
        };
      }

      if (!component.computed) {
        component.computed = {};
      }

      component.computed._isFormField = function() {
        return this.showLabel || this.showLabel === undefined;
      };

      component.computed._labelName = function() {
        if (['flImage', 'flFile'].indexOf(component.props._componentName.default) > -1 && this.readonly) {
          return '';
        }

        return ['flRadio', 'flCheckbox'].indexOf(component.props._componentName.default) > -1 ? '' : this.name;
      };

      component.computed._supportsRequired = function() {
        return this._isFormField && component.name !== 'Slider';
      };

      component.computed._supportsRowOptions = function() {
        return this._isFormField && component.props._componentName.default === 'flMatrix';
      };

      component.computed._supportsColumnOptions = function() {
        return this._isFormField && component.props._componentName.default === 'flMatrix';
      };

      component.computed._showField = function() {
        if (this.isHidden) {
          return false;
        }

        return true;
      };

      component.computed._fieldDynamicWidth = function() {
        var $vm = this;

        if ($vm.customWidth) {
          switch ($vm.width) {
            case 25:
              return 'w-1_4';
            case 50:
              return 'w-1_2';
            case 75:
              return 'w-3_4';
            default:
              return 'w-full';
          }
        }

        return 'w-full';
      };

      component.computed._selectedLabel = function() {
        if (!this.options) {
          return this.value;
        }

        var vm = this;

        var option = _.find(this.options, function(opt) {
          return opt.id == vm.value;
        });

        return option ? (option.label || option.id) : this.value;
      };

      if (!component.mounted) {
        component.mounted = function() {
          if (this.defaultValueSource !== 'default') {
            this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
          }
        };
      }

      var fieldContext = $('html').hasClass('context-build') ? 'field' : 'interface';

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
        _componentName: {
          type: String,
          default: componentName
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
        },
        isHidden: {
          type: Boolean,
          default: false
        },
        canHide: {
          type: Boolean,
          default: true
        },
        readonly: {
          type: Boolean,
          default: false
        },
        defaultValueSource: {
          type: String,
          default: 'default'
        },
        defaultValueKey: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        customWidth: {
          type: Boolean,
          default: false
        },
        width: {
          type: Number,
          default: 50
        },
        ownRow: {
          type: Boolean
        }
      }, component.props);

      // Wait until translations are available in Handlebars templates
      Fliplet().then(function() {
        component.template = templates['templates.components.' + fieldContext]({
          template: template()
        });

        Vue.component(componentName, component);
      });
    },
    fields: function() {
      return Object.keys(components);
    },
    configuration: function(componentName, component) {
      if (!component) {
        component = {};
      }

      var template = templates['templates.configurations.' + componentName];

      Handlebars.registerPartial('defaultValuePartial', templates['templates.configurations.defaultValue']());

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
        if (!this.defaultValueKey && this._componentsWithPersonalization.includes(this._componentName) && this.defaultValueSource !== 'default') {
          return 'Key field is required';
        }

        if (this._fieldNameError || this._fieldLabelError || this._hasErrors) {
          return;
        }

        var $vm = this;
        var data = {};

        Object.keys($vm.$props).forEach(function(prop) {
          if (prop.indexOf('_') !== 0) {
            data[prop] = $vm[prop];
          }
        });

        if (this._componentName === 'flInput') {
          if (this.generateGuid) {
            data.idType = 'guid';
          } else {
            delete data.idType;
          }
        }

        if (this._componentName === 'flTimer') {
          if (data.type === 'timer') {
            data.initialTimerValue = (data.hours * 60 * 60) + (data.minutes * 60) + data.seconds;
          } else {
            data.initialTimerValue = 0;
          }

          delete data.hours;
          delete data.minutes;
          delete data.seconds;
        }

        if (this._componentName === 'flSlider') {
          data.max = !data.max ? 100 : Number(data.max);
          data.min = !data.min ? 0 : Number(data.min);
          data.step = !data.step ? 1 : Number(data.step);

          if ((data.max - data.min) % data.step !== 0) {
            data.max = data.max - (data.max - data.min) % data.step;
          }
        }

        eventHub.$emit('field-settings-changed', data);
      };

      if (!component.methods.onSubmit) {
        component.methods.onSubmit = component.methods._onSubmit;
      }

      component.props._fields = {
        type: Array
      };

      component.props._componentName = {
        type: String,
        default: componentName
      };

      component.props._componentsWithPersonalization = {
        type: Array,
        default: ['flInput', 'flCheckbox', 'flRadio', 'flEmail', 'flNumber', 'flTelephone', 'flUrl', 'flTextarea', 'flWysiwyg', 'flSelect', 'flSlider', 'flMatrix', 'flTypeahead']
      };

      component.props._componentsWithDescription = {
        type: Array,
        default: ['flInput', 'flCheckbox', 'flRadio', 'flEmail', 'flNumber', 'flTelephone', 'flUrl', 'flTextarea', 'flWysiwyg', 'flSelect', 'flDate', 'flTime', 'flDateRange', 'flTimeRange', 'flTimer', 'flStarRating', 'flSignature', 'flImage', 'flFile', 'flSlider', 'flMatrix', 'flTypeahead', 'flGeolocation']
      };

      component.props._readOnlyComponents = {
        type: Array,
        default: ['flInput', 'flCheckbox', 'flRadio', 'flEmail', 'flNumber', 'flTelephone', 'flUrl', 'flTextarea', 'flWysiwyg', 'flSelect', 'flDate', 'flTime', 'flDateRange', 'flTimeRange', 'flTimer', 'flStarRating', 'flSignature', 'flImage', 'flFile', 'flSlider', 'flMatrix', 'flTypeahead']
      };

      component.props._flexibleWidthComponents = {
        type: Array,
        default: ['flInput', 'flCheckbox', 'flRadio', 'flEmail', 'flNumber', 'flTelephone', 'flUrl', 'flTextarea', 'flWysiwyg', 'flSelect', 'flDate', 'flTime', 'flDateRange', 'flTimeRange', 'flTimer', 'flStarRating', 'flSignature', 'flImage', 'flFile', 'flSlider', 'flMatrix', 'flTypeahead', 'flGeolocation']
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

      component.props.errors = {
        type: Object,
        default: {}
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
        if (this.type === 'flButtons') {
          if ((this.showSubmit && !this.submitValue) || (this.showClear && !this.clearValue)) {
            return 'Please provide a Field Label';
          }

          return '';
        }

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

      component.computed._hasErrors = function() {
        this._getErrors();

        return !_.isEmpty(this.errors);
      };

      component.methods._hasDuplicateOptions  = function(options) {
        var finalOptions = _.map(options, function(option) {
          return {
            id: option.id ? option.id : option.label,
            label: option.label ? option.label : option.id
          };
        });

        var duplicates = _.filter(
          _.uniq(
            _.map(finalOptions, function(item) {
              var val = item.id;

              if (_.filter(finalOptions, ['id', val]).length > 1) {
                return val;
              }

              return false;
            })),
          function(value) { return value; });

        return !!duplicates.length;
      };

      component.methods._getErrors = function() {
        this.errors = {};

        switch (this._componentName) {
          case 'flCheckbox':
            if (this.options.length === 0) {
              _.assignIn(this.errors, {
                checkboxOptions: 'Please enter options for the checkbox field'
              });
            } else if (this._hasDuplicateOptions(this.options)) {
              _.assignIn(this.errors, {
                checkboxDuplicateOptions: 'Please enter unique options for the checkbox field'
              });
            }

            break;

          case 'flRadio':
            if (this.options.length === 0) {
              _.assignIn(this.errors, {
                radioOptions: 'Please enter options for the radio field'
              });
            } else if (this._hasDuplicateOptions(this.options)) {
              _.assignIn(this.errors, {
                radioDuplicateOptions: 'Please enter unique options for the radio field'
              });
            }

            break;

          case 'flSelect':
            if (this.options.length === 0) {
              _.assignIn(this.errors, {
                selectOptions: 'Please enter options for the dropdown field'
              });
            } else if (this._hasDuplicateOptions(this.options)) {
              _.assignIn(this.errors, {
                selectDuplicateOptions: 'Please enter unique options for the dropdown field'
              });
            }

            break;

          case 'flDate':
          case 'flTime':
            if (this.autofill === 'custom' && !this.value) {
              _.assignIn(this.errors, {
                requiredField: 'This field is required'
              });
            }

            break;

          case 'flTimer':
            if (this.type === 'timer' && this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
              _.assignIn(this.errors, {
                requiredField: 'This field is required'
              });
            }

            break;

          case 'flSlider':
            var max = !this.max ? 100 : Number(this.max);
            var min = !this.min ? 0 : Number(this.min);
            var step = !this.step ? 1 : Number(this.step);

            if (min >= max) {
              _.assignIn(this.errors, {
                sliderMinMax: 'The maximum value must be higher than the minimum value'
              });
            }

            if (step > (max - min)) {
              _.assignIn(this.errors, {
                sliderStep: 'Number of steps should be less than or equal to the difference between maximum value and minimum value'
              });
            }

            break;

          case 'flMatrix':
            if (this.columnOptions.length === 0) {
              _.assignIn(this.errors, {
                matrixColumnOptions: 'Please enter column options for the matrix field'
              });
            } else if (this._hasDuplicateOptions(this.columnOptions)) {
              _.assignIn(this.errors, {
                matrixDuplicateColumnOptions: 'Please enter unique column options for the matrix field'
              });
            }

            if (this.rowOptions.length === 0) {
              _.assignIn(this.errors, {
                matrixRowOptions: 'Please enter row options for the matrix field'
              });
            } else if (this._hasDuplicateOptions(this.rowOptions)) {
              _.assignIn(this.errors, {
                matrixDuplicateRowOptions: 'Please enter unique row options for the matrix field'
              });
            } else {
              var $vm = this;

              _.some(this.rowOptions, function(row) {
                var val = row.id ? row.id : row.label;

                if (val.indexOf('[') > -1 || val.indexOf(']') > -1) {
                  _.assignIn($vm.errors, {
                    matrixRowInvalidOptions: '[ ] characters are not allowed in row options'
                  });

                  return true;
                }
              });
            }

            break;

          default:
            // nothing
        }
      };

      if (!component.mounted) {
        component.mounted = function() {
          this._showNameField = this.name !== this.label;
          this.initTooltip();

          if (componentName === 'flTypeahead') {
            this.initDataProvider();
          }
        };
      }

      component.methods._hideField = function() {
        this.required = false;

        if (this._componentName === 'flGeolocation' && this.isHidden === false) {
          this.autofill = true;
        }
      };

      component.methods._disableAutomatch = function() {
        this._showNameField = true;
        this.initTooltip();
      };

      component.methods._onDefaultValueSourceChanged = function() {
        this.defaultValueKey = '';
        this.value = '';
      };

      component.methods._getDataSourceColumnValues = function() {
        var $vm = this;
        var id = this.dataSourceId;
        var column = this.column;

        Fliplet.Cache.get({
          key: id + '-' + column,
          expire: 60
        }, function getColumnValues() {
          // If there's no cache, return new values, i.e.
          Fliplet.DataSources.connect(id).then(function(connection) {
            connection.getIndex(column).then(function onSuccess(values) {
              $vm.options = _.compact(_.map(values, function(option) {
                if (!option) {
                  return;
                }

                if (typeof option === 'object' || Array.isArray(option)) {
                  option = JSON.stringify(option);
                }

                return {
                  id: (typeof option === 'string' ? option : option.toString()).trim(),
                  label: (typeof option === 'string' ? option : option.toString()).trim()
                };
              }));

              return $vm.options;
            });
          });
        })
          .then(function(result) {
            $vm.options = result;
          });
      };

      if (!component.methods.disableAutomatch) {
        component.methods.disableAutomatch = component.methods._disableAutomatch;
      }

      component.methods._enableAutomatch = function() {
        this._showNameField = false;
        this.name = this.label;
        this.initTooltip();
      };

      if (!component.methods.enableAutomatch) {
        component.methods.enableAutomatch = component.methods._enableAutomatch;
      }

      component.methods._matchFields = function() {
        this.name = this._showNameField ? this.name : this.label;
      };

      if (!component.methods.matchFields) {
        component.methods.matchFields = component.methods._matchFields;
      }

      component.methods._initTooltip = function() {
        var $vm = this;

        $vm.$nextTick(function() {
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
              default:
                // nothing
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

      component.methods._initDataProvider = function() {
        var $vm = this;

        var dataSourceData = {
          dataSourceTitle: 'Your list data',
          dataSourceId: $vm.dataSourceId,
          appId: Fliplet.Env.get('appId'),
          default: {
            name: 'Form data for ' + $vm.name,
            entries: [],
            columns: []
          },
          accessRules: [
            { allow: 'all', type: ['select'] }
          ]
        };


        window.dataProvider = Fliplet.Widget.open('com.fliplet.data-source-provider', {
          selector: '#data-provider',
          data: dataSourceData,
          onEvent: function(event, dataSource) {
            if (event === 'dataSourceSelect') {
              $vm.dataSourceId = dataSource.id;
              $vm.columnOptions = dataSource.columns;
            }
          }
        });

        window.dataProvider.then(function(dataSource) {
          $vm.dataSourceId = dataSource.data.id;
          window.dataProvider = null;
          $vm.triggerSave();
        });
      };

      if (!component.methods.initDataProvider) {
        component.methods.initDataProvider = component.methods._initDataProvider;
      }

      component.methods._removeDataProvider = function() {
        this.dataSourceId = null;
        this.column = '';
        this.columnOptions = null;
        window.dataProvider.close();
        window.dataProvider = null;
      };

      if (!component.methods.removeDataProvider) {
        component.methods.removeDataProvider = component.methods._removeDataProvider;
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
      var hasSelectAll = component.props.addSelectAll && typeof component.props.addSelectAll.default === 'boolean';
      var isSlider = component.props._componentName.default === 'flSlider';
      var isMatrix = component.props._componentName.default === 'flMatrix';
      var isTimer = component.props._componentName.default === 'flTimer';
      var isTypeahead = component.props._componentName.default === 'flTypeahead';

      /**
      * Generate text configurations for radio/checkbox options, separated by new lines
      * @param {Array} options - A list of options to be mapped
      * @returns {String} Text options for the configuration interface
      */
      var generateOptionsAsText = function(options) {
        if (!options) {
          return;
        }

        return options.map(function(option) {
          if (option.id && option.label && option.id !== option.label) {
            return option.label + ' <' + option.id + '>';
          }

          return option.label || option.id;
        }).join('\r\n');
      };

      // If options is an array, automatically deal with options
      if (hasOptions || isMatrix) {
        if (isMatrix) {
          component.computed._rowOptions = function generateRowOptions() {
            return generateOptionsAsText(this.rowOptions);
          };

          component.computed._columnOptions = function generateColumnOptions() {
            return generateOptionsAsText(this.columnOptions);
          };
        } else {
          component.computed._options = function generateOptions() {
            return generateOptionsAsText(this.options);
          };
        }

        component.methods._setOptions = function setOptions(str, attribute) {
          if (!attribute) {
            throw new Error('Attribute must be provided');
          }

          this[attribute] = _.compact(_.map(str.split(/\r?\n/), function(option) {
            if (option !== '') {
              return option.trim();
            }
          }).map(function(rawOption) {
            if (rawOption) {
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
            }
          }));
        };
      }

      component.template = templates['templates.configurations.form']({
        template: template && template() || '',
        hasOptions: hasOptions,
        hasSelectAll: hasSelectAll,
        isSlider: isSlider,
        isTimer: isTimer,
        isTypeahead: isTypeahead
      });

      Vue.component(componentName + 'Config', component);
    }
  };
})();
