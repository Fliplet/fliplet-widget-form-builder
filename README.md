# Fliplet Form Builder

Fliplet **Form Builder** is an open-source Fliplet component (widget) that lets app authors visually assemble complex forms and store or edit records in Fliplet Data Sources.

• End-user documentation lives at **https://developers.fliplet.com/API/components/form-builder.html** – this README focuses on the source code in this repository and how to extend it.

---

## Repository layout

```text
js/                  # JavaScript source
  libs/              # Shared helpers (builder.js, core.js, form.js, ...)
  components/        # Vue components mounted in apps (runtime)
  configurations/    # Vue components used by the form builder interface
css/                 # CSS for builder and runtime UIs
templates/           # Handlebars templates
  components/        # Mark-up used by runtime components
  configurations/    # Mark-up used by the builder interface
vendor/              # 3rd-party libs that are **not** loaded via Fliplet dependencies
build.html           # Empty shell injected in published apps (runtime)
interface.html       # Builder interface loaded in Fliplet Studio
widget.json          # Manifest – lists asset paths & dependency names
```

### Builder vs Runtime

Fliplet separates code that runs **inside Fliplet Studio** (“builder”) from the code that runs **inside users' devices** (the published app). The manifest distinguishes these contexts:

| Manifest section | Loaded where | Key files |
|------------------|--------------|-----------|
| `interface.assets` | Fliplet Studio only | `interface.html`, `js/libs/builder.js`, `css/builder.css`, etc. |
| `build.assets`      | Mobile / Web runtime | `build.html`, `js/libs/form.js`, `css/form.css`, etc. |

---

## Adding a new field type

1. Add a Vue component file under `js/components/`
2. Add a Handlebars template under `templates/components/`
3. Add a Handlebars template for the configuration interface under `/templates/configurations/`
4. Add a *optional* Vue component for the configuration interface under `/js/configurations/`

- Add the assets 1 and 2 to the **interface and build** sections of `widget.json`.
- Add the assets 3 and 4 to the **interface** section only of `widget.json`.

Once components are added, they will be automatically show up in the list based on the order the assets are declared on the interface assets.
