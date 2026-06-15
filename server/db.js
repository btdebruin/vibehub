import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(path.join(DATA_DIR, 'logos'), { recursive: true });

const db = new Database(path.join(DATA_DIR, 'vibehub.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    functionality TEXT NOT NULL,
    app_url TEXT NOT NULL,
    github_url TEXT,
    logo_path TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_apps_order ON apps(display_order);
`);

try {
  db.exec(`ALTER TABLE apps ADD COLUMN is_external INTEGER NOT NULL DEFAULT 0`);
} catch {
  // column already exists
}

try {
  db.exec(`ALTER TABLE apps ADD COLUMN app_group TEXT NOT NULL DEFAULT 'internal'`);
  // migrate existing is_external data
  db.exec(`UPDATE apps SET app_group = 'external' WHERE is_external = 1`);
} catch {
  // column already exists
}

try {
  db.exec(`ALTER TABLE apps ADD COLUMN tags TEXT NOT NULL DEFAULT '[]'`);
} catch {
  // column already exists
}

try {
  db.exec(`ALTER TABLE apps ADD COLUMN notes TEXT NOT NULL DEFAULT ''`);
} catch {
  // column already exists
}

try {
  db.exec(`ALTER TABLE apps ADD COLUMN port INTEGER`);
} catch {
  // column already exists
}

try {
  // is_visible = 0 hides the app from the non-admin (public) pages
  db.exec(`ALTER TABLE apps ADD COLUMN is_visible INTEGER NOT NULL DEFAULT 1`);
} catch {
  // column already exists
}

export default db;
