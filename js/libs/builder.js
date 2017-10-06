var widgetId = parseInt(Fliplet.Widget.getDefaultId(), 10);
var data = Fliplet.Widget.getData(widgetId) || {};

// Cleanup
if (data.fields) {
  data.fields = _.compact(data.fields);
}
if (Array.isArray(data.onSubmit) && data.onSubmit.length) {
  data.onSubmit.forEach(function(el, i) {
    if(el === 'templatedEmail'){
      data.onSubmit.splice(i, 1);
    }
  });

  data.onSubmit = data.onSubmit;
}

function changeSelectText() {
  setTimeout(function() {
    $('.hidden-select:not(.component .hidden-select)').each(function() {
      var selectedText = $(this).find('option:selected').text()
      if (selectedText !== '') {
        $(this).parents('.select-proxy-display').find('.select-value-proxy').html(selectedText)
      } else {
        $(this).parents('.select-proxy-display').find('.select-value-proxy').html('Select a data source')
      }
    })
  }, 1)
}

function attachObservers() {
  var $accordion = $('#componentsAccordion')

  var recalculateHeight = function(obj) {
    var $panelHeading = $('.panel-heading')
    var tabsHeight = $panelHeading.outerHeight() * $panelHeading.length
    var borders = $panelHeading.length * 3
    var wrapperHeight = $('.components-list .form-html').innerHeight() - tabsHeight

    obj.children('.panel-body').css('height', wrapperHeight - borders)
    obj.children('.panel-body').fadeIn(250)
    obj.children('.panel-body').animate({
      scrollTop: 0
    }, 250)
  }

  recalculateHeight($('.panel-collapse'))

  $accordion.on('show.bs.collapse', '.panel-collapse', function() {
    recalculateHeight($(this))
  })

  $accordion.on('hide.bs.collapse', '.panel-collapse', function() {
    $(this).children('.panel-body').fadeOut(250)
  })
}

Vue.directive('sortable', {
  inserted: function(el, binding) {
    if (Sortable) {
      new Sortable(el, binding.value || {})
    }
  }
});

function generateFormDefaults(data) {
  return _.assign({
    name: '',
    dataSourceId: '',
    templateId: '',
    fields: [],
    offline: true,
    redirect: false,
    dataStore: ['dataSource'],
    onSubmit: [],
    saveProgress: true,
    resultHtml: Fliplet.Widget.Templates['templates.configurations.form-result']()
  }, data);
}

var selector = '#app';

var app = new Vue({
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
      widgetInstanceId: formSettings.id,
      templates: [],
      chooseTemplate: !formSettings.templateId,
      toChangeTemplate: false,
      permissionToChange: false,
      newTemplate: '',
      redirect: formSettings.redirect,
      toggleTemplatedEmailAdd: formSettings.onSubmit.indexOf('templatedEmailAdd') > -1,
      toggleTemplatedEmailEdit: formSettings.onSubmit.indexOf('templatedEmailEdit') > -1,
      toggleGenerateEmail: formSettings.onSubmit.indexOf('generateEmail') > -1,
      showExtraAdd: formSettings.dataStore.indexOf('dataSource') > -1,
      showExtraEdit: formSettings.dataStore.indexOf('editDataSource') > -1,
      userData: {},
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
      emailTemplateAdd: undefined,
      emailTemplateEdit: undefined,
      generateEmailTemplate: undefined,
      conflictWarning: formSettings.dataStore.indexOf('dataSource') > -1 && formSettings.autobindProfileEditing ? true : false
    };
  },
  methods: {
    setupCodeEditor: function() {
      const $vm = this;
      $vm.resultEditor = CodeMirror.fromTextArea($vm.$refs.resulthtml, {
        mode: 'htmlmixed',
        lineNumbers: true,
        autoRefresh: true,
        lineWrapping: true,
        viewportMargin: Infinity
      });

      $vm.resultEditor.on('change', function() {
        $vm.settings.resultHtml = $vm.resultEditor.getValue();
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

        event.item.remove();

        this.fields.splice(event.newIndex, 0, {
          _type: componentName,
          _submit: typeof component.submit !== 'undefined' ? component.submit : true,
          name: 'field-' + (this.fields.length + 1),
          label: component.name,
          value: value.default || value.type()
        });
      }
    },
    deleteField: function(index) {
      var confirmDelete = confirm("Are you sure you want to delete field?");
      if (confirmDelete) {
        this.fields.splice(index, 1);
        this.activeFieldConfigType = null;
      }
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
      this.$forceUpdate();
    },
    closeEdit: function() {
      this.activeFieldConfigType = null;
      this.activeField = {};
      Fliplet.Studio.emit('widget-save-label-reset');
    },
    onFieldSettingChanged: function(fieldData) {
      var $vm = this;
      Object.keys(fieldData).forEach(function(prop) {
        $vm.activeField[prop] = fieldData[prop];
      });
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
      var $vm = this;
      this.toChangeTemplate = false;
      Fliplet.Studio.emit('widget-save-label-reset');
      Fliplet.Widget.toggleSaveButton(true);

      if (this.isAddingFields) {
        Fliplet.Studio.emit('widget-mode', 'wide');
      }

      setTimeout(function() {
        $vm.setupCodeEditor();
      }, 1);
    },
    createDataSource: function() {
      var $vm = this;
      var name = prompt('Please type a name for your data source:');

      if (!name) {
        return;
      }

      Fliplet.DataSources.create({
        name: name,
        organizationId: Fliplet.Env.get('organizationId')
      }).then(function(ds) {
        $vm.dataSources.push(ds);
        $vm.settings.dataSourceId = ds.id;
      });
    },
    save: function() {
      var $vm = this;

      if (this.settings.onSubmit.indexOf('templatedEmailAdd') > -1) {
        this.settings.emailTemplateAdd = this.emailTemplateAdd || this.defaultEmailSettings;
      }
      if (this.settings.onSubmit.indexOf('templatedEmailEdit') > -1) {
        this.settings.emailTemplateEdit = this.emailTemplateEdit || this.defaultEmailSettings;
      }
      if (this.settings.onSubmit.indexOf('generateEmail') > -1) {
        this.settings.generateEmailTemplate = this.generateEmailTemplate || this.defaultEmailSettingsForCompose;
      }

      // Cleanup
      this.settings.fields = _.compact(this.fields);

      return Fliplet.Widget.save(this.settings).then(function onSettingsUpdated() {
        return $vm.updateDataSource();
      });
    },
    createDefaultBodyTemplate: function(fields) {
      // Creates default email template
      var defaultEmailTemplate = '<h1>' + this.settings.name + '</h1><p>A form submission has been received.</p>';
      defaultEmailTemplate += '<ul>';

      fields.forEach(function(field) {
        if (typeof field._submit === 'undefined' || field._submit) {
          defaultEmailTemplate += '<li style="line-height: 24px;">' + field.label + ': {{' + field.name + '}}</li>';
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
          'field-x': 'Insert the value entered in the form field.<br><i>To see the ID of each form field, click to edit the field and the ID can be seen at the top right corner.</i>',
          appName: 'Insert your app name',
          organisationName: 'Insert your organisation name'
        }
      };

      window.emailTemplateAddProvider = Fliplet.Widget.open('com.fliplet.email-provider', {
        data: emailProviderData
      });

      window.emailTemplateAddProvider.then(function onForwardEmailProvider(result) {
        window.emailTemplateAddProvider = null;
        $vm.emailTemplateAdd = result.data;

        if ($vm.settings.dataStore.indexOf('dataSource') > -1 || $vm.settings.dataSourceId) {
          var newHook = {
            widgetInstanceId: $vm.widgetInstanceId,
            runOn: ['insert'],
            type: 'email',
            payload: $vm.emailTemplateAdd
          };

          Fliplet.DataSources.getById($vm.settings.dataSourceId).then(function(dataSource) {
            if (!dataSource.hooks.length) {
              // No hooks found at all. Add new hook.
              dataSource.hooks.push(newHook);
              return Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
            }

            // Update existing hook
            var currentHook = _.find(dataSource.hooks, function(o) {
              return o.widgetInstanceId == $vm.widgetInstanceId;
            });
            
            if (!currentHook) {
              // Current hook not found. Add new hook.
              dataSource.hooks.push(newHook);
              return Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
            }

            currentHook.payload = $vm.emailTemplateAdd;

            var index = _.findIndex(dataSource.hooks, function(o) {
              return o.widgetInstanceId == $vm.widgetInstanceId;
            });
            dataSource.hooks.splice(index, 1, currentHook);

            return Fliplet.DataSources.update($vm.settings.dataSourceId, {
              hooks: dataSource.hooks
            });
          });
        }

        $vm.save().then(function() {
          Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
        });
        Fliplet.Widget.autosize();
      });
    },
    configureEmailTemplateEdit: function() {
      var $vm = this;
      var emailProviderData = ($vm.settings && $vm.settings.emailTemplateEdit) || $vm.defaultEmailSettings;

      emailProviderData.options = {
        usage: {
          'field-x': 'Insert the value entered in the form field.<br><i>To see the ID of each form field, click to edit the field and the ID can be seen at the top right corner.</i>',
          appName: 'Insert your app name',
          organisationName: 'Insert your organisation name'
        }
      };

      window.emailTemplateEditProvider = Fliplet.Widget.open('com.fliplet.email-provider', {
        data: emailProviderData
      });

      window.emailTemplateEditProvider.then(function onForwardEmailProvider(result) {
        window.emailTemplateEditProvider = null;
        $vm.emailTemplateEdit = result.data;

        if ($vm.settings.dataStore.indexOf('editDataSource') > -1 || $vm.settings.dataSourceId) {
          var newHook = {
            widgetInstanceId: $vm.widgetInstanceId,
            runOn: ['update'],
            type: 'email',
            payload: $vm.emailTemplateEdit
          };

          Fliplet.DataSources.getById($vm.settings.dataSourceId).then(function(dataSource) {
            if (!dataSource.hooks.length) {
              // No hooks found at all. Add new hook.
              dataSource.hooks.push(newHook);
              return Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
            }

            // Update existing hook
            var currentHook = _.find(dataSource.hooks, function(o) {
              return o.widgetInstanceId == $vm.widgetInstanceId;
            });
            
            if (!currentHook) {
              // Current hook not found. Add new hook.
              dataSource.hooks.push(newHook);
              return Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
            }

            currentHook.payload = $vm.emailTemplateEdit;

            var index = _.findIndex(dataSource.hooks, function(o) {
              return o.widgetInstanceId == $vm.widgetInstanceId;
            });
            dataSource.hooks.splice(index, 1, currentHook);

            return Fliplet.DataSources.update($vm.settings.dataSourceId, {
              hooks: dataSource.hooks
            });
          });
        }

        $vm.save().then(function() {
          Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
        });
        Fliplet.Widget.autosize();
      });
    },
    configureEmailTemplateForCompose: function() {
      var $vm = this;
      var emailProviderData = ($vm.settings && $vm.settings.generateEmailTemplate) || $vm.defaultEmailSettingsForCompose;

      emailProviderData.options = {
        usage: {
          'field-x': 'Insert the value entered in the form field.<br><i>To see the ID of each form field, click to edit the field and the ID can be seen at the top right corner.</i>',
          appName: 'Insert your app name',
          organisationName: 'Insert your organisation name'
        }
      };

      window.generateEmailProvider = Fliplet.Widget.open('com.fliplet.email-provider', {
        data: emailProviderData
      });

      window.generateEmailProvider.then(function onForwardEmailProvider(result) {
        window.generateEmailProvider = null;
        $vm.generateEmailTemplate = result.data;
        $vm.save().then(function() {
          Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
        });
        Fliplet.Widget.autosize();
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
    updateDataSource: function() {
      var dataSourceId = this.settings.dataSourceId;
      var newColumns = _.map(this.fields, 'name');

      var fieldsToHash = _.map(_.filter(this.fields, function (field) {
        return !!field.hash;
      }), 'name');

      if (!dataSourceId) {
        return Promise.resolve();
      }

      return Fliplet.DataSources.getById(dataSourceId).then(function(ds) {
        ds.columns = ds.columns || [];

        var hooksDeleted;
        var columns = _.uniq(newColumns.concat(ds.columns));

        // remove existing hooks for the operations
        ds.hooks = _.reject(ds.hooks || [], function (hook) {
          var result = hook.widgetInstanceId && hook.widgetInstanceId == widgetId;
          if (result) {
            hooksDeleted = true;
          }

          return result;
        });

        if (fieldsToHash) {
          var payload = {};
          fieldsToHash.forEach(function (field) {
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
            return Promise.resolve(); // no need to update
          }
        }

        return Fliplet.DataSources.update(dataSourceId, {
          columns: newColumns,
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
          Fliplet.Studio.emit('widget-info-label-update');
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
          Fliplet.Studio.emit('widget-info-label-update');
          setTimeout(function() {
            $vm.setupCodeEditor();
          }, 1);
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
    }
  },
  watch: {
    'dataSources': function(newVal) {
      changeSelectText();
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
    'settings.templateId': function(newId) {
      Fliplet.Widget.toggleSaveButton(!!newId);

      if (!newId) {
        return;
      }

      var formTemplate = _.find(this.templates, function(template) {
        return template.id === newId;
      });

      var settings = formTemplate.settings;
      settings.templateId = formTemplate.id;
      settings.name = this.settings.name;

      if (this.chooseTemplate) {
        Fliplet.Studio.emit('widget-info-label-update', {
          text: 'Previewing ' + settings.displayName
        });
      }

      this.settings = generateFormDefaults(settings);
      this.fields = this.settings.fields;

      this.save().then(function onSettingsSaved() {
        Fliplet.Studio.emit('reload-widget-instance', Fliplet.Widget.getDefaultId());
      });
    },
    'section': function(value) {
      var $vm = this;
      if (value === 'settings') {
        changeSelectText();

        if (!this.resultEditor) {
          setTimeout(function() {
            $vm.setupCodeEditor();
          }, 1);
        } else {
          setTimeout(function() {
            $vm.resultEditor.refresh();
          }, 1);
        }

      }
    },
    'settings.redirect': function(value) {
      var $vm = this;
      if (!value) {
        if (!$vm.resultEditor) {
          setTimeout(function() {
            $vm.setupCodeEditor();
          }, 1);
        } else {
          setTimeout(function() {
            $vm.resultEditor.refresh();
          }, 1);
        }
      }
    },
    'settings.dataStore': function(value) {
      this.showExtraAdd = value.indexOf('dataSource') > -1;
      this.showExtraEdit = value.indexOf('editDataSource') > -1;
      this.conflictWarning = value.indexOf('dataSource') > -1 && this.settings.autobindProfileEditing; 
    },
    'settings.autobindProfileEditing': function(value) {
      this.conflictWarning = this.settings.dataStore.indexOf('dataSource') > -1 && value;
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
            if (dataSource.hooks.length) {
              var index = _.findIndex(dataSource.hooks, function(o) {
                return o.widgetInstanceId == $vm.widgetInstanceId;
              });
              dataSource.hooks.splice(index, 1);

              Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
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
            if (dataSource.hooks.length) {
              var index = _.findIndex(dataSource.hooks, function(o) {
                return o.widgetInstanceId == $vm.widgetInstanceId;
              });
              dataSource.hooks.splice(index, 1);

              Fliplet.DataSources.update($vm.settings.dataSourceId, {
                hooks: dataSource.hooks
              });
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
    }
  },
  computed: {
    hasRequiredFields: function() {
      return this.fields.some(function(el) {
        return !!el.required;
      });
    }
  },
  created: function() {
    var $vm = this;

    Fliplet.FormBuilder.on('field-settings-changed', this.onFieldSettingChanged);

    Fliplet.DataSources.get({
      type: null
    }).then(function(results) {
      $vm.dataSources = results;
      $(selector).removeClass('is-loading');
    });

    Fliplet.FormBuilder.templates().then(function(templates) {
      $vm.templates = templates;
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

    if (this.chooseTemplate) {
      Fliplet.Studio.emit('widget-save-label-update', {
        text: 'Next'
      });
      Fliplet.Widget.toggleSaveButton(false);
    }

    // Init tooltip
    if ($vm.$refs.formSettings) {
      $($vm.$refs.formSettings).find('[data-toggle="tooltip"]').tooltip();
    }

    var savedLinkData = $vm.settings && $vm.settings.linkAction;
    var linkData = $.extend(true, {
      action: 'screen',
      page: 'none',
      transition: 'slide.left',
      options: {
        hideAction: true
      }
    }, savedLinkData);

    if (!window.linkProvider) {
      var action = $vm.settings && $vm.settings.linkAction || {
        action: 'screen',
        options: {
          hideAction: true
        }
      };

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
    }
    

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

      $vm.triggerSave();
    });

    function migrateData() {
      if ($vm.settings && $vm.settings.emailTemplate) {
        $vm.settings.emailTemplateAdd = $vm.settings.emailTemplate;
        delete $vm.settings.emailTemplate;
      }
    }

    migrateData();

    Fliplet.User.fetch().then(function(user) {
      $vm.userData = user;
    });
  },
  updated: function() {
    var $vm = this;

    if (!window.linkProvider) {
      var action = $vm.settings && $vm.settings.linkAction || {
        action: 'screen',
        options: {
          hideAction: true
        }
      };

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
    }
  }
});
