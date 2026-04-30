import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import appsRouter from './routes/apps.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3004;

const app = express();

app.use(cors());
app.use(express.json());

// Serve logo files
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
app.use('/logos', express.static(path.join(DATA_DIR, 'logos')));

// API routes
app.use('/api', appsRouter);

// Serve built frontend in production
const publicDir = path.join(__dirname, 'public');
if (existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Vibehub running on http://localhost:${PORT}`);
  console.log(`Data dir: ${DATA_DIR}`);
});
