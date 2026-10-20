/**
 * AIFORCE AGENCY — Contrôleur API Espace Admin
 * Endpoints :
 * - GET  /api/admin/data
 * - POST /api/admin/lead
 * - DELETE /api/admin/lead
 * - POST /api/admin/proforma
 * - DELETE /api/admin/proforma
 * - POST /api/admin/project
 * - DELETE /api/admin/project
 */

const store = require('./store');

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch(e) {}
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}

function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  try {
    // 1. GET ALL DATA
    if (pathname === '/api/admin/data' && req.method === 'GET') {
      return sendJSON(res, 200, {
        success: true,
        leads: store.getLeads(),
        proformas: store.getProformas(),
        projects: store.getProjects()
      });
    }

    // 2. LEAD ACTIONS
    if (pathname === '/api/admin/lead' || pathname === '/api/leads') {
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const updated = store.saveLead(body);
        return sendJSON(res, 200, { success: true, leads: updated });
      }
      if (req.method === 'DELETE') {
        const body = await parseBody(req);
        const id = body.id || urlObj.searchParams.get('id');
        const updated = store.deleteLead(id);
        return sendJSON(res, 200, { success: true, leads: updated });
      }
      if (req.method === 'GET') {
        return sendJSON(res, 200, { success: true, leads: store.getLeads() });
      }
    }

    // 3. PROFORMA ACTIONS
    if (pathname === '/api/admin/proforma') {
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const updated = store.saveProforma(body);
        return sendJSON(res, 200, { success: true, proformas: updated });
      }
      if (req.method === 'DELETE') {
        const body = await parseBody(req);
        const id = body.id || urlObj.searchParams.get('id');
        const updated = store.deleteProforma(id);
        return sendJSON(res, 200, { success: true, proformas: updated });
      }
      if (req.method === 'GET') {
        return sendJSON(res, 200, { success: true, proformas: store.getProformas() });
      }
    }

    // 4. PROJECT ACTIONS
    if (pathname === '/api/admin/project') {
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const updated = store.saveProject(body);
        return sendJSON(res, 200, { success: true, projects: updated });
      }
      if (req.method === 'DELETE') {
        const body = await parseBody(req);
        const id = body.id || urlObj.searchParams.get('id');
        const updated = store.deleteProject(id);
        return sendJSON(res, 200, { success: true, projects: updated });
      }
      if (req.method === 'GET') {
        return sendJSON(res, 200, { success: true, projects: store.getProjects() });
      }
    }

    return sendJSON(res, 404, { error: 'Route not found' });
  } catch (err) {
    console.error('API Admin Error:', err);
    return sendJSON(res, 500, { error: err.message });
  }
};
