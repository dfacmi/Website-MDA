import { handleContactSubmission } from '../server/chatHandler.js';

interface VercelReq {
  method?: string;
  body?: unknown;
}

interface VercelRes {
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

function parseBody(body: unknown): Record<string, unknown> | undefined {
  if (!body) return undefined;
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as unknown;
      return typeof parsed === 'object' && parsed !== null
        ? (parsed as Record<string, unknown>)
        : undefined;
    } catch {
      return undefined;
    }
  }
  return typeof body === 'object' ? (body as Record<string, unknown>) : undefined;
}

export default function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const result = handleContactSubmission(parseBody(req.body));
  res.status(result.status).json(result.payload);
}
