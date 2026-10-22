import { publicListings } from '../lib/assistant.js';

export default function handler(req, res) {
  res.setHeader('cache-control', 'public, s-maxage=300');
  res.status(200).json(publicListings());
}
