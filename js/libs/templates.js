/**
 * This module manages form templates for the Fliplet Form Builder widget.
 * It provides system templates (built-in) for form creation.
 *
 * Provides utility functions for working with Handlebars templates.
 * All exported functions and major logic blocks are documented with JSDoc.
 */

const systemTemplates = [{
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

Fliplet.FormBuilder.templates = function() {
  return {
    system: systemTemplates
  };
};
