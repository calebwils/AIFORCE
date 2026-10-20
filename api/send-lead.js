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
    // Sauvegarde automatique dans le store Admin CRM
    try {
      const store = require('./store');
      store.saveLead({
        nom: fiche.client || 'Client Anonyme',
        entreprise: fiche.secteur ? `${fiche.client} (${fiche.secteur})` : (fiche.client || 'Prospect'),
        contact: fiche.whatsapp_client || fiche.email_client || '',
        whatsapp: (fiche.whatsapp_client || '').replace(/[^0-9]/g, ''),
        email: fiche.email_client || '',
        secteur: fiche.secteur || '',
        besoin: fiche.besoin_cle || fiche.titre || '',
        solution: fiche.solution_proposee || '',
        budget: fiche.budget_indicatif || '',
        delai: fiche.delai_estime || '',
        source: 'Conseillère Sofia (IA)',
        statut: 'Nouveau'
      });
    } catch(errStore) {
      console.warn('Erreur enregistrement store:', errStore.message);
    }

    const cleanWa = (fiche.whatsapp_client || '').replace(/[^0-9+]/g, '');
    const cleanPhoneDigits = cleanWa.replace(/[^0-9]/g, '');
    const directWaLink = cleanPhoneDigits ? `https://wa.me/${cleanPhoneDigits}` : '';

    const payload = {
      _subject: `🚀 [NOUVEAU CLIENT AIFORCE] ${fiche.client || 'Prospect'} (via Sofia)`,
      _template: 'table',
      _captcha: 'false',
      _replyto: fiche.email_client || 'calebwils900@gmail.com',
      "👤 Nom du Client": fiche.client || 'Non renseigné',
      "🏢 Entreprise / Secteur": fiche.secteur || 'Non renseigné',
      "📱 Téléphone WhatsApp": cleanWa || fiche.whatsapp_client || 'Non renseigné',
      "📲 Lien WhatsApp direct": directWaLink || 'Non disponible',
      "✉️ Adresse Email": fiche.email_client || 'Non renseignée',
      "🎯 Projet & Besoin": fiche.besoin_cle || fiche.titre || 'En cours de qualification',
      "🤖 Conseillère": "Sofia (IA AIFORCE)",
      "📅 Date de réception": new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Porto-Novo' })
    };

    // Envoi sécurisé via FormSubmit (Token direct + adresse email)
    const FORMSUBMIT_TOKEN = 'ce08480659949df527613109a9831a26';
    const postUrls = [
      `https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`,
      `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`
    ];

    postUrls.forEach((endpoint) => {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://aiforce-seven.vercel.app',
          'Referer': 'https://aiforce-seven.vercel.app/'
        },
        body: JSON.stringify(payload)
      }).catch(e => console.warn('Background lead notify error:', e.message));
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Lead recorded' }));
  } catch(err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
};
