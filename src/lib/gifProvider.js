'use strict';
const fetch = require('node-fetch');

const TENOR_SEARCH_URL = 'https://tenor.googleapis.com/v2/search';
const DEFAULT_KEYWORDS = ['library','books','reading','bookstore','study'];

async function searchTenor(query, limit = 20, key) {
  const q = encodeURIComponent(query);
  const url = `${TENOR_SEARCH_URL}?q=${q}&key=${encodeURIComponent(key)}&client_key=library_gif_bot&limit=${limit}&contentfilter=high`;
  console.log('[DEBUG] Searching Tenor with query:', query);
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Tenor API error: ${res.status} ${res.statusText} ${text}`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  return json.results || [];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function getRandomLibraryGif() {
  const key = process.env.TENOR_API_KEY;
  if (!key) {
    // If no API key, we can't call Tenor. Return null and let caller handle fallback.
    return null;
  }

  // Try multiple keywords in order for variety
  for (const k of DEFAULT_KEYWORDS) {
    try {
      const results = await searchTenor(k, 20, key);
      if (results && results.length > 0) {
        const picked = pickRandom(results);
        // V2 API uses media_formats object
        const mediaFormats = picked.media_formats || {};
        
        // Try to find a GIF url in the v2 API response
        const gifUrl = mediaFormats.gif?.url || mediaFormats.mediumgif?.url || mediaFormats.tinygif?.url;
        if (gifUrl) {
          return { url: gifUrl, id: picked.id, source: 'tenor' };
        }
      }
    } catch (err) {
      // If we got a 429, bubble up a descriptive error
      if (err && err.status === 429) {
        const e = new Error('Tenor rate limit reached (429)');
        e.code = 'TENOR_RATE_LIMIT';
        throw e;
      }
      // For other errors, try the next keyword
    }
  }

  // No results found or all calls failed
  return null;
}

module.exports = { getRandomLibraryGif };
