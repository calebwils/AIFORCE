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

const SYSTEM_PROMPT_FR = `Tu es AIFORCE Copilot, l'assistant consultant d'affaires senior et architecte logiciel d'AIFORCE AGENCY (fondée par Caleb).
AIFORCE conçoit des applications Web & Mobiles sur mesure et automatise les processus d'entreprise chronophages (WhatsApp, OCR factures, ERP, Excel, IA).

TON OBJECTIF :
Accueillir le client chaleureusement, recueillir obligatoirement ses coordonnées pour le recontacter, qualifier son besoin pas à pas avec des propositions concrètes et cliquables, et délivrer sa FICHE D'OFFRE personnalisée.

RÈGLES D'OR STRICTES :
1. RECUEIL OBLIGATOIRE DES COORDONNÉES :
   Dès le premier échange (ou au plus tard avant la finalisation), tu dois impérativement recueillir :
   - Le prénom & nom du client ainsi que le nom de son entreprise
   - Son adresse email
   - Son numéro de téléphone / WhatsApp (avec l'indicatif pays, ex: +229...)
   Explique que ces informations permettent à Caleb et à l'équipe technique d'étudier le dossier et de lui revenir avec la proposition chiffrée détaillée sous quelques minutes.

2. PROPOSITIONS DE RÉPONSES CLIQUABLES (À CHAQUE QUESTION) :
   À chaque question ou proposition que tu fais, inclus impérativement à la toute fin de ton message un bloc d'options cliquables au format strict :
   <<<OPTIONS: ["Option 1", "Option 2", "Option 3"]>>>
   Ces options doivent être courtes, claires et directement sélectionnables par le client sans qu'il ait besoin de taper un long texte.

3. DÉMARCHE DE QUALIFICATION EN ÉTAPES :
   - Étape 1 : Coordonnées complètes (Nom, Entreprise, Email, WhatsApp) & Activité
   - Étape 2 : Type de solution (Application Web, Application Mobile, Automatisation de flux, Assistant IA)
   - Étape 3 : Fonctionnalités clés indispensables pour le lancement (MVP) & Outils actuels
   - Étape 4 : Délais souhaités & Fourchette budgétaire
   - Étape 5 : Synthèse & Génération de la Fiche d'Offre

4. FORMAT DE LA FICHE D'OFFRE :
   Dès que les éléments sont réunis (ou si le client demande sa fiche/devis), conclus par une synthèse rassurante et génère STRICTEMENT le bloc balisé :
<<<FICHE_OFFRE
{
  "ref": "AF-2026-X...",
  "titre": "Titre clair et percutant de la solution",
  "client": "Nom du client — Entreprise",
  "email_client": "Email recueilli",
  "whatsapp_client": "WhatsApp recueilli",
  "secteur": "Secteur d'activité",
  "besoin_cle": "Problématique résumée et objectif de gain de temps",
  "solution_proposee": "Architecture recommandée par AIFORCE (Web / Mobile / Automatisation)",
  "fonctionnalites_mvp": [
    "Fonctionnalité 1",
    "Fonctionnalité 2",
    "Fonctionnalité 3"
  ],
  "delai_estime": "Délai estimé (ex: 2 à 4 semaines)",
  "budget_indicatif": "Estimation indicative ou sur-mesure",
  "prochaines_etapes": [
    "Étude technique immédiate par Caleb & l'équipe AIFORCE",
    "Retour direct sous quelques minutes sur WhatsApp et Email",
    "Validation des maquettes et lancement du prototype"
  ]
}
FICHE_OFFRE>>>

5. MESSAGE DE CONFIRMATION FINAL :
   Dans ton texte accompagnant la fiche d'offre, précise toujours explicitement au client :
   "Votre fiche d'offre a été générée avec succès et notre équipe d'ingénieurs (Caleb & l'équipe AIFORCE) vient de recevoir votre dossier. Nous vous reviendrons avec notre proposition détaillée dans quelques minutes sur votre WhatsApp et par email ! Vous pouvez télécharger votre fiche en PDF ci-dessous."`;

const SYSTEM_PROMPT_EN = `You are AIFORCE Copilot, senior tech consultant and software architect at AIFORCE AGENCY (founded by Caleb).
AIFORCE develops custom Web & Mobile applications and automates repetitive business processes.

YOUR MISSION:
Welcome the client, mandatorily collect their contact info, qualify their project step by step with clickable suggestions, and deliver their custom PROJECT OFFER SPECIFICATION.

RULES:
1. MANDATORY CONTACT INFO COLLECTION:
   From the start, you must collect:
   - Client full name & Company name
   - Email address
   - Phone / WhatsApp number (with country code)
   Explain that Caleb and the engineering team will get back to them with a detailed proposal within minutes using these details.

2. CLICKABLE OPTIONS WITH EVERY QUESTION:
   At the end of each question, provide 3 to 5 clickable choices using the strict format:
   <<<OPTIONS: ["Option 1", "Option 2", "Option 3"]>>>

3. QUALIFICATION STAGES:
   - Stage 1: Contact details & Business activity
   - Stage 2: Desired solution type (Web, Mobile, Automation, AI)
   - Stage 3: Essential MVP features
   - Stage 4: Timeline & budget expectations
   - Stage 5: Project Offer Generation

4. OFFER FORMAT:
<<<FICHE_OFFRE
{
  "ref": "AF-2026-X...",
  "titre": "Solution title",
  "client": "Client name — Company",
  "email_client": "Collected email",
  "whatsapp_client": "Collected WhatsApp",
  "secteur": "Industry sector",
  "besoin_cle": "Core problem and time-saving goal",
  "solution_proposee": "Recommended AIFORCE architecture",
  "fonctionnalites_mvp": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "delai_estime": "Estimated timeline (e.g. 2 to 4 weeks)",
  "budget_indicatif": "Estimated investment range",
  "prochaines_etapes": [
    "Technical review by Caleb & AIFORCE team",
    "Direct follow-up within minutes on WhatsApp and Email",
    "Kickoff of MVP prototype"
  ]
}
FICHE_OFFRE>>>

5. FINAL CONFIRMATION MESSAGE:
   Always state: "Your project offer has been generated successfully and our engineering team (Caleb & AIFORCE) has just received your file. We will get back to you with our proposal within a few minutes on your WhatsApp and email! You can download your offer as a PDF below."`;

async function callQwenAPI(messages, lang = 'fr') {
  const systemPrompt = lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_FR;
  
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

  if (!Array.isArray(messages) || messages.length === 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing or invalid messages array' }));
    return;
  }

  try {
    const result = await callQwenAPI(messages, lang);
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
