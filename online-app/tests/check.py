import pathlib, re, sqlite3, subprocess, tempfile

root = pathlib.Path(__file__).resolve().parents[1]
source = (root / 'worker/index.mjs').read_text()
import json
html = json.loads(re.search(r'^const html = (.*);$', source, re.M).group(1))
assert not re.search(r'localStorage|sessionStorage|indexedDB', html)
for script in re.findall(r'<script[^>]*>(.*?)</script>', html, re.S):
    with tempfile.NamedTemporaryFile(suffix='.js', mode='w') as file:
        file.write(script)
        file.flush()
        subprocess.run(['node', '--check', file.name], check=True)
db = sqlite3.connect(':memory:')
db.executescript((root / 'migrations/0001_dashboards.sql').read_text())
sql = re.search(r"prepare\('(INSERT INTO dashboards .*?)'\)", source).group(1)
def save(owner, workspace, revision, state):
    return db.execute(sql, (owner, workspace, state, revision, owner, workspace, revision)).fetchone()
assert save('alice', 'main', 0, '{}') == (1,)
assert save('alice', 'main', 0, '{"stale":true}') is None
assert save('alice', 'main', 1, '{"updated":true}') == (2,)
assert save('bob', 'main', 0, '{}') == (1,)
assert save('alice', 'other', 0, '{}') == (1,)
assert save('charlie', 'main', 7, '{}') is None
assert db.execute('SELECT state FROM dashboards WHERE owner_id=? AND workspace=?', ('alice', 'main')).fetchone()[0] == '{"updated":true}'
assert db.execute('SELECT count(*) FROM dashboards').fetchone()[0] == 3
print('Passed: embedded script syntax, online-only storage, owner/workspace isolation, revision conflicts, and first-write races.')
