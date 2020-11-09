# Fliplet Form Builder

Documentation is available at https://developers.fliplet.com/API/components/form-builder.html

---

## Adding a new field type

1. Add a Vue component file under `js/components/`
2. Add a Handlebars template under `templates/components/`
3. Add a Handlebars template for the configuration interface under `/templates/configurations/`
4. Add a *optional* Vue component for the configuration interface under `/js/configurations/`

- Add the assets 1 and 2 to the **interface and build** sections of `widget.json`.
- Add the assets 3 and 4 to the **interface** section only of `widget.json`.

Once components are added, they will be automatically show up in the list based on the order the assets are declared on the interface assets.

