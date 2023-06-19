/* eslint-disable eqeqeq */
var widgetId = parseInt(Fliplet.Widget.getDefaultId(), 10);
var widgetUuid = Fliplet.Widget.getUUID(widgetId);
var data = Fliplet.Widget.getData(widgetId) || {};

// Cleanup
if (data.fields) {
  data.fields = _.compact(data.fields);
}

if (Array.isArray(data.onSubmit) && data.onSubmit.length) {
  data.onSubmit.forEach(function(el, i) {
    if (el === 'templatedEmail') {
      data.onSubmit.splice(i, 1);
    }
  });

  data.onSubmit = data.onSubmit;
}

// Quick migration: "emailTemplate" has been renamed to "emailTemplateAdd"
if (data.settings && data.settings.emailTemplate) {
  if (!data.settings.emailTemplateAdd) {
    data.settings.emailTemplateAdd = data.settings.emailTemplate;
  }

  data.settings.emailTemplate;
}

function changeSelectText() {
  setTimeout(function() {
    $('.hidden-select:not(.component .hidden-select)').each(function() {
      var selectedText = $(this).find('option:selected').text();

      if (selectedText !== '') {
        $(this).parents('.select-proxy-display').find('.select-value-proxy').html(selectedText);
      } else {
        $(this).parents('.select-proxy-display').find('.select-value-proxy').html('Select a data source');
      }
    });
  }, 1);
}

function attachObservers() {
  var $accordion = $('#componentsAccordion');

  var recalculateHeight = function(obj) {
    var $panelHeading = $('.panel-heading');
    var tabsHeight = $panelHeading.outerHeight() * $panelHeading.length;
    var borders = $panelHeading.length * 3;
    var wrapperHeight = $('.components-list .form-html').innerHeight() - tabsHeight;

    obj.children('.panel-body').css('height', wrapperHeight - borders);
    obj.children('.panel-body').fadeIn(250);
    obj.children('.panel-body').animate({
      scrollTop: 0
    }, 250);
  };

  recalculateHeight($('.panel-collapse'));

  $accordion.on('show.bs.collapse', '.panel-collapse', function() {
    recalculateHeight($(this));
  });

  $accordion.on('hide.bs.collapse', '.panel-collapse', function() {
    $(this).children('.panel-body').fadeOut(250);
  });
}

function formatSeconds(seconds) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  return { hours, minutes, seconds: remainingSeconds };
}

Vue.directive('sortable', {
  inserted: function(el, binding) {
    if (Sortable) {
      new Sortable(el, binding.value || {});
    }
  }
});

function generateFormDefaults(data) {
  return _.assign({
    name: '',
    dataSourceId: '',
    templateId: '',
    previewingTemplate: '',
    fields: [],
    offline: true,
    isPlaceholder: false,
    redirect: false,
    dataStore: [],
    onSubmit: [],
    template: false,
    saveProgress: true,
    autobindProfileEditing: false,
    resultHtml: Fliplet.Widget.Templates['templates.configurations.form-result'](),
    createdBy: {
      id: Fliplet.User.get('id'),
      fullName: Fliplet.User.get('fullName')
    }
  }, data);
}

var selector = '#app';

// Constants
var SAVE_BUTTON_LABELS = {
  SAVE: 'Save',
  SAVE_AND_CLOSE: 'Save & Close'
};

var CANCEL_BUTTON_LABEL = 'Cancel';

// Wait for form fields to be ready, as they get defined after translations are initialized
Fliplet().then(function() {
  new Vue({
    el: selector,
    data: function() {
      var formSettings = generateFormDefaults(data);

      return {
        categories: Fliplet.FormBuilder.categories(),
        fields: formSettings.fields,
        activeFieldConfigType: null,
        activeField: {},
        activeFieldName: '',
        activeFieldIdx: -1,
        isAddingFields: false,
        dataSources: [],
        section: 'form', // form or settings
        settings: formSettings,
        templates: [],
        readMore: [],
        systemTemplates: [],
        organizationTemplates: [],
        chooseTemplate: (!formSettings.templateId || formSettings.previewingTemplate !== ''),
        toChangeTemplate: false,
        permissionToChange: false,
        newTemplate: '',
        redirect: formSettings.redirect,
        toggleTemplatedEmailAdd: formSettings.onSubmit.indexOf('templatedEmailAdd') > -1,
        toggleTemplatedEmailEdit: formSettings.onSubmit.indexOf('templatedEmailEdit') > -1,
        toggleGenerateEmail: formSettings.onSubmit.indexOf('generateEmail') > -1,
        showExtraAdd: formSettings.dataSourceId && formSettings.dataStore.indexOf('dataSource') > -1,
        showExtraEdit: formSettings.dataSourceId && formSettings.dataStore.indexOf('editDataSource') > -1,
        userData: {},
        deviceType: 'tablet',
        defaultEmailSettings: {
          subject: '',
          html: '',
          to: []
        },
        defaultEmailSettingsForCompose: {
          subject: '',
          html: '',
          to: []
        },
        emailTemplateAdd: formSettings.emailTemplateAdd || undefined,
        emailTemplateEdit: formSettings.emailTemplateEdit || undefined,
        generateEmailTemplate: formSettings.generateEmailTemplate || undefined,
        showDataSourceSettings: !!formSettings.dataSourceId,
        organizationName: '',
        editor: undefined,
        accessRules: [
          {
            allow: 'all',
            type: ['select']
          }
        ],
        newColumns: []
      };
    },
    computed: {
      hasRequiredFields: function() {
        return this.fields.some(function(el) {
          return !!el.required;
        });
      },
      missingColumns: function() {
        return this.newColumns.join(', ');
      },
      missingColumnsMessage: function() {
        if (this.newColumns.length === 1) {
          return '1 column missing in the data source.';
        }

        if (this.newColumns.length > 1) {
          return this.newColumns.length + ' columns missing in the data source.';
        }

        return '';
      }
    },
    methods: {
      generateColumns: function() {
        var $vm = this;

        Fliplet.DataSources.update(this.settings.dataSourceId, {
          newColumns: this.newColumns
        }).then(function() {
          return $vm.getDataSourceColumns();
        }).then(function(columns) {
          $vm.setNewColumns(columns);
        });
      },
      onSort: function(event) {
        this.fields.splice(event.newIndex, 0, this.fields.splice(event.oldIndex, 1)[0]);
      },
      onAdd: function(event) {
        var componentName;
        var component;
        var value;

        if (event.item.parentElement.className !== 'panel-body') {
          componentName = event.item.dataset.field;
          component = Fliplet.FormBuilder.components()[componentName];
          value = component.props.value;

          $(event.item).remove();

          var fieldsWithSameName = _.filter(this.fields, function(item) {
            return item.name.match(component.name.replace('(', '\\(').replace(')', '\\)'));
          });

          var index = fieldsWithSameName.length;
          var defaultName = component.name + (index ? '-' + index : '');

          return this.fields.splice(event.newIndex, 0, {
            _type: componentName,
            _submit: typeof component.submit !== 'undefined' ? component.submit : true,
            name: defaultName,
            label: defaultName,
            value: value.default || value.type()
          });
        }
      },
      updateAccessTypes: function() {
        this.toggleAccessType('insert', this.showExtraAdd);
        this.toggleAccessType('update', this.showExtraEdit);
      },
      deleteField: function(fieldLabel, index) {
        var $vm = this;

        Fliplet.Modal.confirm({
          message: '<p>Are you sure you want to delete the following field?</p><p><strong>' + fieldLabel + '</strong></p>',
          buttons: {
            confirm: {
              label: 'Delete field',
              className: 'btn-danger'
            }
          },
          size: 'small'
        }).then(function(result) {
          if (result) {
            $vm.fields.splice(index, 1);
            $vm.activeFieldConfigType = null;
          }
        });
      },
      onFieldClick: function(field) {
        this.activeFieldConfigType = field._type.toString() + 'Config';
        this.activeFieldName = Fliplet.FormBuilder.components()[field._type].name;
        this.activeFieldIdx = _.findIndex(this.fields, {
          name: field.name
        });
        this.activeField = field;
        changeSelectText();
        Fliplet.Studio.emit('widget-save-label-update');
        Fliplet.Studio.emit('widget-cancel-label-update');
        Fliplet.Widget.toggleCancelButton(false);
        this.$forceUpdate();
      },
      closeEdit: function() {
        this.activeFieldConfigType = null;
        this.activeField = {};
        Fliplet.Studio.emit('widget-save-label-reset');
        Fliplet.Widget.setCancelButtonLabel(CANCEL_BUTTON_LABEL);
        Fliplet.Widget.toggleCancelButton(true);
      },
      onFieldSettingChanged: function(fieldData) {
        var $vm = this;

        Object.keys(fieldData).forEach(function(prop) {
          $vm.activeField[prop] = fieldData[prop];
        });

        $vm.save();
        Fliplet.Studio.emit('reload-widget-instance', widgetId);
        Fliplet.Widget.setCancelButtonLabel(CANCEL_BUTTON_LABEL);
        Fliplet.Widget.toggleCancelButton(true);
        this.closeEdit();
      },
      changeTemplate: function() {
        this.toChangeTemplate = true;
        Fliplet.Studio.emit('widget-mode', 'normal');

        if (this.toChangeTemplate) {
          Fliplet.Studio.emit('widget-save-label-update', {
            text: 'Update form template'
          });
          Fliplet.Widget.toggleSaveButton(false);
        }

        changeSelectText();
      },
      goBack: function() {
        this.toChangeTemplate = false;
        Fliplet.Studio.emit('widget-save-label-reset');
        Fliplet.Widget.toggleSaveButton(true);

        if (this.isAddingFields) {
          Fliplet.Studio.emit('widget-mode', 'wide');
        }
      },
      save: function(initial) {
        var $vm = this;

        if (initial) {
          // Untick "Set template" checkbox when creating a form from Template
          $vm.settings.template = false;

          // Clear the default description
          $vm.settings.description = '';
        }

        if (this.settings.onSubmit.indexOf('templatedEmailAdd') > -1) {
          this.settings.emailTemplateAdd = this.emailTemplateAdd || this.defaultEmailSettings;
        }

        if (this.settings.onSubmit.indexOf('templatedEmailEdit') > -1) {
          this.settings.emailTemplateEdit = this.emailTemplateEdit || this.defaultEmailSettings;
        }

        if (this.settings.onSubmit.indexOf('generateEmail') > -1) {
          this.settings.generateEmailTemplate = this.generateEmailTemplate || this.defaultEmailSettingsForCompose;
        }

        $vm.settings.name = $vm.settings.displayName;

        // Cleanup
        this.settings.fields = _.compact(this.fields);

        return Fliplet.Widget.save(this.settings).then(function onSettingsUpdated() {
          return $vm.updateDataSourceHooks();
        });
      },
      createDefaultBodyTemplate: function(fields) {
        // Creates default email template
        var defaultEmailTemplate = '<h1>' + this.settings.name + '</h1><p>A form submission has been received.</p>';

        defaultEmailTemplate += '<ul>';

        fields.forEach(function(field) {
          if (typeof field._submit === 'undefined' || field._submit) {
            defaultEmailTemplate += '<li style="line-height: 24px;">' + field.label + ': {{[' + field.name + ']}}</li>';
          }
        });
        defaultEmailTemplate += '</ul>';

        return defaultEmailTemplate;
      },
      configureEmailTemplateAdd: function() {
        var $vm = this;
        var emailProviderData = ($vm.settings && $vm.settings.emailTemplateAdd) || $vm.defaultEmailSettings;

        emailProviderData.options = {
          usage: {
            '[field-x]': 'Insert the value entered in the form field.<br><i>To see the ID of each form field, click to edit the field and the ID can be seen at the top right corner.</i>',
            appName: 'Insert your app name',
            organizationName: 'Insert your organization name'
          }
        };

        window.emailTemplateAddProvider = Fliplet.Widget.open('com.fliplet.email-provider', {
          data: emailProviderData
        });

        Fliplet.Widget.toggleCancelButton(false);
        Fliplet.Widget.setSaveButtonLabel(SAVE_BUTTON_LABELS.SAVE);

        window.emailTemplateAddProvider.then(function onForwardEmailProvider(result) {
          window.emailTemplateAddProvider = null;
          Fliplet.Widget.toggleCancelButton(true);
          $vm.emailTemplateAdd = result.data;
          $vm.settings.emailTemplateAdd = JSON.parse(JSON.stringify($vm.emailTemplateAdd));

          var operation;

          if ($vm.settings.dataStore.indexOf('dataSource') > -1 && $vm.settings.dataSourceId) {
            var payload = JSON.parse(JSON.stringify($vm.emailTemplateAdd));

            operation = Fliplet.DataSources.getById($vm.settings.dataSourceId).then(function(dataSource) {
              // Find hooks to update
              var hooks = _.filter(dataSource.hooks, {
                type: 'email',
                runOn: ['insert'],
                widgetInstanceId: widgetId
              });

              if (hooks.length) {
                // Update hooks
                hooks.forEach(function(hook) {
                  hook.payload = payload;
                });
              } else {
                // Add new hook
                dataSource.hooks.push({
                  type: 'email',
                  runOn: ['insert'],
                  widgetInstanceId: widgetId,
                  payload: payload,
                  triggers: [widgetUuid]
                });
              }

              return Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
            });
          } else {
            operation = Promise.resolve();
          }

          operation.then(function() {
            $vm.save().then(function() {
              Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
            });
            Fliplet.Widget.autosize();
            Fliplet.Widget.setSaveButtonLabel(SAVE_BUTTON_LABELS.SAVE_AND_CLOSE);
          });
        });
      },
      configureEmailTemplateEdit: function() {
        var $vm = this;
        var emailProviderData = ($vm.settings && $vm.settings.emailTemplateEdit) || $vm.defaultEmailSettings;

        emailProviderData.options = {
          usage: {
            '[field-x]': 'Insert the value entered in the form field.<br><i>To see the ID of each form field, click to edit the field and the ID can be seen at the top right corner.</i>',
            appName: 'Insert your app name',
            organizationName: 'Insert your organization name'
          }
        };

        window.emailTemplateEditProvider = Fliplet.Widget.open('com.fliplet.email-provider', {
          data: emailProviderData
        });

        Fliplet.Widget.toggleCancelButton(false);
        Fliplet.Widget.setSaveButtonLabel(SAVE_BUTTON_LABELS.SAVE);

        window.emailTemplateEditProvider.then(function onForwardEmailProvider(result) {
          window.emailTemplateEditProvider = null;
          Fliplet.Widget.toggleCancelButton(true);
          $vm.emailTemplateEdit = result.data;
          $vm.settings.emailTemplateEdit = JSON.parse(JSON.stringify($vm.emailTemplateEdit));

          var operation;

          if ($vm.settings.dataStore.indexOf('editDataSource') > -1 && $vm.settings.dataSourceId) {
            var payload = JSON.parse(JSON.stringify($vm.emailTemplateEdit));

            operation = Fliplet.DataSources.getById($vm.settings.dataSourceId).then(function(dataSource) {
              // Find hooks to update
              var hooks = _.filter(dataSource.hooks, {
                type: 'email',
                runOn: ['update'],
                widgetInstanceId: widgetId
              });

              if (hooks.length) {
                // Update hooks
                hooks.forEach(function(hook) {
                  hook.payload = payload;
                });
              } else {
                // Add new hook
                dataSource.hooks.push({
                  type: 'email',
                  runOn: ['update'],
                  widgetInstanceId: widgetId,
                  payload: payload,
                  triggers: [widgetUuid]
                });
              }

              return Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
            });
          } else {
            operation = Promise.resolve();
          }

          operation.then(function() {
            $vm.save().then(function() {
              Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
            });
            Fliplet.Widget.autosize();
            Fliplet.Widget.setSaveButtonLabel(SAVE_BUTTON_LABELS.SAVE_AND_CLOSE);
          });
        });
      },
      configureEmailTemplateForCompose: function() {
        var $vm = this;
        var emailProviderData = ($vm.settings && $vm.settings.generateEmailTemplate) || $vm.defaultEmailSettingsForCompose;

        emailProviderData.options = {
          usage: {
            'field-x': 'Insert the value entered in the form field.<br><i>To see the ID of each form field, click to edit the field and the ID can be seen at the top right corner.</i>',
            appName: 'Insert your app name',
            organizationName: 'Insert your organization name'
          }
        };

        window.generateEmailProvider = Fliplet.Widget.open('com.fliplet.email-provider', {
          data: emailProviderData
        });

        Fliplet.Widget.toggleCancelButton(false);
        Fliplet.Widget.setSaveButtonLabel(SAVE_BUTTON_LABELS.SAVE);

        window.generateEmailProvider.then(function onForwardEmailProvider(result) {
          window.generateEmailProvider = null;
          Fliplet.Widget.toggleCancelButton(true);
          $vm.generateEmailTemplate = result.data;
          $vm.save().then(function() {
            Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
          });
          Fliplet.Widget.autosize();
          Fliplet.Widget.setSaveButtonLabel(SAVE_BUTTON_LABELS.SAVE_AND_CLOSE);
        });
      },
      checkEmailTemplate: function() {
        if (!this.settings.emailTemplateAdd) {
          this.defaultEmailSettings.subject = 'Form entries from "' + this.settings.name + '" form';
          this.defaultEmailSettings.html = this.createDefaultBodyTemplate(this.fields);
        }

        if (!this.settings.emailTemplateEdit) {
          this.defaultEmailSettings.subject = 'Form entries from "' + this.settings.name + '" form';
          this.defaultEmailSettings.html = this.createDefaultBodyTemplate(this.fields);
        }
      },
      checkGenerateEmailTemplate: function() {
        if (!this.settings.generateEmailTemplate) {
          this.defaultEmailSettingsForCompose.subject = 'Form entries from "' + this.settings.name + '" form';
          this.defaultEmailSettingsForCompose.html = this.createDefaultBodyTemplate(this.fields);
        }
      },
      getDataSourceColumns: function() {
        return Fliplet.DataSources.getById(this.settings.dataSourceId, {
          cache: false,
          attributes: 'columns'
        }).then(function(dataSource) {
          return dataSource.columns || [];
        });
      },
      updateDataSourceHooks: function() {
        var dataSourceId = this.settings.dataSourceId;
        var newColumns = _.chain(this.fields)
          .filter(function(field) {
            return field._submit !== false;
          })
          .map('name')
          .value();

        var fieldsToHash = _.map(_.filter(this.fields, function(field) {
          return !!field.hash;
        }), 'name');

        if (!dataSourceId) {
          return Promise.resolve();
        }

        return Fliplet.DataSources.getById(dataSourceId).then(function(ds) {
          ds.columns = ds.columns || [];

          var hooksDeleted;
          var columns = _.uniq(newColumns.concat(ds.columns));

          // remove existing hooks for the operations from the same widget instance
          ds.hooks = _.reject(ds.hooks || [], function(hook) {
            var remove = hook.widgetInstanceId == widgetId && hook.type == 'operations';

            if (remove) {
              hooksDeleted = true;
            }

            return remove;
          });

          // add fields that need to be hashed to data source hooks
          if (fieldsToHash) {
            var payload = {};

            fieldsToHash.forEach(function(field) {
              payload[field] = ['hash'];
            });

            ds.hooks.push({
              widgetInstanceId: widgetId,
              type: 'operations',
              runOn: ['beforeSave', 'beforeQuery'],
              payload: payload
            });
          } else if (!hooksDeleted) {
            if (_.isEqual(columns.sort(), ds.columns.sort())) {
              return; // no need to update
            }
          }

          return Fliplet.DataSources.update(dataSourceId, {
            hooks: ds.hooks
          });
        });
      },
      triggerSave: function() {
        var $vm = this;

        if ($vm.chooseTemplate) {
          if ($vm.settings.templateId) {
            $vm.chooseTemplate = false;
            Fliplet.Widget.toggleSaveButton(true);
            Fliplet.Studio.emit('widget-save-label-reset');
          }

          return;
        }

        if ($vm.toChangeTemplate) {
          if ($vm.newTemplate) {
            $vm.isAddingFields = false;
            $vm.toChangeTemplate = false;
            $vm.permissionToChange = false;
            $vm.settings.templateId = $vm.newTemplate;
            Fliplet.Studio.emit('widget-save-label-reset');
          }

          return;
        }

        // Add progress
        $('.spinner-holder p').text('Please wait while we save your changes...');
        $(selector).addClass('is-loading');

        // Save and close
        $vm.save().then(function() {
          Fliplet.Widget.complete();
          Fliplet.Studio.emit('reload-page-preview');
        });
      },
      previewTemplate: function(templateId) {
        this.updateFormSettings(templateId, true);

        this.save(true).then(function onSettingsSaved() {
          Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
        });
      },
      useTemplate: function(templateId) {
        Fliplet.Studio.emit('widget-save-label-reset');
        Fliplet.Widget.toggleSaveButton(true);

        var $vm = this;

        this.settings.previewingTemplate = '';

        this.updateFormSettings(templateId, false);

        $vm.save(true).then(function onSettingsSaved() {
          $(selector).removeClass('is-loading');
          Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
          $vm.triggerSave();
        });
      },
      updateFormSettings: function(templateId, preview) {
        var formTemplate = _.find(this.templates, function(template) {
          return template.id === templateId;
        });

        var settings = formTemplate.settings;

        settings.templateId = formTemplate.id;
        settings.isPlaceholder = false;
        settings.name = this.settings.name;

        this.settings = generateFormDefaults(settings);
        this.fields = this.settings.fields;

        if (this.chooseTemplate && preview) {
          this.settings.previewingTemplate = templateId;

          return;
        }
      },
      toggleReadMore: function(more, templateId) {
        var $vm = this;
        var index = $vm.readMore.indexOf(templateId);

        if (more) {
          $vm.readMore.push(templateId);

          return;
        }

        if (index > -1) {
          $vm.readMore.splice(index, 1);
        }
      },
      truncate: function(string, maxChars) {
        if (string.length > maxChars) {
          return string.substring(0, maxChars) + '...';
        }

        return string;
      },
      initDataSourceProvider: function() {
        var $vm = this;
        var dataSourceData = {
          dataSourceTitle: 'Form data source',
          dataSourceId: $vm.settings.dataSourceId,
          appId: Fliplet.Env.get('appId'),
          default: {
            name: 'Form data for ' + $vm.settings.displayName,
            entries: [],
            columns: []
          },
          accessRules: $vm.accessRules
        };

        window.dataSourceProvider =  Fliplet.Widget.open('com.fliplet.data-source-provider', {
          selector: '#data-source-provider',
          data: dataSourceData,
          onEvent: function(event, dataSource) {
            if (event === 'dataSourceSelect') {
              $vm.settings.dataSourceId = dataSource.id;
            }

            $vm.getDataSourceColumns().then(function(columns) {
              $vm.setNewColumns(columns);
            });
          }
        });

        window.dataSourceProvider.then(function(dataSource) {
          $vm.settings.dataSourceId = dataSource.data.id;

          window.dataSourceProvider = null;

          $vm.triggerSave();
        });
      },
      initLinkProvider: function() {
        var $vm = this;
        var page = Fliplet.Widget.getPage();
        var omitPages = page ? [page.id] : [];

        var action = $.extend(true, {
          action: 'screen',
          page: '',
          transition: 'slide.left',
          omitPages: omitPages,
          options: {
            hideAction: true
          }
        }, $vm.settings.linkAction);

        // Ensures action is set
        // Otherwise, if action is 'none' the link provider will be hidden
        action.action = 'screen';

        window.linkProvider = Fliplet.Widget.open('com.fliplet.link', {
          selector: '#linkAction',
          data: action
        });

        window.linkProvider.then(function onLinkAction(result) {
          if (result && result.data && result.data.action) {
            $vm.settings.linkAction = result.data;
          }

          window.linkProvider = null;
          $vm.triggerSave();
        });
      },
      toggleAccessType: function(type, isTypeActive) {
        var accessRuleIndex = -1;
        var defaultRule = {
          allow: 'all',
          type: type.split()
        };

        this.accessRules.forEach(function(rule, index) {
          var typeIndex = rule.type.indexOf(type);

          if (typeIndex !== -1) {
            accessRuleIndex = index;
          }
        });

        if (isTypeActive && accessRuleIndex === -1) {
          this.accessRules.push(defaultRule);
        } else if (!isTypeActive && accessRuleIndex > -1) {
          this.accessRules.splice(accessRuleIndex, 1);
        }
      },
      setupCodeEditor: function() {
        var $vm = this;

        tinymce.init({
          target: $vm.$refs.resulthtml,
          theme: 'modern',
          mobile: {
            theme: 'mobile',
            plugins: ['autosave', 'lists', 'autolink'],
            toolbar: ['bold', 'italic', 'underline', 'bullist', 'numlist', 'removeformat']
          },
          plugins: [
            'advlist autolink lists link directionality',
            'autoresize fullscreen code paste'
          ].join(' '),
          toolbar: [
            'bold italic underline',
            'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
            'ltr rtl | link | removeformat code fullscreen'
          ].join(' | '),
          image_advtab: true,
          menubar: false,
          statusbar: false,
          inline: false,
          resize: false,
          autoresize_bottom_margin: 5,
          autofocus: false,
          branding: false,
          valid_elements: '*[*]',
          allow_script_urls: true,
          min_height: 200,
          setup: function(editor) {
            editor.on('init', function() {
              $vm.resultEditor = editor;

              // initialize value if it was set prior to initialization
              if ($vm.settings.resultHtml) {
                var updatedHtml = $vm.convertVueEventAttributes($vm.settings.resultHtml);

                editor.setContent(updatedHtml, { format: 'raw' });
              }
            });

            editor.on('change', function() {
              $vm.settings.resultHtml = editor.getContent();
            });
          }
        });
      },

      // Converts @event attributes to v-on:event
      convertVueEventAttributes: function(html) {
        var $html = $('<div/>').append(html);
        var $allElements = $html.find('*');

        _.each($allElements, function(el) {
          var $el = $(el);

          _.each(el.attributes, function(attr) {
            if (_.startsWith(attr.name, '@')) {
              var event = attr.name.split('.');
              var newAttrName = event[0].replace('@', 'v-on:');
              var newAttrValue = attr.value === 'start()' ? 'start($event)' : attr.value;

              $el.attr(newAttrName, newAttrValue);
              $el.removeAttr(attr.name);
            }
          });
        });

        return $html.html();
      },
      loadTemplates: function() {
        if (data.fields && data.templateId && !data.previewingTemplate) {
          return Promise.resolve(); // do not load templates when editing a form as such UI is not shown
        }

        var $vm = this;

        return Fliplet.FormBuilder.templates().then(function(templates) {
          $vm.templates = templates.system.concat(templates.organization);
          $vm.systemTemplates = templates.system;
          $vm.organizationTemplates = templates.organization;

          if (!$vm.organizationTemplates.length) {
            var blankTemplateId = $vm.systemTemplates[0].id;

            $vm.settings.isPlaceholder = false;
            $vm.useTemplate(blankTemplateId);
          } else {
            Fliplet.Widget.save(_.assign(data, { isPlaceholder: true })).then(function() {
              $(selector).removeClass('is-loading');
              Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
            });
          }
        });
      },
      setNewColumns: function(columns) {
        var fieldNames = [];
        var fields = _.chain(this.fields)
          .filter(function(field) {
            return field._submit !== false;
          })
          .value();

        fields.forEach(function(field) {
          if (field._type === 'flDateRange' || field._type === 'flTimeRange') {
            fieldNames.push(`${field.name} [Start]`);
            fieldNames.push(`${field.name} [End]`);
          } else {
            fieldNames.push(field.name);
          }
        });

        if (!columns.length) {
          this.newColumns = fieldNames;
        }

        this.newColumns = _.filter(fieldNames, function(item) {
          return !_.includes(columns, item);
        });
      }
    },
    watch: {
      'dataSources': function() {
        changeSelectText();
      },
      'settings.dataSourceId': function(value) {
        this.showDataSourceSettings = value && value !== 'new';

        if (!this.showDataSourceSettings) {
          this.showExtraAdd = false;
          this.showExtraEdit = false;
          this.settings.dataStore = [];
        }
      },
      'permissionToChange': function(newVal) {
        Fliplet.Widget.toggleSaveButton(newVal);
      },
      'isAddingFields': function(newVal) {
        if (newVal) {
          Fliplet.Studio.emit('widget-mode', 'wide');
          setTimeout(function() {
            attachObservers();
          }, 1);
        } else {
          Fliplet.Studio.emit('widget-mode', 'normal');
        }
      },
      'section': function(value) {
        var $vm = this;

        if (value === 'settings') {
          $vm.setupCodeEditor();
          changeSelectText();
        } else {
          tinymce.remove();
        }
      },
      'settings.dataStore': function(value) {
        this.showExtraAdd = value.indexOf('dataSource') > -1;
        this.showExtraEdit = value.indexOf('editDataSource') > -1;

        this.updateAccessTypes();

        if (window.dataSourceProvider) {
          window.dataSourceProvider.emit('update-security-rules', { accessRules: this.accessRules });
        }
      },
      'settings.onSubmit': function(array) {
        var $vm = this;

        if (array.indexOf('generateEmail') > -1) {
          this.toggleGenerateEmail = true;
          this.checkGenerateEmailTemplate();
        } else {
          this.toggleGenerateEmail = false;
        }

        if (array.indexOf('templatedEmailAdd') > -1) {
          this.toggleTemplatedEmailAdd = true;
          this.checkEmailTemplate();
        } else {
          this.toggleTemplatedEmailAdd = false;

          // Remove hook
          if ($vm.settings.dataSourceId && $vm.settings.dataSourceId !== '') {
            Fliplet.DataSources.getById($vm.settings.dataSourceId).then(function(dataSource) {
              dataSource.hooks = dataSource.hooks || [];

              if (dataSource.hooks.length) {
                var index = _.findIndex(dataSource.hooks, function(o) {
                  return o.widgetInstanceId == widgetId && o.runOn.indexOf('insert') > -1;
                });

                if (index > -1) {
                  dataSource.hooks.splice(index, 1);

                  Fliplet.DataSources.update($vm.settings.dataSourceId, {
                    hooks: dataSource.hooks
                  });
                }
              }
            });
          }
        }

        if (array.indexOf('templatedEmailEdit') > -1) {
          this.toggleTemplatedEmailEdit = true;
          this.checkEmailTemplate();
        } else {
          this.toggleTemplatedEmailEdit = false;

          // Remove hook
          if ($vm.settings.dataSourceId && $vm.settings.dataSourceId !== '') {
            Fliplet.DataSources.getById($vm.settings.dataSourceId).then(function(dataSource) {
              dataSource.hooks = dataSource.hooks || [];

              if (dataSource.hooks.length) {
                var index = _.findIndex(dataSource.hooks, function(o) {
                  return o.widgetInstanceId == widgetId && o.runOn.indexOf('update') > -1;
                });

                if (index > -1) {
                  dataSource.hooks.splice(index, 1);

                  Fliplet.DataSources.update($vm.settings.dataSourceId, {
                    hooks: dataSource.hooks
                  });
                }
              }
            });
          }
        }
      },
      'userData': function(data) {
        this.defaultEmailSettings.to.push({
          email: data.email,
          type: 'to'
        });
      },
      'settings.template': function(value) {
        if (value) {
          this.editor.setContent(this.settings.description);
        }
      },
      fields: {
        deep: true,
        immediate: true,
        handler: function() {
          if (this.settings.dataSourceId) {
            var $vm = this;

            this.getDataSourceColumns().then(function(columns) {
              $vm.setNewColumns(columns);
            });
          }
        }
      }
    },
    created: function() {
      var $vm = this;

      Fliplet.FormBuilder.on('field-settings-changed', this.onFieldSettingChanged);

      Fliplet.Studio.getPreviewDevice().then(function(data) {
        data = data || {};

        if (data.deviceType) {
          $vm.deviceType = data.deviceType;
        }
      });

      this.loadTemplates().then(function() {
        if ($vm.organizationTemplates.length || data.fields) {
          $(selector).removeClass('is-loading');
        }

        $($vm.$refs.templateDescription).tinymce({
          plugins: [
            'lists advlist image charmap hr code',
            'searchreplace wordcount insertdatetime table textcolor colorpicker'
          ],
          toolbar: [
            'formatselect |',
            'bold italic underline strikethrough |',
            'forecolor backcolor |',
            'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |',
            'blockquote subscript superscript | table insertdatetime charmap hr |',
            'removeformat | code'
          ].join(' '),
          menubar: false,
          statusbar: false,
          min_height: 300,
          setup: function(ed) {
            $vm.editor = ed;
            $vm.editor.on('keyup paste', function() {
              $vm.settings.description = $vm.editor.getContent();
            });
          }
        });

        if ($vm.chooseTemplate && $vm.$refs.templateGallery) {
          setTimeout(function() {
            $($vm.$refs.templateGallery).find('[data-toggle="tooltip"]').tooltip({
              container: 'body'
            });
          }, 500);
        }
      });

      Fliplet.Studio.onEvent(function(evt) {
        if (evt.detail.type === 'widgetCancel') {
          this.settings = generateFormDefaults(data);
        }
      });

      Fliplet.Studio.onMessage((event) => {
        if (event && event.data && event.data.type === 'set-preview-device') {
          this.deviceType = event.data.deviceType || 'tablet';
        }
      });
    },
    beforeDestroy: function() {
      Fliplet.FormBuilder.off('field-settings-changed', this.onFieldSettingChanged);
    },
    mounted: function() {
      window.emailTemplateAddProvider = null;
      window.emailTemplateEditProvider = null;
      window.generateEmailProvider = null;
      window.linkProvider = null;

      var $vm = this;

      $vm.settings.name = $vm.settings.name || 'Untitled form';

      $vm.settings.fields.forEach(function(field) {
        if (field._type === 'flTimer') {
          var displayValues = formatSeconds(field.initialTimerValue);

          field.hours = displayValues.hours;
          field.minutes = displayValues.minutes;
          field.seconds = displayValues.seconds;
        }
      });

      if (!$vm.showDataSourceSettings) {
        $vm.settings.dataStore = [];
      }

      if (this.chooseTemplate) {
        Fliplet.Studio.emit('widget-save-label-update', {
          text: ''
        });

        // Init tooltip
        if ($vm.$refs.templateGallery) {
          $($vm.$refs.templateGallery).find('[data-toggle="tooltip"]').tooltip();
        }
      }

      // Init tooltip
      if ($vm.$refs.formSettings) {
        $($vm.$refs.formSettings).find('[data-toggle="tooltip"]').tooltip();
      }

      var savedLinkData = $vm.settings && $vm.settings.linkAction;

      $.extend(true, {
        action: 'screen',
        page: '',
        transition: 'slide.left',
        options: {
          hideAction: true
        }
      }, savedLinkData);

      this.updateAccessTypes();

      if (!window.linkProvider) {
        $vm.initLinkProvider();
      }

      if (!window.dataSourceProvider && $vm.section === 'settings') {
        $vm.initDataSourceProvider();
      }

      Fliplet.Organizations.get().then(function(organizations) {
        $vm.organizationName = organizations.length && organizations[0].name;
      });

      Fliplet.Widget.onSaveRequest(function() {
        if (window.emailTemplateAddProvider) {
          return window.emailTemplateAddProvider.forwardSaveRequest();
        }

        if (window.emailTemplateEditProvider) {
          return window.emailTemplateEditProvider.forwardSaveRequest();
        }

        if (window.generateEmailProvider) {
          return window.generateEmailProvider.forwardSaveRequest();
        }

        if (window.currentProvider) {
          return window.currentProvider.forwardSaveRequest();
        }

        if (window.linkProvider) {
          return window.linkProvider.forwardSaveRequest();
        }

        if (window.dataSourceProvider) {
          window.dataSourceProvider.forwardSaveRequest();
        }

        $vm.triggerSave();
      });

      Fliplet.Widget.onCancelRequest(function() {
        var emailProviderNames = [
          'emailTemplateAddProvider',
          'emailTemplateEditProvider',
          'generateEmailProvider'
        ];

        _.each(emailProviderNames, function(providerName) {
          if (window[providerName]) {
            window[providerName].close();
            window[providerName] = null;
            Fliplet.Widget.setSaveButtonLabel(SAVE_BUTTON_LABELS.SAVE_AND_CLOSE);
          }
        });

        Fliplet.Widget.toggleCancelButton(true);
      });

      Fliplet.User.fetch().then(function(user) {
        $vm.userData = user;
      });
    },
    updated: function() {
      var $vm = this;

      if (!window.linkProvider) {
        $vm.initLinkProvider();
      }

      if (!window.dataSourceProvider && $vm.section === 'settings') {
        $vm.initDataSourceProvider();
      }
    }
  });
});
