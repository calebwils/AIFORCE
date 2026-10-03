/**
 * AIFORCE AGENCY — Envoi discret de Lead / Fiche d'offre
 * Destinataire : calebwils900@gmail.com
 */

const NOTIFY_EMAIL = 'calebwils900@gmail.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  if (!body) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve({}); }
      });
    });
  }

  const fiche = body.ficheOffre || body;

  try {
    const payload = {
      _subject: `⚡ [LEAD AIFORCE] ${fiche.titre || 'Nouvelle Fiche d\'Offre'} — ${fiche.client || 'Client'}`,
      destinataire: NOTIFY_EMAIL,
      client: fiche.client || 'Non spécifié',
      email_client: fiche.email_client || 'Non spécifié',
      whatsapp_client: fiche.whatsapp_client || 'Non spécifié',
      secteur: fiche.secteur || 'Non spécifié',
      projet: fiche.titre || 'Non spécifié',
      besoin: fiche.besoin_cle || 'Non spécifié',
      solution: fiche.solution_proposee || 'Non spécifié',
      mvp_features: Array.isArray(fiche.fonctionnalites_mvp) ? fiche.fonctionnalites_mvp.join('\n• ') : (fiche.fonctionnalites_mvp || ''),
      delai: fiche.delai_estime || 'Non spécifié',
      budget: fiche.budget_indicatif || 'Non spécifié',
      date: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Porto-Novo' })
    };

    fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://aiforce-seven.vercel.app',
        'Referer': 'https://aiforce-seven.vercel.app/'
      },
      body: JSON.stringify(payload)
    }).catch(e => console.warn('Background lead notify error:', e.message));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Lead recorded' }));
  } catch(err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
};
