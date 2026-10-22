"""Build the Apps Script HTML and standalone import-only copy; no dependencies."""
from pathlib import Path
root = Path(__file__).resolve().parent
text = (root / 'view.html').read_text()
for marker, name in [('STYLES', 'style.css'), ('CORE', 'core.js'), ('APP', 'app.js')]:
    text = text.replace('/* ' + marker + ' */', (root / name).read_text())
(root / 'SchoolOrders.html').write_text(text)
(root.parent.parent / 'LAUNCHLA-School-Bundle-Planner.html').write_text(text)
