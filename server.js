/**
 * AIFORCE AGENCY — Serveur Local & Passerelle API
 * - Sert les fichiers statiques (index.html, styles.css, app.js, translations.js, assets/...)
 * - Route l'endpoint /api/chat vers api/chat.js
 * - Supporte le mode démo ou production locale
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const chatHandler = require('./api/chat');

const PORT = process.env.PORT || 3030;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  // 1. API Route: /api/chat
  if (pathname === '/api/chat') {
    return chatHandler(req, res);
  }

  // 1b. API Route: /api/send-lead
  if (pathname === '/api/send-lead') {
    const leadHandler = require('./api/send-lead');
    return leadHandler(req, res);
  }

  // 2. Static File Serving
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = path.normalize(path.join(ROOT, relativePath));

  // Security check: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try appending .html or fallback to index.html for SPA
      const tryHtml = filePath + '.html';
      if (fs.existsSync(tryHtml)) {
        filePath = tryHtml;
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('404 Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    
    // Cache control for development
    if (ext === '.html' || ext === '.css' || ext === '.js') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 [AIFORCE AGENCY] Serveur démarré avec succès !`);
  console.log(`📡 URL locale : http://localhost:${PORT}`);
  console.log(`🤖 AI Chatbot Endpoint : http://localhost:${PORT}/api/chat (Qwen API intégrée)`);
  console.log(`⚡ Prêt pour les tests et la démonstration.\n`);
});
