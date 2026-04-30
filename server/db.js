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

export default db;
