# Notes for AI agents

This repository contains the Fliplet Form Builder widget. The project is structured into two main areas:

- **`js/components/`**: Vue components that render form fields in Fliplet apps.
- **`js/configurations/`**: Vue components used inside Fliplet Studio to configure form fields.
- **`templates/components/`**: Handlebars templates compiled for components.
- **`templates/configurations/`**: Handlebars templates for the configuration interface.
- **`js/libs/`**: Shared libraries for the form builder logic.
- **`css/`**: Styles for the builder and form outputs.

The Form Builder relies on Fliplet's JavaScript APIs. See <https://developers.fliplet.com/> for available APIs.

Run `npm run eslint:github-action` after changes. The project uses Mocha for tests, but there are currently no test scripts.
