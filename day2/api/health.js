import { describeConfig } from '../lib/assistant.js';

// Setup check without exposing secrets: shows only whether keys are set and the webhook host.
export default function handler(req, res) {
  const c = describeConfig();
  let webhook = 'not set';
  try {
    if (process.env.LEAD_WEBHOOK_URL) {
      const u = new URL(process.env.LEAD_WEBHOOK_URL);
      // Mask the middle of each path segment (e.g. an email) so the format can be checked safely.
      const masked = u.pathname.split('/').map((s) => (s.length > 6 ? s.slice(0, 2) + '***' + s.slice(-4) : s)).join('/');
      webhook = u.host + masked;
    }
  } catch {
    webhook = 'invalid URL';
  }
  res.setHeader('cache-control', 'no-store');
  res.status(200).json({ model: c.model, apiKey: c.missingKey ? 'missing' : 'set', webhook });
}
