# Fliplet Form Builder: JavaScript Map

This project provides the **Form Builder** widget used in Fliplet apps. It lets app creators drag‑and‑drop fields in the Studio editor and renders forms to end users at runtime.

Below is a quick orientation for developers or AI systems trying to extend or debug the code.

## Repository layout

- `js/libs/core.js` – sets up the global `Fliplet.FormBuilder` object. It registers field components and provides an event hub so that components can communicate.
- `js/libs/builder.js` – drives the form builder interface in Fliplet Studio. It loads registered fields, handles drag and drop, manages form settings and saves everything to Fliplet’s APIs.
- `js/libs/form.js` – runs in the published app when users fill in a form. It populates data, validates inputs and submits the entry to Fliplet Data Sources.
- `js/libs/templates.js` – fetches form templates that are displayed in the builder for quick form creation.
- `js/libs/countries.js` – contains a list of country codes used by some field types.
- `js/components/` – Vue components for each field (text, email, checkbox, etc.).
- `js/configurations/` – Vue components that let builders configure each field’s settings.
- `templates/` – Handlebars templates for both the builder interface and the final form HTML.

## How files work together

1. **Field registration** – `core.js` exposes helper methods (`field`, `configuration`, `on`, etc.) used by other files. Each field component calls `Fliplet.FormBuilder.field(...)` and optionally `Fliplet.FormBuilder.configuration(...)` so the builder knows about it.
2. **Building a form** – `builder.js` reads the registered fields, displays them in the editor and saves the configuration. It also coordinates email hooks and data source rules.
3. **Showing the form** – when a form is loaded in an app, `form.js` applies the saved configuration, renders the fields (using the components and templates) and handles submission logic.

## Extending the widget

To add a new field or tweak existing behaviour:

1. Create a Vue component under `js/components/` to render the field.
2. Add a matching configuration component in `js/configurations/` if the field has settings.
3. Provide Handlebars templates under `templates/components/` and `templates/configurations/`.
4. Register the assets in `widget.json` so they are loaded by the builder and runtime.

With these steps complete, the form builder will automatically list the new field and save its data.

The widget relies heavily on Vue.js and Fliplet’s APIs for data storage and navigation. Understanding these pieces will help when fixing bugs or adding features.

