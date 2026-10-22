# INNOVA-DASH

Your populated dashboard is `index.html`. Existing pins, notes, previews, project colors, and resource links are preserved.

Open **Settings → Add a project** to create a named project with a description and color. Open **Settings → Add a reference type** to create categories for resources. New entries are saved in your browser and available in the resource form. Custom reference types have their own resource sections.

For teammates, share `template.html` on the published site or download `INNOVA-DASH-Template.html` as a standalone file. Both start without built-in projects, resource links, or reference types. Add a project, a reference type, then resources. The template uses separate browser storage and does not clear your populated dashboard.

Export/import backups include projects, reference types, resources, pins, and notes. Older backups remain supported. Imports merge data; importing a populated backup into a blank workspace enables the built-in library. Each browser and origin keeps its own data; this is not a synchronized team service. Export before moving browsers, files, or server ports. Share only backups whose links and notes you intend to disclose.

No installation or build is needed. For local development run `python -m http.server 3000 --bind 0.0.0.0` in this folder. GitHub Pages can publish the repository root from main after these changes are merged.
