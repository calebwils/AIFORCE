/**
 * AIFORCE AGENCY — API Backend Serverless (Vercel & Node.js compatible)
 * Intégration Qwen AI (Alibaba Cloud Model Studio / MaaS)
 * Modèle : qwen-max
 * Notification discrète à calebwils900@gmail.com
 */

const https = require('https');

const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-ws-H.DMYHEHM.uWeV.MEYCIQDIX8DbXSabp_OXZ90ELFKP5h22WbSMNf1yoHtWyk3C1QIhAOhK30EJNVo4DH0kIAbH9cBEDP0Y4iFIWLBaxFJS9e8g';
const QWEN_HOST = process.env.QWEN_HOST || 'ws-hrpprn3nx2citb4c.ap-southeast-1.maas.aliyuncs.com';
const QWEN_PATH = '/compatible-mode/v1/chat/completions';
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen-max';
const NOTIFY_EMAIL = 'calebwils900@gmail.com';

const SYSTEM_PROMPT_FR = `Tu es Sofia, consultante d'affaires et conseillère de cadrage projet chez AIFORCE AGENCY (studio fondé par Caleb, ingénieur logiciel et expert en automatisation).
Tu es un personnel humain de l'entreprise : intelligente, chaleureuse, compétente, à l'écoute et proactive.

RÈGLE ABSOLUE SUR LES COORDONNÉES :
- Les coordonnées du client sont DÉJÀ recueillies et enregistrées par notre système (voir CONTEXTE CLIENT ci-dessous).
- NE LUI REDEMANDE JAMAIS son nom, son email, son numéro de téléphone/WhatsApp ou son entreprise !
- Adresse-toi à lui directement et chaleureusement par son prénom (ex: "Bonjour Juste", "Enchantée Juste", "Très bonne question Juste").

TON IDENTITÉ & POSTURE :
- Tu t'exprimes avec le professionnalisme, l'empathie et la clarté d'un vrai conseiller humain (pas de phrases robotiques, pas de script préformaté).
- Tu écoutes activement ce que le client te dit et tu RÉPONDS SPÉCIFIQUEMENT et avec pertinence à ses questions.
- Si le client pose une question (ex: "Comment savoir si mon entreprise a besoin d'automatisation ?"), tu y réponds directement, de manière vivante et concrète :
  * Tu expliques les signes d'alerte métier : tâches manuelles répétitives quotidiennes (saisie Excel, papier), erreurs de facturation ou de calcul, perte de temps à répondre aux mêmes questions sur WhatsApp, manque de visibilité sur les stocks ou créances.
  * Tu donnes des exemples de gains réels (gagner 15h à 30h par semaine, zéro erreur de calcul, relances automatiques des clients).
  * Tu fais le lien avec son activité (ex: commerce, services, industrie) et tu lui poses une question de rebond pour identifier ses goulots d'étranglement : "Dans votre activité quotidienne, quelle est la tâche qui vous prend le plus de temps ou qui génère le plus de frictions ?"
- Tu ne coupes JAMAIS la discussion brutalement. Tu dialogues naturellement avec lui.
- Tu valorises les compétences d'AIFORCE :
  1. Développement d'applications Web & SaaS sur mesure (portails clients, dashboards de gestion, ERP/CRM interne).
  2. Applications mobiles iOS & Android (solutions de vente, terrain, suivi).
  3. Automatisation des processus d'entreprise (WhatsApp Business API, extraction OCR de factures/documents, synchronisation Excel/ERP, notifications automatisées).
  4. Agents & Chatbots IA métiers.
- RÈGLE TARIFAIRE : Tu ne donnes pas de faux devis ou de prix arbitraires dans le chat : chaque projet est taillé sur-mesure pour être rentable. Quand le besoin est bien cadré ou que le client souhaite lancer la mise en place, explique que Caleb (directeur technique) et l'équipe d'ingénieurs vont analyser les spécifications techniques et le recontacter sur son WhatsApp pour lui présenter la proposition sur-mesure.
- OPTIONS DE RÉPONSE RAPIDE :
  À la toute fin de CHAQUE réponse, ajoute TOUJOURS exactement 2 à 3 suggestions courtes que l'utilisateur peut cliquer, au format strict suivant :
  <<<OPTIONS: ["Suggestion courte 1", "Suggestion courte 2", "Suggestion courte 3"]>>>`;

const SYSTEM_PROMPT_EN = `You are Sofia, project consultant and business advisor at AIFORCE AGENCY (founded by Caleb, lead software engineer & automation specialist).
You are an intelligent, warm, highly competent human team member of the agency.

ABSOLUTE RULE ON CONTACT DETAILS:
- The client's contact details have ALREADY been collected and verified by our system (see CURRENT CLIENT CONTEXT below).
- NEVER ASK the client for their name, email, phone number/WhatsApp, or company again!
- Greet and address them warmly and naturally by their first name.

YOUR IDENTITY & ATTITUDE:
- Speak as a real, thoughtful, empathetic human consultant (no robotic clichés, no rigid script).
- Actively listen and DIRECTLY ANSWER the client's questions with actionable depth and real examples.
- If asked an exploratory question (e.g. "How do I know if my company needs automation?"), explain concrete operational signs (repetitive manual data entry, spreadsheet chaos, delayed invoice processing, overwhelming WhatsApp customer requests), provide tangible ROI benefits, and ask a relevant follow-up about their current bottlenecks in their specific field.
- Never abruptly close the conversation. Keep the conversation engaging, human, and helpful.
- Highlight AIFORCE capabilities: Web & SaaS platforms, Mobile apps (iOS/Android), Workflow automation (WhatsApp API, invoice OCR, spreadsheet integration), Practical AI agents.
- PRICING: Do not make up fake automated prices. Explain that Caleb and the engineering team will review their exact requirements to propose a tailored roadmap on WhatsApp.
- QUICK REPLIES: At the very end of EVERY response, ALWAYS provide 2 or 3 concise clickable suggestions formatted as:
  <<<OPTIONS: ["Option 1", "Option 2", "Option 3"]>>>`;

async function callQwenAPI(messages, lang = 'fr', client = null) {
  let systemPrompt = lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_FR;
  
  if (client && (client.nom || client.entreprise)) {
    systemPrompt += `\n\nCONTEXTE CLIENT ACTUEL :\n- Nom : ${client.nom || 'Non précisé'}\n- Entreprise / Activité : ${client.entreprise || 'Non précisé'}\n- WhatsApp : ${client.whatsapp || 'Non précisé'}\n- Email : ${client.email || 'Non précisé'}\n(Adresse-toi à cette personne avec son prénom de façon chaleureuse et naturelle).`;
  }
  
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.filter(m => m.role === 'user' || m.role === 'assistant')
  ];

  const payload = JSON.stringify({
    model: QWEN_MODEL,
    messages: fullMessages,
    temperature: 0.7,
    max_tokens: 1500
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: QWEN_HOST,
      port: 443,
      path: QWEN_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.message?.content || '';
            resolve({ content, raw: parsed });
          } catch (e) {
            reject(new Error(`Failed to parse Qwen response: ${e.message}`));
          }
        } else {
          try {
            const errorJson = JSON.parse(data);
            reject(new Error(errorJson.error?.message || errorJson.message || `API error ${res.statusCode}`));
          } catch (e) {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Qwen API request timed out'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

function parseFicheOffre(text) {
  if (!text) return null;
  const match = text.match(/<<<FICHE_OFFRE\s*([\s\S]*?)\s*FICHE_OFFRE>>>/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      console.error('Error parsing FICHE_OFFRE JSON:', e);
      return null;
    }
  }
  return null;
}

function parseOptions(text) {
  if (!text) return [];
  const match = text.match(/<<<OPTIONS:\s*(\[[\s\S]*?\])\s*>>>/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      console.error('Error parsing OPTIONS JSON:', e);
    }
  }

  // Fallback: extract bullet points if any
  const bullets = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const opt = trimmed.replace(/^[•\-\*]\s*/, '').trim();
      if (opt.length > 2 && opt.length < 80) {
        bullets.push(opt);
      }
    }
  }
  return bullets.slice(0, 5);
}

// Discreet lead notification to Caleb
async function sendDiscreetLeadEmail(ficheOffre, messages) {
  if (!ficheOffre) return;
  try {
    const payload = {
      _subject: `⚡ [LEAD AIFORCE] ${ficheOffre.titre || 'Nouveau Cadrage'} — ${ficheOffre.client || 'Client'}`,
      destinataire: NOTIFY_EMAIL,
      client: ficheOffre.client || 'Non spécifié',
      email_client: ficheOffre.email_client || 'Non spécifié',
      whatsapp_client: ficheOffre.whatsapp_client || 'Non spécifié',
      secteur: ficheOffre.secteur || 'Non spécifié',
      projet: ficheOffre.titre || 'Non spécifié',
      besoin: ficheOffre.besoin_cle || 'Non spécifié',
      solution_recommandee: ficheOffre.solution_proposee || 'Non spécifié',
      mvp_features: (ficheOffre.fonctionnalites_mvp || []).join(', '),
      delai: ficheOffre.delai_estime || 'Non spécifié',
      budget: ficheOffre.budget_indicatif || 'Non spécifié',
      date: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Porto-Novo' }),
      transcript_resume: (messages || []).map(m => `[${m.role}]: ${m.content}`).join('\n\n')
    };

    // Forward to FormSubmit discreet relay
    fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://aiforce-seven.vercel.app',
        'Referer': 'https://aiforce-seven.vercel.app/'
      },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('FormSubmit background notification error:', err.message));

    console.log(`[AIFORCE LEAD] Fiche d'offre transmise discrètement à ${NOTIFY_EMAIL} pour le client ${ficheOffre.client}`);
  } catch (err) {
    console.warn('Error in sendDiscreetLeadEmail:', err.message);
  }
}

// Handler for Vercel Serverless Function / Node HTTP
module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
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

  const messages = body.messages || [];
  const lang = body.lang || 'fr';
  const client = body.client || null;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing or invalid messages array' }));
    return;
  }

  try {
    const result = await callQwenAPI(messages, lang, client);
    const content = result.content;
    const ficheOffre = parseFicheOffre(content);
    const options = parseOptions(content);

    // If ficheOffre was generated, silently notify Caleb by email
    if (ficheOffre) {
      sendDiscreetLeadEmail(ficheOffre, messages);
    }

    // Clean conversational reply (remove raw tags for clean chat bubble display)
    let cleanText = content
      .replace(/<<<FICHE_OFFRE[\s\S]*?FICHE_OFFRE>>>/g, '')
      .replace(/<<<OPTIONS:[\s\S]*?>>>/g, '')
      .trim();

    if (!cleanText && ficheOffre) {
      cleanText = lang === 'en'
        ? "Your project offer specification has been generated successfully and our technical team (Caleb & AIFORCE engineers) has received your file. We will get back to you with our proposal within a few minutes on your WhatsApp and email! You can download your offer as a PDF below."
        : "Votre fiche d'offre a été générée avec succès et notre équipe d'ingénieurs (Caleb & l'équipe AIFORCE) vient de recevoir votre dossier. Nous vous reviendrons avec notre proposition détaillée dans quelques minutes sur votre WhatsApp et par email ! Vous pouvez télécharger votre fiche en PDF ci-dessous.";
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      reply: cleanText,
      options: options,
      ficheOffre: ficheOffre,
      rawContent: content
    }));
  } catch (err) {
    console.error('Chat API Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: err.message || 'Internal Server Error',
      fallback: true
    }));
  }
};
