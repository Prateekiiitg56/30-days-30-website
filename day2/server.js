// Local server for the TAMM assistant demo. No dependencies, Node 18+.
// On Vercel, api/ functions replace this file and public/ is served statically.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleChat, publicListings, describeConfig } from './lib/assistant.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(ROOT, 'public');
const LEADS_FILE = path.join(ROOT, 'data', 'leads.csv');

loadEnv(path.join(ROOT, '.env'));
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

// Simple per-IP rate limit so a public link cannot burn the API budget.
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 40 };
const hits = new Map();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'POST' && url.pathname === '/api/chat') return await chat(req, res);
    if (req.method === 'GET' && url.pathname === '/api/listings') return sendJson(res, 200, publicListings());
    if (req.method === 'GET') return serveStatic(url.pathname, res);
    sendJson(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) sendJson(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, () => {
  const c = describeConfig();
  console.log(`TAMM assistant demo running at http://localhost:${PORT}`);
  console.log(`Model: ${c.model} via ${c.provider}`);
  if (c.missingKey) console.warn(`${c.missingKey} is not set. Chat requests will fail until you add it to .env`);
});

async function chat(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  if (isRateLimited(ip)) return sendJson(res, 429, { error: 'Too many messages. Please try again in a few minutes.' });

  let body;
  try {
    body = JSON.parse(await readBody(req, 64 * 1024));
  } catch {
    return sendJson(res, 400, { error: 'Invalid request' });
  }
  const result = await handleChat(body, ip, saveLeadCsv);
  sendJson(res, result.status, result.body);
}

function saveLeadCsv(row) {
  const headers = Object.keys(row);
  const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
  if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, headers.join(',') + '\n');
  fs.appendFileSync(LEADS_FILE, headers.map((h) => csvCell(row[h])).join(',') + '\n');
  console.log(`New lead: ${row.name} (${row.phone}) ${row.summary}`);
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT.max;
}

function serveStatic(pathname, res) {
  const rel = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return sendJson(res, 403, { error: 'Forbidden' });
  fs.readFile(file, (err, data) => {
    if (err) return sendJson(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('Body too large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
