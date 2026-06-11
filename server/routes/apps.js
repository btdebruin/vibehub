import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import upload from '../middleware/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');

const router = Router();

function parseApp(app) {
  const { is_external, ...rest } = app;
  return { ...rest, tags: JSON.parse(app.tags || '[]') };
}

function parsePort(port) {
  const n = parseInt(port, 10);
  return Number.isInteger(n) && n >= 1 && n <= 65535 ? n : null;
}

// GET /api/apps — list all apps sorted by display_order
router.get('/apps', (req, res) => {
  const apps = db.prepare('SELECT * FROM apps ORDER BY display_order ASC, created_at ASC').all();
  res.json(apps.map(parseApp));
});

// POST /api/admin/apps — create app (multipart, optional logo)
router.post('/admin/apps', upload.single('logo'), (req, res) => {
  const { name, functionality, app_url, github_url, app_group, tags, port } = req.body;

  if (!name || !functionality || !app_url) {
    if (req.file) {
      unlink(path.join(DATA_DIR, 'logos', req.file.filename)).catch(() => {});
    }
    return res.status(400).json({ error: 'name, functionality, and app_url are required' });
  }

  const id = uuidv4();
  const maxOrder = db.prepare('SELECT MAX(display_order) as max FROM apps').get();
  const display_order = (maxOrder.max ?? -1) + 1;
  const logo_path = req.file ? req.file.filename : null;
  const group = ['internal', '9to5', 'external'].includes(app_group) ? app_group : 'internal';
  const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : JSON.parse(tags || '[]'));
  const portVal = port ? parsePort(port) : null;

  const app = db.prepare(`
    INSERT INTO apps (id, name, functionality, app_url, github_url, logo_path, display_order, app_group, tags, port)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).get(id, name, functionality, app_url, github_url || null, logo_path, display_order, group, tagsJson, portVal);

  res.status(201).json(parseApp(app));
});

// PUT /api/admin/apps/order — update display order (must be before /:id)
router.put('/admin/apps/order', (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'ids must be an array' });
  }

  const update = db.prepare(`UPDATE apps SET display_order = ?, updated_at = datetime('now') WHERE id = ?`);
  const updateAll = db.transaction((ids) => {
    ids.forEach((id, index) => update.run(index, id));
  });

  updateAll(ids);
  res.json({ success: true });
});

// PUT /api/admin/apps/:id — update app metadata
router.put('/admin/apps/:id', (req, res) => {
  const { id } = req.params;
  const { name, functionality, app_url, github_url, app_group, tags, port } = req.body;

  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'App not found' });

  const group = ['internal', '9to5', 'external'].includes(app_group)
    ? app_group
    : existing.app_group;
  const tagsJson = tags !== undefined
    ? JSON.stringify(Array.isArray(tags) ? tags : JSON.parse(tags || '[]'))
    : existing.tags;
  const portVal = port !== undefined ? (port ? parsePort(port) : null) : existing.port;

  const app = db.prepare(`
    UPDATE apps SET
      name = ?, functionality = ?, app_url = ?, github_url = ?, app_group = ?, tags = ?, port = ?,
      updated_at = datetime('now')
    WHERE id = ?
    RETURNING *
  `).get(
    name ?? existing.name,
    functionality ?? existing.functionality,
    app_url ?? existing.app_url,
    github_url !== undefined ? (github_url || null) : existing.github_url,
    group,
    tagsJson,
    portVal,
    id,
  );

  res.json(parseApp(app));
});

// PUT /api/admin/apps/:id/logo — upload/replace logo
router.put('/admin/apps/:id/logo', upload.single('logo'), async (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);

  if (!existing) return res.status(404).json({ error: 'App not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Point the DB at the new file first; only then remove the old file,
  // so a failed unlink can never leave the DB referencing a deleted logo.
  const app = db.prepare(`UPDATE apps SET logo_path = ?, updated_at = datetime('now') WHERE id = ? RETURNING *`)
    .get(req.file.filename, id);

  if (existing.logo_path) {
    await unlink(path.join(DATA_DIR, 'logos', existing.logo_path)).catch(() => {});
  }

  res.json(parseApp(app));
});

// DELETE /api/admin/apps/:id/logo — remove logo
router.delete('/admin/apps/:id/logo', async (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);

  if (!existing) return res.status(404).json({ error: 'App not found' });

  const app = db.prepare(`UPDATE apps SET logo_path = NULL, updated_at = datetime('now') WHERE id = ? RETURNING *`).get(id);

  if (existing.logo_path) {
    await unlink(path.join(DATA_DIR, 'logos', existing.logo_path)).catch(() => {});
  }

  res.json(parseApp(app));
});

// GET /api/apps/:id/notes — get notes for an app
router.get('/apps/:id/notes', (req, res) => {
  const { id } = req.params;
  const app = db.prepare('SELECT id, notes FROM apps WHERE id = ?').get(id);
  if (!app) return res.status(404).json({ error: 'App not found' });
  res.json({ notes: app.notes || '' });
});

// PUT /api/apps/:id/notes — save notes for an app
router.put('/apps/:id/notes', (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const existing = db.prepare('SELECT id FROM apps WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'App not found' });
  db.prepare(`UPDATE apps SET notes = ?, updated_at = datetime('now') WHERE id = ?`).run(notes ?? '', id);
  res.json({ notes: notes ?? '' });
});

// DELETE /api/admin/apps/:id — delete app + logo
router.delete('/admin/apps/:id', async (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);

  if (!existing) return res.status(404).json({ error: 'App not found' });

  db.prepare('DELETE FROM apps WHERE id = ?').run(id);

  if (existing.logo_path) {
    await unlink(path.join(DATA_DIR, 'logos', existing.logo_path)).catch(() => {});
  }

  res.json({ success: true });
});

// GET /api/status — reachability of each app's URL, cached briefly
const STATUS_TTL_MS = 30_000;
const PING_TIMEOUT_MS = 3_000;
let statusCache = { at: 0, data: null, pending: null };

async function pingApp(app) {
  try {
    // any HTTP response (even 4xx/5xx) means something is listening
    await fetch(app.app_url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(PING_TIMEOUT_MS),
    });
    return [app.id, 'up'];
  } catch {
    return [app.id, 'down'];
  }
}

async function checkAllApps() {
  const apps = db.prepare('SELECT id, app_url FROM apps').all();
  const results = await Promise.all(apps.map(pingApp));
  return Object.fromEntries(results);
}

router.get('/status', async (req, res) => {
  const now = Date.now();
  if (statusCache.data && now - statusCache.at < STATUS_TTL_MS) {
    return res.json(statusCache.data);
  }
  // coalesce concurrent requests into one sweep
  if (!statusCache.pending) {
    statusCache.pending = checkAllApps()
      .then((data) => {
        statusCache = { at: Date.now(), data, pending: null };
        return data;
      })
      .catch((e) => {
        statusCache.pending = null;
        throw e;
      });
  }
  try {
    res.json(await statusCache.pending);
  } catch {
    res.status(500).json({ error: 'Status check failed' });
  }
});

export default router;
