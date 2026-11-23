import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  handleContactSubmission,
  handlePpdbChat,
  handlePpdbSubmission,
} from './server/chatHandler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    const result = await handlePpdbChat(req.body as Record<string, unknown>);
    return res.status(result.status).json(result.payload);
  });

  app.post('/api/ppdb', (req, res) => {
    const result = handlePpdbSubmission(req.body as Record<string, unknown>);
    return res.status(result.status).json(result.payload);
  });

  app.post('/api/contact', (req, res) => {
    const result = handleContactSubmission(req.body as Record<string, unknown>);
    return res.status(result.status).json(result.payload);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Muslim Digital Academy server running on http://0.0.0.0:${port}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
