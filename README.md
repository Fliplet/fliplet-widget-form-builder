# Fliplet Form Builder

Fliplet **Form Builder** is an open-source Fliplet component (widget) that lets app authors visually assemble complex forms and store or edit records in Fliplet Data Sources.

• End-user documentation lives at **https://developers.fliplet.com/API/components/form-builder.html** – this README focuses on the source code in this repository and how to extend it.

---

## Quick links

| Purpose                   | URL |
|---------------------------|-----|
| Component docs            | https://developers.fliplet.com/API/components/form-builder.html |
| Fliplet JS API            | https://developers.fliplet.com/API/core.html |
| Fliplet CLI               | https://github.com/Fliplet/fliplet-cli |

---

## Stack in a nutshell

• **Vue 2** – no build step, components are written in plain `.js` files<br>
• **Handlebars** – templates rendered at runtime & in the builder<br>
• **ESLint** – code style enforced via `eslint-config-fliplet` (`npm run eslint:github-action`)<br>
• **Fliplet Widget APIs** – `Fliplet.Widget.*` provides storage, events, translations, etc.<br>
• **No bundler** – assets are referenced directly in `widget.json` and served by Fliplet Studio

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

1. **Component JS** — create a Vue component in `js/components/` (runtime).
2. **Component template** — add a Handlebars template in `templates/components/`.
3. **(Optional) Configuration JS** — create a Vue component in `js/configurations/` (builder).
4. **(Optional) Configuration template** — add a Handlebars template in `templates/configurations/`.
5. **Documentation** — add JSDoc headers to components and template comments (see `AGENTS.md`).
6. Update `widget.json` asset lists:
   - Shared runtime assets → add to both `interface.assets` and `build.assets`.
   - Builder-only assets → add to `interface.assets` only.
7. `npm run eslint:github-action` to ensure code style passes.
8. Commit & push – Fliplet Studio hot-reloads the widget on page refresh.

Existing components follow this pattern – use them as starting points.

---

## Local development

There is **no local webpack dev-server**. Typical workflow:

```bash
# 1. Install dependencies for linting
npm install

# 2. Start a Fliplet Studio sandbox (requires Fliplet CLI)
fliplet dev
# → Open http://localhost:5100 and add the "Form" component
```

The CLI mounts the repo and bypasses CDN cache so you can edit files live.

---

## Testing in apps

1. Add the **Form** component to a test app in Fliplet Studio.
2. Open the component settings (this loads `interface.html`) and build your form.
3. Save, then preview the app – your field components will execute using `js/libs/form.js`.

### Binary image uploads

Image fields automatically detect whether the device or browser can upload binary
files. When supported, image data is converted to a `Blob` and uploaded using
`Fliplet.Media.Files.upload`. Devices that lack the necessary APIs fall back to
submitting base64-encoded data so that uploads continue to work everywhere.

---

## Contributing

• Use Pull Requests and follow Fliplet ENG commit conventions.
• All new/changed code must pass ESLint (`npm run eslint:github-action`).
• Keep translations agnostic; use `Fliplet.Widget.t()` for all user-facing strings.
• Large assets (images/videos) must go through the Fliplet CDN, **not** the repo.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| Component not appearing in Studio | Missing path in `widget.json/interface.assets` |
| Field visible but non-interactive | Vue component not registered or template typo |
| Data not saving | `dataSourceId` unset or network offline (check `settings.offline`) |

---

## Further reading

• Fliplet Widget SDK – https://developers.fliplet.com/Widgets/<br>
• Fliplet Data Sources – https://developers.fliplet.com/Tutorials/data-sources.html<br>
• Vuelidate (validation lib used) – https://vuelidate.js.org/

---

### AI usage cheat-sheet

See [`AGENTS.md`](./AGENTS.md) for prompts and patterns that work well when automating changes to this repository.
