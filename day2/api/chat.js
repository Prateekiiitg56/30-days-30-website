import { handleChat, formatAlert } from '../lib/assistant.js';

// Vercel's disk is read-only, so leads go to the webhook (LEAD_WEBHOOK_URL) and to the function logs as a backup.
async function logLead(row) {
  console.log(`NEW LEAD\n${formatAlert(row)}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body) return res.status(400).json({ error: 'Invalid request' });
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || '';
  const result = await handleChat(body, ip, logLead);
  res.status(result.status).json(result.body);
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
