/**
 * AIFORCE AGENCY — Module de Persistance Données Admin (JSON Store)
 * Gère le stockage persistant local de :
 * - leads.json : demandes clients du site web & du chatbot IA
 * - proformas.json : devis & proformas générés
 * - projects.json : projets & marchés en cours d'exécution
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Impossible de créer le dossier data:', err.message);
  }
}

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const PROFORMAS_FILE = path.join(DATA_DIR, 'proformas.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Données initiales réalistes de démonstration
const INITIAL_LEADS = [
  {
    id: 'lead-001',
    ref: 'AF-LD-2026-001',
    nom: 'Me Sossou Augustin',
    entreprise: 'Cabinet Sossou & Associés (Cotonou)',
    contact: '+229 97 12 34 56',
    whatsapp: '22997123456',
    email: 'contact@sossou-avocats.bj',
    secteur: 'Juridique / Contentieux',
    besoin: 'Automatisation de la rédaction d\'actes de procédure OHADA et suivi des délais de forclusion.',
    solution: 'Plateforme type Smart Juris avec moteur anti-hallucination et alertes SMS.',
    budget: '3 500 000 FCFA',
    delai: '3 à 4 semaines',
    source: 'Chatbot IA Copilot',
    statut: 'Devis envoyé', // Nouveau, Contacté, Devis envoyé, Gagné, Archivé
    date: '2026-10-09 14:30',
    notes: 'Très intéressé par la démo Smart Juris. Proforma transmise sur WhatsApp.'
  },
  {
    id: 'lead-002',
    ref: 'AF-LD-2026-002',
    nom: 'M. Rodrigue Hounkpè',
    entreprise: 'OmniTrade Bénin SARL',
    contact: '+229 95 88 44 22',
    whatsapp: '22995884422',
    email: 'direction@omnitrade-bj.com',
    secteur: 'Distribution & Import-Export',
    besoin: 'Application mobile pour 15 commerciaux terrain avec prise de commande hors-ligne et géolocalisation.',
    solution: 'App Mobile React Native synchronisée avec back-office web et export proforma PDF.',
    budget: '5 000 000 FCFA',
    delai: '5 semaines',
    source: 'Formulaire de contact web',
    statut: 'Contacté',
    date: '2026-10-10 10:15',
    notes: 'Rappel prévu lundi matin pour cadrage des barèmes tarifaires.'
  },
  {
    id: 'lead-003',
    ref: 'AF-LD-2026-003',
    nom: 'Mme Clarisse Mensah',
    entreprise: 'Clinique Sainte-Famille',
    contact: '+229 61 22 99 10',
    whatsapp: '22961229910',
    email: 'c.mensah@cliniquesaintefamille.com',
    secteur: 'Santé & Gestion Médicale',
    besoin: 'Système automatisé de rappels WhatsApp des rendez-vous patients et facturation rapide.',
    solution: 'Workflow n8n + API WhatsApp Business + passerelle de paiement mobile money.',
    budget: '1 800 000 FCFA',
    delai: '2 semaines',
    source: 'Chatbot IA Copilot',
    statut: 'Nouveau',
    date: '2026-10-10 15:40',
    notes: 'Nouvelle demande entrante via le site web.'
  }
];

const INITIAL_PROFORMAS = [
  {
    id: 'pro-001',
    ref: 'AF-PRO-2026-001',
    leadId: 'lead-001',
    date: '2026-10-09',
    validite: '30 jours',
    clientNom: 'Me Sossou Augustin',
    clientEntreprise: 'Cabinet Sossou & Associés',
    clientContact: '+229 97 12 34 56',
    clientEmail: 'contact@sossou-avocats.bj',
    devise: 'FCFA',
    statut: 'Envoyée', // Brouillon, Envoyée, Acceptée, Refusée
    items: [
      {
        description: 'Conception & Déploiement de la plateforme de gestion des contentieux (Workspace Web)',
        quantite: 1,
        prixUnitaire: 1800000,
        total: 1800000
      },
      {
        description: 'Moteur IA de Rédaction d\'Actes & Vérification anti-hallucination OHADA / CCJA',
        quantite: 1,
        prixUnitaire: 1200000,
        total: 1200000
      },
      {
        description: 'Module d\'alertes SMS & WhatsApp des audiences et délais procéduraux',
        quantite: 1,
        prixUnitaire: 500000,
        total: 500000
      }
    ],
    sousTotal: 3500000,
    remisePourcent: 0,
    remiseMontant: 0,
    tvaPourcent: 0,
    totalTTC: 3500000,
    acompteExige: '50% à la commande (1 750 000 FCFA), 30% à la recette MVP, 20% au déploiement final',
    delaiLivraison: '3 à 4 semaines',
    conditionsPaiement: 'Virement bancaire ou Mobile Money certifié',
    notes: 'Garantie et maintenance corrective de 6 mois incluses.'
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-001',
    ref: 'AF-PRJ-2026-01',
    titre: 'FILTEC ONE — ERP Industriel & Portails Mobiles',
    client: 'Groupe Industriel FILTEC B2B',
    contact: '+229 01 62 11 54 11',
    marcheMontant: 12500000,
    encaisse: 8500000,
    resteAPayer: 4000000,
    devise: 'FCFA',
    statut: 'En cours', // En cours, Recette, Livré, Maintenance
    etape: 'Déploiement des 300 distributeurs & Pointage GPS',
    dateDebut: '2026-08-15',
    dateFinPrevue: '2026-11-30',
    progression: 80,
    livrables: [
      { nom: 'Portail Distributeur Mobile', fait: true },
      { nom: 'Moteur de devis proforma A4', fait: true },
      { nom: 'Pointage GPS & RH Terrain', fait: true },
      { nom: 'Passerelle ERP Comptabilité', fait: false }
    ],
    proformaRef: 'AF-PRO-2026-000'
  },
  {
    id: 'proj-002',
    ref: 'AF-PRJ-2026-02',
    titre: 'SMART JURIS — Workspace Juridique OHADA',
    client: 'Consortium Cabinets Partenaires',
    contact: '+229 97 12 34 56',
    marcheMontant: 7800000,
    encaisse: 5500000,
    resteAPayer: 2300000,
    devise: 'FCFA',
    statut: 'En cours',
    etape: 'Fine-tuning RAG Droit OHADA & Mises en demeure',
    dateDebut: '2026-09-01',
    dateFinPrevue: '2026-12-15',
    progression: 65,
    livrables: [
      { nom: 'Dashboard de calcul des forclusions', fait: true },
      { nom: 'Smart Juris Copilot Anti-hallucination', fait: true },
      { nom: 'Générateur d\'actes Smart Draft', fait: false },
      { nom: 'Journal d\'audit déontologique', fait: true }
    ],
    proformaRef: 'AF-PRO-2026-001'
  }
];

function readJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) {
      writeJSON(file, fallback);
      return fallback;
    }
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Erreur lecture ${file}:`, e.message);
    return fallback;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`Erreur écriture ${file}:`, e.message);
    return false;
  }
}

module.exports = {
  // LEADS
  getLeads: () => readJSON(LEADS_FILE, INITIAL_LEADS),
  saveLead: (lead) => {
    const list = readJSON(LEADS_FILE, INITIAL_LEADS);
    const existingIndex = list.findIndex(item => item.id === lead.id || (lead.ref && item.ref === lead.ref));
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...lead };
    } else {
      list.unshift({
        id: lead.id || `lead-${Date.now()}`,
        ref: lead.ref || `AF-LD-2026-${String(list.length + 1).padStart(3, '0')}`,
        date: lead.date || new Date().toISOString().replace('T', ' ').substring(0, 16),
        statut: lead.statut || 'Nouveau',
        ...lead
      });
    }
    writeJSON(LEADS_FILE, list);
    return list;
  },
  deleteLead: (id) => {
    let list = readJSON(LEADS_FILE, INITIAL_LEADS);
    list = list.filter(item => item.id !== id);
    writeJSON(LEADS_FILE, list);
    return list;
  },

  // PROFORMAS
  getProformas: () => readJSON(PROFORMAS_FILE, INITIAL_PROFORMAS),
  saveProforma: (proforma) => {
    const list = readJSON(PROFORMAS_FILE, INITIAL_PROFORMAS);
    const existingIndex = list.findIndex(item => item.id === proforma.id || (proforma.ref && item.ref === proforma.ref));
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...proforma };
    } else {
      list.unshift({
        id: proforma.id || `pro-${Date.now()}`,
        ref: proforma.ref || `AF-PRO-2026-${String(list.length + 1).padStart(3, '0')}`,
        date: proforma.date || new Date().toISOString().substring(0, 10),
        statut: proforma.statut || 'Brouillon',
        ...proforma
      });
    }
    writeJSON(PROFORMAS_FILE, list);
    return list;
  },
  deleteProforma: (id) => {
    let list = readJSON(PROFORMAS_FILE, INITIAL_PROFORMAS);
    list = list.filter(item => item.id !== id);
    writeJSON(PROFORMAS_FILE, list);
    return list;
  },

  // PROJECTS
  getProjects: () => readJSON(PROJECTS_FILE, INITIAL_PROJECTS),
  saveProject: (project) => {
    const list = readJSON(PROJECTS_FILE, INITIAL_PROJECTS);
    const existingIndex = list.findIndex(item => item.id === project.id || (project.ref && item.ref === project.ref));
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...project };
    } else {
      list.unshift({
        id: project.id || `proj-${Date.now()}`,
        ref: project.ref || `AF-PRJ-2026-${String(list.length + 1).padStart(2, '0')}`,
        dateDebut: project.dateDebut || new Date().toISOString().substring(0, 10),
        statut: project.statut || 'En cours',
        ...project
      });
    }
    writeJSON(PROJECTS_FILE, list);
    return list;
  },
  deleteProject: (id) => {
    let list = readJSON(PROJECTS_FILE, INITIAL_PROJECTS);
    list = list.filter(item => item.id !== id);
    writeJSON(PROJECTS_FILE, list);
    return list;
  }
};
