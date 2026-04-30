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

// GET /api/apps — list all apps sorted by display_order
router.get('/apps', (req, res) => {
  const apps = db.prepare('SELECT * FROM apps ORDER BY display_order ASC, created_at ASC').all();
  res.json(apps);
});

// POST /api/admin/apps — create app (multipart, optional logo)
router.post('/admin/apps', upload.single('logo'), (req, res) => {
  const { name, functionality, app_url, github_url } = req.body;

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

  db.prepare(`
    INSERT INTO apps (id, name, functionality, app_url, github_url, logo_path, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, functionality, app_url, github_url || null, logo_path, display_order);

  const app = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
  res.status(201).json(app);
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
  const { name, functionality, app_url, github_url } = req.body;

  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'App not found' });

  db.prepare(`
    UPDATE apps SET
      name = ?, functionality = ?, app_url = ?, github_url = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    name ?? existing.name,
    functionality ?? existing.functionality,
    app_url ?? existing.app_url,
    github_url !== undefined ? (github_url || null) : existing.github_url,
    id,
  );

  const app = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
  res.json(app);
});

// PUT /api/admin/apps/:id/logo — upload/replace logo
router.put('/admin/apps/:id/logo', upload.single('logo'), async (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);

  if (!existing) return res.status(404).json({ error: 'App not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  if (existing.logo_path) {
    await unlink(path.join(DATA_DIR, 'logos', existing.logo_path)).catch(() => {});
  }

  db.prepare(`UPDATE apps SET logo_path = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(req.file.filename, id);

  const app = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
  res.json(app);
});

// DELETE /api/admin/apps/:id/logo — remove logo
router.delete('/admin/apps/:id/logo', async (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);

  if (!existing) return res.status(404).json({ error: 'App not found' });

  if (existing.logo_path) {
    await unlink(path.join(DATA_DIR, 'logos', existing.logo_path)).catch(() => {});
  }

  db.prepare(`UPDATE apps SET logo_path = NULL, updated_at = datetime('now') WHERE id = ?`).run(id);
  const app = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
  res.json(app);
});

// DELETE /api/admin/apps/:id — delete app + logo
router.delete('/admin/apps/:id', async (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);

  if (!existing) return res.status(404).json({ error: 'App not found' });

  if (existing.logo_path) {
    await unlink(path.join(DATA_DIR, 'logos', existing.logo_path)).catch(() => {});
  }

  db.prepare('DELETE FROM apps WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
