/**
 * templates.js – Fliplet Form Builder: Template helpers.
 *
 * Provides utility functions for working with Handlebars templates.
 *
 * All exported functions and major logic blocks are documented with JSDoc.
 */

var systemTemplates = [{
  id: 1,
  settings: {
    displayName: 'Blank',
    description: 'Create your own form from scratch.',
    fields: [{
      _type: 'flInput',
      name: 'Question 1',
      label: 'Enter your first question'
    },
    {
      _type: 'flButtons',
      name: 'buttons',
      label: 'Form buttons',
      _submit: false
    }
    ]
  }
}
];

// Cache for organization templates
var templateCache = {
  key: 'fliplet-form-templates-cache',
  ttl: 5 * 60 * 1000, // 5 minutes

  get: function(organizationId) {
    try {
      var cached = sessionStorage.getItem(this.key + '-' + organizationId);
      if (!cached) return null;
      
      var data = JSON.parse(cached);
      var now = Date.now();
      
      if (now - data.timestamp > this.ttl) {
        this.clear(organizationId);
        return null;
      }
      
      return data.templates;
    } catch (e) {
      return null;
    }
  },

  set: function(organizationId, templates) {
    try {
      var data = {
        timestamp: Date.now(),
        templates: templates
      };
      sessionStorage.setItem(this.key + '-' + organizationId, JSON.stringify(data));
    } catch (e) {
      // Storage might be full, ignore silently
    }
  },

  clear: function(organizationId) {
    try {
      sessionStorage.removeItem(this.key + '-' + organizationId);
    } catch (e) {
      // Ignore errors
    }
  }
};

Fliplet.FormBuilder.templates = function(progressive = false) {
  var organizationId = Fliplet.Env.get('organizationId');

  // Return system templates immediately if progressive loading is requested
  if (progressive) {
    return Promise.resolve({
      system: systemTemplates,
      organization: [],
      loading: true
    });
  }

  var operation = Fliplet.Env.get('development') || !organizationId
    ? Promise.resolve([])
    : Fliplet.API.request({
      url: [
        'v1/widget-instances',
        '?organizationId=' + organizationId,
        '&package=com.fliplet.form-builder',
        '&publishedOnly=true',
        '&where=' + encodeURIComponent(JSON.stringify({
          $contains: {
            template: true
          },
          name: {
            $ne: null
          }
        }))
      ].join('')
    }).then(function(response) {
      response.widgetInstances.forEach(function(instance) {
        instance.settings.displayName = instance.settings.name;
      });

      return Promise.resolve(response.widgetInstances);
    });

  return operation.then(function(organizationTemplates) {
    organizationTemplates.forEach(function(tpl) {
      tpl.app = tpl.pages.length && tpl.pages[0].app || {};
      tpl.createdDescription = (tpl.settings.createdBy && tpl.settings.createdBy.fullName) + ' in ' + tpl.app.name;
    });

    return Promise.resolve({
      system: systemTemplates,
      organization: organizationTemplates,
      loading: false
    });
  });
};

// New function for loading organization templates separately
Fliplet.FormBuilder.loadOrganizationTemplates = function() {
  var organizationId = Fliplet.Env.get('organizationId');

  if (Fliplet.Env.get('development') || !organizationId) {
    return Promise.resolve([]);
  }

  // Check cache first
  var cachedTemplates = templateCache.get(organizationId);
  if (cachedTemplates) {
    return Promise.resolve(cachedTemplates);
  }

  return Fliplet.API.request({
    url: [
      'v1/widget-instances',
      '?organizationId=' + organizationId,
      '&package=com.fliplet.form-builder',
      '&publishedOnly=true',
      '&where=' + encodeURIComponent(JSON.stringify({
        $contains: {
          template: true
        },
        name: {
          $ne: null
        }
      }))
    ].join('')
  }).then(function(response) {
    var organizationTemplates = response.widgetInstances;
    
    organizationTemplates.forEach(function(instance) {
      instance.settings.displayName = instance.settings.name;
    });

    organizationTemplates.forEach(function(tpl) {
      tpl.app = tpl.pages.length && tpl.pages[0].app || {};
      tpl.createdDescription = (tpl.settings.createdBy && tpl.settings.createdBy.fullName) + ' in ' + tpl.app.name;
    });

    // Cache the templates
    templateCache.set(organizationId, organizationTemplates);

    return organizationTemplates;
  });
};

/**
 * Clear the template cache for the current organization
 * Useful when templates are created/updated/deleted
 */
Fliplet.FormBuilder.clearTemplateCache = function() {
  var organizationId = Fliplet.Env.get('organizationId');
  if (organizationId) {
    templateCache.clear(organizationId);
  }
};

/**
 * Compile a Handlebars template by name.
 * @param {string} name - The template name.
 * @returns {Function} Compiled template function.
 */
function compileTemplate(name) {
  return Handlebars.compile(Fliplet.Widget.Templates[name]);
}

/**
 * Render a Handlebars template by name with context.
 * @param {string} name - The template name.
 * @param {Object} context - Data to pass to the template.
 * @returns {string} Rendered HTML.
 */
function renderTemplate(name, context) {
  return compileTemplate(name)(context);
}
