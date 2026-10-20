/**
 * AIFORCE AGENCY — Logique Espace Admin Studio
 * CRM, Générateur de Proformas A4 avec Logo, Suivi des Marchés Obtenus
 */

(function () {
  'use strict';

  // --- Configuration & Constantes ---
  const DEFAULT_PIN = 'aiforce2026';
  const STORAGE_KEY_AUTH = 'aiforce_admin_authenticated';
  const STORAGE_KEY_LOCAL_DATA = 'aiforce_admin_cache_v1';

  // State
  let state = {
    leads: [],
    proformas: [],
    projects: [],
    currentLeadFilter: 'ALL',
    currentProformaFilter: 'ALL',
    editingProforma: null,
    editingLead: null,
    editingProject: null,
    isOnline: true
  };

  // Catalogue de Prestations Prédéfinies AIFORCE
  const PRESET_CATALOG = {
    web: {
      desc: "Conception & Développement d'une Application Web sur-mesure (Dashboard métier, Portail client, Base de données & Authentification)",
      qty: 1,
      price: 2500000
    },
    mobile: {
      desc: "Développement d'une Application Mobile iOS & Android (Mode hors-ligne, Synchronisation temps réel, Notifications push & GPS)",
      qty: 1,
      price: 3000000
    },
    n8n: {
      desc: "Automatisation des Processus & Flux Métier (Workflows n8n, Connexion API, Passerelle WhatsApp & Traitement automatique de documents)",
      qty: 1,
      price: 1200000
    },
    ai: {
      desc: "Module d'Intelligence Artificielle Copilot Métier (Moteur RAG anti-hallucination sourcé sur vos données d'entreprise & extraction de pièces)",
      qty: 1,
      price: 2000000
    },
    audit: {
      desc: "Audit Technique d'Architecture Logicielle, Cadrage des flux & Rédaction du Cahier des Charges MVP",
      qty: 1,
      price: 800000
    },
    maintenance: {
      desc: "Contrat Annuel de Maintenance Corrective & Évolutive, Monitoring 24/7 et Sauvegardes Cloud",
      qty: 1,
      price: 1500000
    }
  };

  // --- Initialisation DOM ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initAuth();
    initTabs();
    initProformaBuilderEvents();
    initLeadEvents();
    initProjectEvents();
    initFilters();
    loadAllData();
  });

  // ==========================================================================
  // 0. GESTION DU THÈME (LIGHT PAR DÉFAUT + DARK SUR DEMANDE)
  // ==========================================================================
  const STORAGE_KEY_THEME = 'aiforce_admin_theme';

  function initTheme() {
    // Light mode par défaut garanti
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    applyTheme(savedTheme, false);

    // Bouton bascule dans la sidebar
    const sidebarThemeBtn = document.getElementById('theme-toggle-btn');
    if (sidebarThemeBtn) {
      sidebarThemeBtn.addEventListener('click', toggleTheme);
    }

    // Bouton bascule dans le top header
    const topThemeBtn = document.getElementById('btn-top-theme-toggle');
    if (topThemeBtn) {
      topThemeBtn.addEventListener('click', toggleTheme);
    }

    // Bouton bascule dans l'écran de verrouillage
    const lockThemeBtn = document.getElementById('btn-lock-theme-toggle');
    if (lockThemeBtn) {
      lockThemeBtn.addEventListener('click', toggleTheme);
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark') || document.documentElement.classList.contains('theme-dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme, true);
  }

  function applyTheme(theme, notify = false) {
    const isDark = theme === 'dark';

    if (isDark) {
      document.documentElement.classList.add('theme-dark');
      document.body.classList.add('theme-dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.remove('theme-dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }

    // Mise à jour de la carte thème dans la sidebar
    const sidebarIcon = document.getElementById('sidebar-theme-icon');
    const sidebarTitle = document.getElementById('sidebar-theme-title');
    const sidebarStatus = document.getElementById('sidebar-theme-status');
    if (sidebarIcon) sidebarIcon.textContent = isDark ? '🌙' : '☀️';
    if (sidebarTitle) sidebarTitle.textContent = isDark ? 'Mode Sombre' : 'Mode Clair';
    if (sidebarStatus) sidebarStatus.textContent = isDark ? 'Actif' : 'Par défaut';

    // Mise à jour du bouton d'en-tête
    const topIcon = document.getElementById('top-theme-icon');
    const topText = document.getElementById('top-theme-text');
    if (topIcon) topIcon.textContent = isDark ? '🌙' : '☀️';
    if (topText) topText.textContent = isDark ? 'Mode Sombre' : 'Mode Clair';

    // Mise à jour sur l'écran PIN
    const lockBtn = document.getElementById('btn-lock-theme-toggle');
    if (lockBtn) {
      const lockIcon = lockBtn.querySelector('.lock-theme-icon');
      const lockText = lockBtn.querySelector('.lock-theme-text');
      if (lockIcon) lockIcon.textContent = isDark ? '🌙' : '☀️';
      if (lockText) lockText.textContent = isDark ? 'Mode Sombre' : 'Mode Clair';
    }

    if (notify) {
      showToast(isDark ? '🌙 Mode Sombre activé' : '☀️ Mode Clair activé (par défaut)');
    }
  }

  // ==========================================================================
  // GESTION DU MENU LATÉRAL GAUCHE & DRAWER MOBILE
  // ==========================================================================
  function initSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('btn-sidebar-toggle');

    if (toggleBtn && sidebar && overlay) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        overlay.classList.toggle('active');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('active');
      });
    }

    // Raccourcis d'actions rapides dans la sidebar et le header
    const sidebarLeadBtn = document.getElementById('btn-sidebar-quick-lead');
    const quickCreateLeadBtn = document.getElementById('btn-quick-create-lead');
    if (sidebarLeadBtn && quickCreateLeadBtn) {
      sidebarLeadBtn.addEventListener('click', () => {
        quickCreateLeadBtn.click();
        closeMobileSidebar();
      });
    }

    const sidebarProformaBtn = document.getElementById('btn-sidebar-quick-proforma');
    const headerProformaBtn = document.getElementById('btn-header-quick-proforma');
    const quickCreateProformaBtn = document.getElementById('btn-quick-create-proforma');
    if (sidebarProformaBtn && quickCreateProformaBtn) {
      sidebarProformaBtn.addEventListener('click', () => {
        quickCreateProformaBtn.click();
        closeMobileSidebar();
      });
    }
    if (headerProformaBtn && quickCreateProformaBtn) {
      headerProformaBtn.addEventListener('click', () => {
        quickCreateProformaBtn.click();
      });
    }
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (overlay) overlay.classList.remove('active');
  }

  // ==========================================================================
  // 1. SÉCURITÉ & AUTHENTIFICATION PIN
  // ==========================================================================
  function initAuth() {
    const lockScreen = document.getElementById('auth-lock-screen');
    const appContainer = document.getElementById('admin-app');
    const pinForm = document.getElementById('auth-pin-form');
    const pinInput = document.getElementById('auth-pin-input');
    const errorMsg = document.getElementById('auth-error-msg');
    const logoutBtn = document.getElementById('btn-admin-logout');
    const toggleEye = document.getElementById('toggle-pin-visibility');

    // Vérifier si déjà déverrouillé dans cette session
    if (sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true') {
      lockScreen.classList.add('hidden');
      appContainer.classList.remove('hidden');
    }

    if (toggleEye && pinInput) {
      toggleEye.addEventListener('click', () => {
        pinInput.type = pinInput.type === 'password' ? 'text' : 'password';
      });
    }

    if (pinForm) {
      pinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPin = pinInput.value.trim();

        if (enteredPin === DEFAULT_PIN) {
          sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
          lockScreen.classList.add('hidden');
          appContainer.classList.remove('hidden');
          errorMsg.textContent = '';
          showToast('Bienvenue sur AIFORCE Admin Studio !');
        } else {
          errorMsg.textContent = 'Code secret incorrect. Veuillez réessayer.';
          pinInput.value = '';
          pinInput.focus();
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(STORAGE_KEY_AUTH);
        appContainer.classList.add('hidden');
        lockScreen.classList.remove('hidden');
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      });
    }
  }

  // ==========================================================================
  // 2. NAVIGATION ENTRE ONGLETS
  // ==========================================================================
  const TAB_NAMES = {
    'tab-dashboard': "Vue d'ensemble",
    'tab-leads': "Demandes Clients (CRM)",
    'tab-proformas': "Factures Proforma",
    'tab-projects': "Projets & Marchés"
  };

  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        switchTab(targetId);
      });
    });

    // Navigation depuis les liens du dashboard
    document.querySelectorAll('[data-nav-tab]').forEach(link => {
      link.addEventListener('click', () => {
        const targetId = link.getAttribute('data-nav-tab');
        switchTab(targetId);
      });
    });
  }

  function switchTab(targetId) {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetId);
    });

    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === targetId);
    });

    // Mise à jour du fil d'Ariane
    const crumb = document.getElementById('current-tab-crumb');
    if (crumb && TAB_NAMES[targetId]) {
      crumb.textContent = TAB_NAMES[targetId];
    }

    closeMobileSidebar();
  }

  // ==========================================================================
  // 3. COUCHE DE DONNÉES & SYNCHRONISATION
  // ==========================================================================
  async function loadAllData() {
    const syncStatus = document.getElementById('sync-status');

    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('API indisponible');
      const data = await res.json();

      state.leads = data.leads || [];
      state.proformas = data.proformas || [];
      state.projects = data.projects || [];
      state.isOnline = true;

      // Sauvegarde miroir local
      localStorage.setItem(STORAGE_KEY_LOCAL_DATA, JSON.stringify({
        leads: state.leads,
        proformas: state.proformas,
        projects: state.projects
      }));

      if (syncStatus) {
        syncStatus.innerHTML = '<span class="status-dot online"></span><span class="status-text">Synchronisé</span>';
      }
    } catch (err) {
      console.warn('Utilisation du stockage local:', err.message);
      state.isOnline = false;

      // Fallback local storage
      const cached = localStorage.getItem(STORAGE_KEY_LOCAL_DATA);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          state.leads = parsed.leads || [];
          state.proformas = parsed.proformas || [];
          state.projects = parsed.projects || [];
        } catch(e) {}
      }

      if (syncStatus) {
        syncStatus.innerHTML = '<span class="status-dot" style="background:#f59e0b; box-shadow:0 0 6px #f59e0b;"></span><span class="status-text">Mode Local</span>';
      }
    }

    renderAll();
  }

  function renderAll() {
    renderKPIs();
    renderLeads();
    renderProformas();
    renderProjects();
    updateBadges();
  }

  function updateBadges() {
    const leadsBadge = document.getElementById('leads-count-badge');
    const proformasBadge = document.getElementById('proformas-count-badge');
    const projectsBadge = document.getElementById('projects-count-badge');

    if (leadsBadge) leadsBadge.textContent = state.leads.length;
    if (proformasBadge) proformasBadge.textContent = state.proformas.length;
    if (projectsBadge) projectsBadge.textContent = state.projects.length;
  }

  // ==========================================================================
  // 4. TABLEAU DE BORD & KPIS
  // ==========================================================================
  function renderKPIs() {
    const kpiTotalLeads = document.getElementById('kpi-total-leads');
    const kpiNewLeads = document.getElementById('kpi-new-leads');
    const kpiTotalProformas = document.getElementById('kpi-total-proformas');
    const kpiPipelineVal = document.getElementById('kpi-pipeline-val');
    const kpiTotalProjects = document.getElementById('kpi-total-projects');
    const kpiProjectsEncaisse = document.getElementById('kpi-projects-encaisse');
    const kpiTotalBusiness = document.getElementById('kpi-total-business');

    // Leads
    const newLeadsCount = state.leads.filter(l => l.statut === 'Nouveau').length;
    if (kpiTotalLeads) kpiTotalLeads.textContent = state.leads.length;
    if (kpiNewLeads) kpiNewLeads.textContent = `${newLeadsCount} nouvelle(s) demande(s)`;

    // Proformas
    const pipelineSum = state.proformas
      .filter(p => p.statut !== 'Refusée')
      .reduce((acc, p) => acc + (Number(p.totalTTC) || 0), 0);

    if (kpiTotalProformas) kpiTotalProformas.textContent = state.proformas.length;
    if (kpiPipelineVal) kpiPipelineVal.textContent = `${formatNumber(pipelineSum)} FCFA en devis`;

    // Projects
    const totalBusiness = state.projects.reduce((acc, p) => acc + (Number(p.marcheMontant) || 0), 0);
    const totalEncaisse = state.projects.reduce((acc, p) => acc + (Number(p.encaisse) || 0), 0);

    if (kpiTotalProjects) kpiTotalProjects.textContent = state.projects.length;
    if (kpiProjectsEncaisse) kpiProjectsEncaisse.textContent = `${formatNumber(totalEncaisse)} FCFA encaissés`;
    if (kpiTotalBusiness) kpiTotalBusiness.textContent = `${formatNumber(totalBusiness)} FCFA`;

    // Recent leads in dashboard
    const dashRecentLeads = document.getElementById('dash-recent-leads');
    if (dashRecentLeads) {
      if (state.leads.length === 0) {
        dashRecentLeads.innerHTML = '<p style="color:var(--admin-text-dim); font-size:0.85rem;">Aucune demande enregistrée.</p>';
      } else {
        dashRecentLeads.innerHTML = state.leads.slice(0, 3).map(lead => `
          <div class="dash-lead-item">
            <div class="dash-lead-info">
              <strong class="dash-lead-name">${escapeHtml(lead.nom)}</strong>
              <span class="dash-lead-company">${escapeHtml(lead.entreprise || lead.secteur || 'Prospect')}</span>
              <span class="dash-lead-budget">${escapeHtml(lead.budget || 'Budget à définir')}</span>
            </div>
            <div class="dash-lead-action">
              <span class="lead-status-badge ${getStatusClass(lead.statut)}">${escapeHtml(lead.statut)}</span>
              <button type="button" class="btn-lead-proforma" data-quick-lead-proforma="${lead.id}">
                Devis →
              </button>
            </div>
          </div>
        `).join('');

        dashRecentLeads.querySelectorAll('[data-quick-lead-proforma]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-quick-lead-proforma');
            const targetLead = state.leads.find(l => l.id === id);
            if (targetLead) openProformaBuilderFromLead(targetLead);
          });
        });
      }
    }

    // Active projects in dashboard
    const dashActiveProjects = document.getElementById('dash-active-projects');
    if (dashActiveProjects) {
      if (state.projects.length === 0) {
        dashActiveProjects.innerHTML = '<p style="color:var(--admin-text-dim); font-size:0.85rem;">Aucun projet en cours.</p>';
      } else {
        dashActiveProjects.innerHTML = state.projects.slice(0, 2).map(prj => `
          <div class="dash-project-item">
            <div class="dash-project-header">
              <div>
                <strong class="dash-project-title">${escapeHtml(prj.titre)}</strong>
                <span class="dash-project-client">${escapeHtml(prj.client)}</span>
              </div>
              <span class="dash-project-percent">${prj.progression || 0}%</span>
            </div>
            <div class="project-progress-bar-bg">
              <div class="project-progress-bar-fill" style="width: ${prj.progression || 0}%;"></div>
            </div>
            <div class="dash-project-footer">
              <span>Étape : ${escapeHtml(prj.etape || 'En développement')}</span>
              <span class="dash-project-amount">${formatNumber(prj.marcheMontant)} FCFA</span>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // ==========================================================================
  // 5. CRM : DEMANDES CLIENTS (LEADS)
  // ==========================================================================
  function initLeadEvents() {
    const searchInput = document.getElementById('leads-search-input');
    const openAddModalBtn = document.getElementById('btn-open-add-lead-modal');
    const quickCreateBtn = document.getElementById('btn-quick-create-lead');
    const leadModal = document.getElementById('modal-lead-form');
    const closeLeadModalBtn = document.getElementById('btn-close-lead-modal');
    const cancelLeadModalBtn = document.getElementById('btn-cancel-lead-modal');
    const leadForm = document.getElementById('lead-edit-form');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderLeads();
      });
    }

    const openModal = () => {
      document.getElementById('lead-modal-title').textContent = 'Nouvelle Demande Client';
      leadForm.reset();
      document.getElementById('lead-form-id').value = '';
      leadModal.classList.remove('hidden');
    };

    if (openAddModalBtn) openAddModalBtn.addEventListener('click', openModal);
    if (quickCreateBtn) quickCreateBtn.addEventListener('click', () => {
      switchTab('tab-leads');
      openModal();
    });

    const closeModal = () => leadModal.classList.add('hidden');
    if (closeLeadModalBtn) closeLeadModalBtn.addEventListener('click', closeModal);
    if (cancelLeadModalBtn) cancelLeadModalBtn.addEventListener('click', closeModal);

    if (leadForm) {
      leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('lead-form-id').value || `lead-${Date.now()}`;
        
        const newLead = {
          id,
          nom: document.getElementById('lead-form-nom').value.trim(),
          entreprise: document.getElementById('lead-form-entreprise').value.trim(),
          contact: document.getElementById('lead-form-contact').value.trim(),
          whatsapp: document.getElementById('lead-form-contact').value.replace(/[^0-9]/g, ''),
          email: document.getElementById('lead-form-email').value.trim(),
          secteur: document.getElementById('lead-form-secteur').value.trim(),
          budget: document.getElementById('lead-form-budget').value.trim(),
          besoin: document.getElementById('lead-form-besoin').value.trim(),
          statut: document.getElementById('lead-form-statut').value,
          source: document.getElementById('lead-form-source').value,
          notes: document.getElementById('lead-form-notes').value.trim(),
          date: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };

        // Sauvegarde API
        try {
          await fetch('/api/admin/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLead)
          });
        } catch(err) {
          console.warn('Sauvegarde lead en mode local:', err.message);
        }

        // MAJ état local
        const idx = state.leads.findIndex(l => l.id === id);
        if (idx >= 0) {
          state.leads[idx] = newLead;
        } else {
          state.leads.unshift(newLead);
        }

        saveToLocalStorage();
        closeModal();
        renderAll();
        showToast('Demande client enregistrée avec succès !');
      });
    }
  }

  function renderLeads() {
    const container = document.getElementById('leads-cards-container');
    const searchInput = document.getElementById('leads-search-input');
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Compteurs filtres
    updateLeadFilterCounts();

    let filtered = state.leads.filter(l => {
      // Filtre statut
      if (state.currentLeadFilter !== 'ALL' && l.statut !== state.currentLeadFilter) {
        return false;
      }
      // Filtre recherche
      if (term) {
        const text = `${l.nom} ${l.entreprise} ${l.contact} ${l.email} ${l.besoin} ${l.notes} ${l.ref}`.toLowerCase();
        return text.includes(term);
      }
      return true;
    });

    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:50px 20px; background:var(--admin-surface); border-radius:12px; border:1px dashed var(--admin-border);">
          <span style="font-size:2rem; display:block; margin-bottom:10px;">🔍</span>
          <p style="color:var(--admin-text-muted); font-size:0.95rem;">Aucune demande client trouvée dans cette sélection.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(lead => {
      const cleanPhone = (lead.whatsapp || lead.contact || '').replace(/[^0-9]/g, '');
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

      return `
        <div class="lead-card" id="card-${lead.id}">
          <div class="lead-card-header">
            <div class="lead-client-info">
              <h3 class="lead-client-name">
                ${escapeHtml(lead.nom)}
                <span class="lead-ref-tag">${escapeHtml(lead.ref || 'LEAD')}</span>
              </h3>
              <p class="lead-company">🏢 ${escapeHtml(lead.entreprise || 'Entreprise non précisée')}</p>
            </div>

            <div class="lead-badges-wrap">
              <select class="lead-status-badge ${getStatusClass(lead.statut)}" data-change-lead-status="${lead.id}" style="border:none; outline:none; font-family:inherit;">
                <option value="Nouveau" ${lead.statut === 'Nouveau' ? 'selected' : ''}>Nouveau</option>
                <option value="Contacté" ${lead.statut === 'Contacté' ? 'selected' : ''}>Contacté</option>
                <option value="Devis envoyé" ${lead.statut === 'Devis envoyé' ? 'selected' : ''}>Devis envoyé</option>
                <option value="Gagné" ${lead.statut === 'Gagné' ? 'selected' : ''}>Gagné / Signé</option>
                <option value="Archivé" ${lead.statut === 'Archivé' ? 'selected' : ''}>Archivé</option>
              </select>
            </div>
          </div>

          <div class="lead-contacts-bar">
            <span class="lead-contact-item">📞 ${escapeHtml(lead.contact || 'N/A')}</span>
            ${waLink ? `<a href="${waLink}" target="_blank" class="btn-wa-direct">📲 Ouvrir WhatsApp</a>` : ''}
            ${lead.email ? `<span class="lead-contact-item">✉️ <a href="mailto:${escapeHtml(lead.email)}" style="color:inherit;">${escapeHtml(lead.email)}</a></span>` : ''}
            ${lead.budget ? `<span class="lead-contact-item" style="color:var(--gold-light);">💰 Budget : ${escapeHtml(lead.budget)}</span>` : ''}
          </div>

          <div class="lead-need-box">
            <div class="lead-need-label">Besoin Exprimé & Problématique :</div>
            <p>${escapeHtml(lead.besoin || 'Non spécifié')}</p>
            ${lead.solution ? `<p style="margin-top:6px; font-size:0.82rem; color:var(--admin-text-muted);"><strong>Solution préconisée :</strong> ${escapeHtml(lead.solution)}</p>` : ''}
          </div>

          ${lead.notes ? `
            <div style="font-size:0.8rem; color:var(--admin-text-dim); font-style:italic;">
              <strong>Notes internes :</strong> ${escapeHtml(lead.notes)}
            </div>
          ` : ''}

          <div class="lead-footer-row">
            <div>
              <span>Date : ${escapeHtml(lead.date || 'Récemment')}</span> • 
              <span>Canal : ${escapeHtml(lead.source || 'Site Web')}</span>
            </div>

            <div class="lead-actions-btns">
              <button type="button" class="btn-lead-proforma" data-lead-to-proforma="${lead.id}">
                📄 Créer une Proforma
              </button>
              <button type="button" class="btn-icon-subtle" title="Modifier" data-edit-lead="${lead.id}">
                ✏️
              </button>
              <button type="button" class="btn-icon-subtle delete" title="Supprimer" data-delete-lead="${lead.id}">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Listeners sur les cartes
    container.querySelectorAll('[data-change-lead-status]').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const id = sel.getAttribute('data-change-lead-status');
        const newStatut = e.target.value;
        const targetLead = state.leads.find(l => l.id === id);
        if (targetLead) {
          targetLead.statut = newStatut;
          sel.className = `lead-status-badge ${getStatusClass(newStatut)}`;
          try {
            await fetch('/api/admin/lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(targetLead)
            });
          } catch(err) {}
          saveToLocalStorage();
          renderKPIs();
          showToast(`Statut mis à jour : ${newStatut}`);
        }
      });
    });

    container.querySelectorAll('[data-lead-to-proforma]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-lead-to-proforma');
        const targetLead = state.leads.find(l => l.id === id);
        if (targetLead) openProformaBuilderFromLead(targetLead);
      });
    });

    container.querySelectorAll('[data-edit-lead]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-lead');
        const targetLead = state.leads.find(l => l.id === id);
        if (targetLead) editLeadModal(targetLead);
      });
    });

    container.querySelectorAll('[data-delete-lead]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-lead');
        if (confirm('Voulez-vous vraiment supprimer cette demande client ?')) {
          try {
            await fetch('/api/admin/lead', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
          } catch(e) {}
          state.leads = state.leads.filter(l => l.id !== id);
          saveToLocalStorage();
          renderAll();
          showToast('Demande supprimée.');
        }
      });
    });
  }

  function editLeadModal(lead) {
    const modal = document.getElementById('modal-lead-form');
    document.getElementById('lead-modal-title').textContent = 'Modifier la Demande Client';
    document.getElementById('lead-form-id').value = lead.id;
    document.getElementById('lead-form-nom').value = lead.nom || '';
    document.getElementById('lead-form-entreprise').value = lead.entreprise || '';
    document.getElementById('lead-form-contact').value = lead.contact || '';
    document.getElementById('lead-form-email').value = lead.email || '';
    document.getElementById('lead-form-secteur').value = lead.secteur || '';
    document.getElementById('lead-form-budget').value = lead.budget || '';
    document.getElementById('lead-form-besoin').value = lead.besoin || '';
    document.getElementById('lead-form-statut').value = lead.statut || 'Nouveau';
    document.getElementById('lead-form-source').value = lead.source || 'Manuel (Rendez-vous / Appel)';
    document.getElementById('lead-form-notes').value = lead.notes || '';
    modal.classList.remove('hidden');
  }

  function updateLeadFilterCounts() {
    const setTxt = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setTxt('count-lead-all', state.leads.length);
    setTxt('count-lead-nouveau', state.leads.filter(l => l.statut === 'Nouveau').length);
    setTxt('count-lead-contacte', state.leads.filter(l => l.statut === 'Contacté').length);
    setTxt('count-lead-devis', state.leads.filter(l => l.statut === 'Devis envoyé').length);
    setTxt('count-lead-gagne', state.leads.filter(l => l.statut === 'Gagné').length);
  }

  function initFilters() {
    // Filtres leads
    document.querySelectorAll('[data-lead-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-lead-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentLeadFilter = btn.getAttribute('data-lead-filter');
        renderLeads();
      });
    });

    // Filtres proformas
    document.querySelectorAll('[data-proforma-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-proforma-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentProformaFilter = btn.getAttribute('data-proforma-filter');
        renderProformas();
      });
    });

    const pfSearch = document.getElementById('proformas-search-input');
    if (pfSearch) {
      pfSearch.addEventListener('input', () => renderProformas());
    }
  }

  // ==========================================================================
  // 6. MOTEUR & GÉNÉRATEUR DE FACTURES PROFORMA
  // ==========================================================================
  let currentItemsList = [];

  function initProformaBuilderEvents() {
    const modal = document.getElementById('modal-proforma-builder');
    const btnNewProforma = document.getElementById('btn-new-proforma');
    const btnQuickCreateProforma = document.getElementById('btn-quick-create-proforma');
    const btnCloseModal = document.getElementById('btn-close-proforma-modal');
    const btnAddItemLine = document.getElementById('btn-add-item-line');
    const btnSaveProforma = document.getElementById('btn-save-proforma');
    const btnConvertToProject = document.getElementById('btn-convert-to-project');
    const btnPrint = document.getElementById('btn-print-proforma');
    const btnWhatsapp = document.getElementById('btn-whatsapp-proforma');

    // Preset Catalog Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-preset');
        const preset = PRESET_CATALOG[key];
        if (preset) {
          addItemLine(preset.desc, preset.qty, preset.price);
          updateProformaCalculationsAndPreview();
          showToast(`Prestation ajoutée au devis !`);
        }
      });
    });

    const openEmptyBuilder = () => {
      const nextRef = `AF-PRO-2026-${String(state.proformas.length + 1).padStart(3, '0')}`;
      openProformaBuilder({
        ref: nextRef,
        date: new Date().toISOString().substring(0, 10),
        validite: '30 jours',
        clientNom: '',
        clientEntreprise: '',
        clientContact: '',
        clientEmail: '',
        devise: 'FCFA',
        statut: 'Envoyée',
        items: [
          {
            description: "Conception & Développement de Solution Digitale AIFORCE",
            quantite: 1,
            prixUnitaire: 2500000,
            total: 2500000
          }
        ],
        remisePourcent: 0,
        tvaPourcent: 0,
        acompteExige: '50% à la commande, 30% après validation du MVP, 20% à la livraison finale',
        delaiLivraison: '3 à 4 semaines',
        notes: 'Code source 100% propriété du client. Garantie corrective de 6 mois incluse.'
      });
    };

    if (btnNewProforma) btnNewProforma.addEventListener('click', openEmptyBuilder);
    if (btnQuickCreateProforma) btnQuickCreateProforma.addEventListener('click', () => {
      switchTab('tab-proformas');
      openEmptyBuilder();
    });

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (btnAddItemLine) {
      btnAddItemLine.addEventListener('click', () => {
        addItemLine('', 1, 0);
        updateProformaCalculationsAndPreview();
      });
    }

    // Input listeners pour recalcul temps réel sur TOUS les champs
    const inputsToWatch = [
      'pf-ref', 'pf-date', 'pf-validite', 'pf-devise',
      'pf-client-nom', 'pf-client-entreprise', 'pf-client-contact', 'pf-client-email',
      'pf-titre', 'pf-description',
      'pf-remise', 'pf-tva',
      'pf-pay-avance-pct', 'pf-pay-avance-lbl',
      'pf-pay-inter-pct', 'pf-pay-inter-lbl',
      'pf-pay-solde-pct', 'pf-pay-solde-lbl',
      'pf-delai', 'pf-pay-moyen',
      'pf-conditions', 'pf-sign-rep', 'pf-statut'
    ];

    inputsToWatch.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          if (id === 'pf-pay-avance-pct' || id === 'pf-pay-inter-pct') {
            const av = parseFloat(document.getElementById('pf-pay-avance-pct')?.value) || 0;
            const it = parseFloat(document.getElementById('pf-pay-inter-pct')?.value) || 0;
            const soldeInput = document.getElementById('pf-pay-solde-pct');
            if (soldeInput) soldeInput.value = Math.max(0, 100 - av - it);
          }
          updateProformaCalculationsAndPreview();
        });
        el.addEventListener('change', updateProformaCalculationsAndPreview);
      }
    });

    // Sauvegarde Proforma
    if (btnSaveProforma) {
      btnSaveProforma.addEventListener('click', async () => {
        const proformaData = extractProformaDataFromForm();
        if (!proformaData.clientNom) {
          alert('Veuillez renseigner le nom du client.');
          return;
        }

        try {
          await fetch('/api/admin/proforma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proformaData)
          });
        } catch(e) {}

        const idx = state.proformas.findIndex(p => p.id === proformaData.id || p.ref === proformaData.ref);
        if (idx >= 0) {
          state.proformas[idx] = proformaData;
        } else {
          state.proformas.unshift(proformaData);
        }

        saveToLocalStorage();
        renderAll();
        modal.classList.add('hidden');
        showToast(`Facture proforma ${proformaData.ref} enregistrée !`);
      });
    }

    // Conversion en Projet en cours
    if (btnConvertToProject) {
      btnConvertToProject.addEventListener('click', async () => {
        const proformaData = extractProformaDataFromForm();
        const montant = proformaData.totalTTC;
        const j1Val = Math.round(montant * ((proformaData.avancePct || 50) / 100));

        const newPrj = {
          id: `proj-${Date.now()}`,
          ref: `AF-PRJ-2026-${String(state.projects.length + 1).padStart(2, '0')}`,
          titre: proformaData.titre || proformaData.items[0]?.description || 'Nouveau Projet AIFORCE',
          client: proformaData.clientEntreprise || proformaData.clientNom,
          contact: proformaData.clientContact,
          marcheMontant: montant,
          encaisse: j1Val,
          resteAPayer: Math.max(0, montant - j1Val),
          devise: proformaData.devise,
          statut: 'En cours',
          etape: 'Cadrage & Lancement du développement MVP',
          dateDebut: new Date().toISOString().substring(0, 10),
          dateFinPrevue: '',
          progression: 20,
          livrables: proformaData.items.map(item => ({ nom: item.description, fait: false })),
          proformaRef: proformaData.ref
        };

        try {
          await fetch('/api/admin/project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPrj)
          });
        } catch(e) {}

        state.projects.unshift(newPrj);
        saveToLocalStorage();
        renderAll();
        modal.classList.add('hidden');
        switchTab('tab-projects');
        showToast(`Marché converti avec succès en projet actif !`);
      });
    }

    // Impression / PDF A4 (Format 2 pages strict)
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Partage WhatsApp
    if (btnWhatsapp) {
      btnWhatsapp.addEventListener('click', () => {
        const pf = extractProformaDataFromForm();
        const phone = (pf.clientContact || '').replace(/[^0-9]/g, '');

        const avanceVal = Math.round(pf.totalTTC * (pf.avancePct / 100));
        const interVal = Math.round(pf.totalTTC * (pf.interPct / 100));
        const soldeVal = Math.max(0, pf.totalTTC - avanceVal - interVal);

        const lines = [
          `*AIFORCE AGENCY — FACTURE PROFORMA*`,
          `*N° Devis :* ${pf.ref}`,
          `*Date :* ${pf.date}`,
          `*Client :* ${pf.clientNom} ${pf.clientEntreprise ? `(${pf.clientEntreprise})` : ''}`,
          `*Objet :* ${pf.titre}`,
          ``,
          `*Détail des prestations :*`,
          ...pf.items.map(it => `• ${it.description} — ${formatNumber(it.total)} ${pf.devise}`),
          ``,
          `*MONTANT FORFAITAIRE NET :* *${formatNumber(pf.totalTTC)} ${pf.devise}*`,
          ``,
          `*Modalités de règlement :*`,
          ...(pf.avancePct > 0 ? [`• Avance (${pf.avancePct}%) : ${formatNumber(avanceVal)} ${pf.devise} — ${pf.avanceLbl}`] : []),
          ...(pf.interPct > 0 ? [`• 2e acompte (${pf.interPct}%) : ${formatNumber(interVal)} ${pf.devise} — ${pf.interLbl}`] : []),
          ...(pf.soldePct > 0 ? [`• Solde (${pf.soldePct}%) : ${formatNumber(soldeVal)} ${pf.devise} — ${pf.soldeLbl}`] : []),
          `• Délai estimé de réalisation : ${pf.delaiLivraison}`,
          ``,
          `Bonjour, veuillez trouver ci-dessus notre facture proforma officielle émise par AIFORCE AGENCY. Nous restons à votre entière disposition pour tout échange technique.`
        ];

        const text = encodeURIComponent(lines.join('\n'));
        const targetUrl = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
        window.open(targetUrl, '_blank');
      });
    }
  }

  // ==========================================================================
  // SMART AI PROJECT ANALYZER & SCOPE ESTIMATOR (MARKET RATES & CLEAN SCOPE)
  // ==========================================================================
  function smartAnalyzeProjectScope(rawBesoin, companyName, clientBudget, clientNom) {
    const text = (rawBesoin || '').trim();

    // 1. Extraire ou formuler un titre propre
    let cleanTitre = "Conception & Développement de Solution Digitale sur-mesure";
    const titleMatch = text.match(/^#+\s*Projet\s*:\s*([^\n\r]+)/i) || text.match(/^#+\s*([^\n\r]+)/i);
    if (titleMatch && titleMatch[1]) {
      cleanTitre = titleMatch[1].replace(/[*_#]/g, '').trim();
    } else if (text.length > 0 && text.length < 80) {
      cleanTitre = text.replace(/[*_#]/g, '').trim();
    }

    // 2. Extraire ou formuler l'objectif principal
    let objectif = "";
    const objMatch = text.match(/\*\*Objectif\s*:\*\*\s*([^\n\r]+(?:\n[^\n\r#]+)?)/i) || text.match(/Objectif\s*:\s*([^\n\r]+)/i);
    if (objMatch && objMatch[1]) {
      objectif = objMatch[1].replace(/[*_#]/g, '').trim();
    }

    const lower = text.toLowerCase();
    const isMobile = lower.includes('mobile') || lower.includes('flutter') || lower.includes('react native') || lower.includes('ios') || lower.includes('android');
    const isStockOrCommerce = lower.includes('stock') || lower.includes('vente') || lower.includes('e-commerce') || lower.includes('produit');
    const isAIOrAutomation = lower.includes('automatisation') || lower.includes('ia') || lower.includes('intelligence') || lower.includes('n8n') || lower.includes('webhook');

    // 3. Synthèse description concise pour la Facture Proforma
    let shortDescription = "";
    if (cleanTitre.toLowerCase().includes('smartstock') || (isStockOrCommerce && cleanTitre.toLowerCase().includes('stock'))) {
      shortDescription = `Conception, développement et déploiement clé en main de la plateforme logicielle SmartStock (gestion des stocks, ventes, alertes de rupture automatiques et reporting décisionnel).`;
    } else if (objectif) {
      const shortObj = objectif.length > 150 ? objectif.substring(0, 147) + '...' : objectif;
      shortDescription = `Ingénierie logicielle et mise en œuvre clé en main : ${shortObj}.`;
    } else {
      shortDescription = `Conception, ingénierie logicielle et déploiement de la solution digitale ${cleanTitre}.`;
    }

    // 4. Découpage en prestations avec tarification marché (Barème AIFORCE Agency)
    let suggestedItems = [];
    if (isStockOrCommerce || cleanTitre.toLowerCase().includes('smartstock')) {
      suggestedItems = [
        {
          description: "Architecture Système, Modélisation PostgreSQL & Authentification Sécurisée (RBAC 3 Rôles)",
          quantite: 1,
          prixUnitaire: 750000,
          total: 750000
        },
        {
          description: "Interface Frontend Responsive (React / Next.js) : Tableaux de bord en temps réel & Catalogue Produits",
          quantite: 1,
          prixUnitaire: 1250000,
          total: 1250000
        },
        {
          description: "Modules Métiers : Gestion des Ventes, Fournisseurs, Facturation & Moteur d'Alertes Automatiques",
          quantite: 1,
          prixUnitaire: 950000,
          total: 950000
        },
        {
          description: "Recette Applicative, Déploiement Cloud Sécurisé, Données Démo & Documentation d'Exploitation",
          quantite: 1,
          prixUnitaire: 450000,
          total: 450000
        }
      ];
    } else if (isMobile) {
      suggestedItems = [
        {
          description: "Conception UI/UX Ergonomique & Architecture Mobile Multiplateforme (iOS & Android)",
          quantite: 1,
          prixUnitaire: 900000,
          total: 900000
        },
        {
          description: "Développement Frontend Mobile & Synchronisation Données Hors-Ligne",
          quantite: 1,
          prixUnitaire: 1500000,
          total: 1500000
        },
        {
          description: "API Backend Sécurisée, Notifications Push & Intégration Moyens de Paiement",
          quantite: 1,
          prixUnitaire: 850000,
          total: 850000
        },
        {
          description: "Publication sur les Stores (Apple App Store / Google Play) & Recette finale",
          quantite: 1,
          prixUnitaire: 350000,
          total: 350000
        }
      ];
    } else if (isAIOrAutomation) {
      suggestedItems = [
        {
          description: "Audit des Processus Métiers & Architecture d'Automatisation Multi-Canal",
          quantite: 1,
          prixUnitaire: 600000,
          total: 600000
        },
        {
          description: "Orchestration des Workflows n8n, Connexions API & Webhooks Sécurisés",
          quantite: 1,
          prixUnitaire: 950000,
          total: 950000
        },
        {
          description: "Intégration d'Agents IA Métiers (LLM / RAG), Traitement du Langage & Base Vectorielle",
          quantite: 1,
          prixUnitaire: 850000,
          total: 850000
        },
        {
          description: "Tests de Charge, Monitoring d'Erreurs, Recette & Formation à l'Administration",
          quantite: 1,
          prixUnitaire: 400000,
          total: 400000
        }
      ];
    } else {
      suggestedItems = [
        {
          description: "Cadrage Fonctionnel, Architecture Logicielle & Modélisation de Données",
          quantite: 1,
          prixUnitaire: 650000,
          total: 650000
        },
        {
          description: "Développement Fullstack de la Solution Digitale & Interfaces Administrateur",
          quantite: 1,
          prixUnitaire: 1450000,
          total: 1450000
        },
        {
          description: "Intégrations API, Recette, Déploiement en Production & Accompagnement",
          quantite: 1,
          prixUnitaire: 500000,
          total: 500000
        }
      ];
    }

    // Si le client avait un budget numérique spécifique, recalibrer les proportions
    const rawBudgetNum = parseInt((clientBudget || '').replace(/[^0-9]/g, '')) || 0;
    if (rawBudgetNum >= 500000 && rawBudgetNum <= 20000000) {
      const currentSum = suggestedItems.reduce((acc, it) => acc + it.total, 0);
      const ratio = rawBudgetNum / currentSum;
      suggestedItems.forEach(it => {
        it.prixUnitaire = Math.round((it.prixUnitaire * ratio) / 25000) * 25000;
        it.total = it.prixUnitaire;
      });
      const diff = rawBudgetNum - suggestedItems.reduce((acc, it) => acc + it.total, 0);
      if (diff !== 0 && suggestedItems.length > 0) {
        suggestedItems[suggestedItems.length - 1].prixUnitaire += diff;
        suggestedItems[suggestedItems.length - 1].total += diff;
      }
    }

    return {
      cleanTitre,
      shortDescription,
      suggestedItems,
      delai: (lower.includes('complexe') || isMobile) ? '4 à 6 semaines' : '3 à 4 semaines'
    };
  }

  function openProformaBuilderFromLead(lead) {
    const nextRef = `AF-PRO-2026-${String(state.proformas.length + 1).padStart(3, '0')}`;

    // Analyse intelligente du projet et tarification au marché par l'IA
    const analysis = smartAnalyzeProjectScope(lead.besoin, lead.entreprise, lead.budget, lead.nom);

    // Nettoyer le nom et l'entreprise si concaténés
    let clientNom = (lead.nom || '').trim();
    let clientEntreprise = (lead.entreprise || '').trim();
    if (clientNom.includes(' — ')) {
      const parts = clientNom.split(' — ');
      clientNom = parts[0].trim();
      if (!clientEntreprise || clientEntreprise.includes(clientNom)) {
        clientEntreprise = parts[1].replace(/\([^)]*\)/g, '').trim();
      }
    }
    clientEntreprise = clientEntreprise.replace(/\([^)]*\)/g, '').trim();

    openProformaBuilder({
      ref: nextRef,
      leadId: lead.id,
      titre: analysis.cleanTitre,
      description: analysis.shortDescription,
      date: new Date().toISOString().substring(0, 10),
      validite: '30 jours',
      clientNom: clientNom,
      clientEntreprise: clientEntreprise,
      clientContact: lead.contact || '',
      clientEmail: lead.email || '',
      devise: 'FCFA',
      statut: 'Envoyée',
      avancePct: 50,
      avanceLbl: 'À la commande / signature',
      interPct: 0,
      interLbl: 'À la validation MVP / Prototype',
      soldePct: 50,
      soldeLbl: 'À la livraison finale & recette',
      delaiLivraison: analysis.delai || lead.delai || '3 à 4 semaines',
      payMoyen: 'Virement Bancaire (RIB fourni à la signature) ou Mobile Money Bénin',
      conditions: "• Frais récurrents tiers : Les abonnements cloud, hébergement, noms de domaine et clés API restent à la charge du client.\n• Propriété intellectuelle : Le code source intégral et les accès sont transférés à 100% au client à solde du compte.\n• Garantie : Garantie corrective et accompagnement technique inclus pendant 30 jours après mise en ligne.",
      signRep: 'Direction AIFORCE AGENCY',
      items: analysis.suggestedItems,
      remisePourcent: 0,
      tvaPourcent: 0
    });

    // Mettre à jour le lead en statut "Devis envoyé"
    lead.statut = 'Devis envoyé';
    saveToLocalStorage();
    renderLeads();
  }

  function openProformaBuilder(proforma) {
    state.editingProforma = proforma;
    const modal = document.getElementById('modal-proforma-builder');

    document.getElementById('pf-ref').value = proforma.ref || '';
    document.getElementById('pf-date').value = proforma.date || new Date().toISOString().substring(0, 10);
    document.getElementById('pf-validite').value = proforma.validite || '30 jours';
    document.getElementById('pf-devise').value = proforma.devise || 'FCFA';

    document.getElementById('pf-client-nom').value = proforma.clientNom || '';
    document.getElementById('pf-client-entreprise').value = proforma.clientEntreprise || '';
    document.getElementById('pf-client-contact').value = proforma.clientContact || '';
    document.getElementById('pf-client-email').value = proforma.clientEmail || '';

    document.getElementById('pf-titre').value = proforma.titre || 'Conception & Développement de Solution Digitale sur-mesure & Automatisation IA';
    document.getElementById('pf-description').value = proforma.description || "Développement d'une application sur-mesure haute performance, centralisation des flux métiers et automatisation des processus avec intégration d'un assistant IA dédié.";

    document.getElementById('pf-remise').value = proforma.remisePourcent || 0;
    document.getElementById('pf-tva').value = proforma.tvaPourcent || 0;

    document.getElementById('pf-pay-avance-pct').value = proforma.avancePct !== undefined ? proforma.avancePct : 50;
    document.getElementById('pf-pay-avance-lbl').value = proforma.avanceLbl || 'À la commande / signature';
    document.getElementById('pf-pay-inter-pct').value = proforma.interPct || 0;
    document.getElementById('pf-pay-inter-lbl').value = proforma.interLbl || 'À la validation MVP / Prototype';
    document.getElementById('pf-pay-solde-pct').value = proforma.soldePct !== undefined ? proforma.soldePct : 50;
    document.getElementById('pf-pay-solde-lbl').value = proforma.soldeLbl || 'À la livraison finale & recette';

    document.getElementById('pf-delai').value = proforma.delaiLivraison || '3 à 4 semaines';
    document.getElementById('pf-pay-moyen').value = proforma.payMoyen || 'Virement Bancaire (RIB fourni à la signature) ou Mobile Money Bénin';
    document.getElementById('pf-conditions').value = proforma.conditions || "• Frais récurrents tiers : Les abonnements cloud, hébergement, noms de domaine et clés API restent à la charge du client.\n• Propriété intellectuelle : Le code source intégral et les accès sont transférés à 100% au client à solde du compte.\n• Garantie : Garantie corrective et accompagnement technique inclus pendant 30 jours après mise en ligne.";
    document.getElementById('pf-sign-rep').value = proforma.signRep || 'Direction AIFORCE AGENCY';
    document.getElementById('pf-statut').value = proforma.statut || 'Envoyée';

    currentItemsList = proforma.items && proforma.items.length > 0
      ? JSON.parse(JSON.stringify(proforma.items))
      : [{ description: 'Prestation d\'ingénierie logicielle & automatisation', quantite: 1, prixUnitaire: 2500000, total: 2500000 }];

    renderItemsTable();
    updateProformaCalculationsAndPreview();
    modal.classList.remove('hidden');
  }

  function addItemLine(description, qty, price) {
    currentItemsList.push({
      description: description || '',
      quantite: qty || 1,
      prixUnitaire: price || 0,
      total: (qty || 1) * (price || 0)
    });
    renderItemsTable();
    updateProformaCalculationsAndPreview();
  }

  function renderItemsTable() {
    const tbody = document.getElementById('pf-items-tbody');
    if (!tbody) return;

    tbody.innerHTML = currentItemsList.map((item, index) => `
      <tr data-item-index="${index}">
        <td>
          <input type="text" class="item-desc-input" value="${escapeHtml(item.description)}" placeholder="Description de la prestation..." required>
        </td>
        <td>
          <input type="number" class="item-qty-input" value="${item.quantite}" min="1" style="text-align:center;">
        </td>
        <td>
          <input type="number" class="item-price-input" value="${item.prixUnitaire}" min="0" step="1000">
        </td>
        <td style="text-align:center;">
          <button type="button" class="btn-remove-row" data-remove-index="${index}" title="Supprimer la ligne">✕</button>
        </td>
      </tr>
    `).join('');

    // Listeners sur les champs
    tbody.querySelectorAll('tr').forEach(tr => {
      const idx = parseInt(tr.getAttribute('data-item-index'));
      const descInput = tr.querySelector('.item-desc-input');
      const qtyInput = tr.querySelector('.item-qty-input');
      const priceInput = tr.querySelector('.item-price-input');
      const removeBtn = tr.querySelector('[data-remove-index]');

      const updateRow = () => {
        currentItemsList[idx].description = descInput.value;
        currentItemsList[idx].quantite = parseFloat(qtyInput.value) || 1;
        currentItemsList[idx].prixUnitaire = parseFloat(priceInput.value) || 0;
        currentItemsList[idx].total = currentItemsList[idx].quantite * currentItemsList[idx].prixUnitaire;
        updateProformaCalculationsAndPreview();
      };

      descInput.addEventListener('input', updateRow);
      qtyInput.addEventListener('input', updateRow);
      priceInput.addEventListener('input', updateRow);

      removeBtn.addEventListener('click', () => {
        if (currentItemsList.length > 1) {
          currentItemsList.splice(idx, 1);
          renderItemsTable();
          updateProformaCalculationsAndPreview();
        } else {
          alert('Le devis doit comporter au moins une ligne de prestation.');
        }
      });
    });
  }

  function extractProformaDataFromForm() {
    const ref = document.getElementById('pf-ref')?.value.trim() || 'AF-PRO-2026-001';
    const date = document.getElementById('pf-date')?.value || new Date().toISOString().substring(0, 10);
    const validite = document.getElementById('pf-validite')?.value.trim() || '30 jours';
    const devise = document.getElementById('pf-devise')?.value || 'FCFA';

    const clientNom = document.getElementById('pf-client-nom')?.value.trim() || '';
    const clientEntreprise = document.getElementById('pf-client-entreprise')?.value.trim() || '';
    const clientContact = document.getElementById('pf-client-contact')?.value.trim() || '';
    const clientEmail = document.getElementById('pf-client-email')?.value.trim() || '';

    const titre = document.getElementById('pf-titre')?.value.trim() || 'Conception & Développement de Solution Digitale sur-mesure & Automatisation IA';
    const description = document.getElementById('pf-description')?.value.trim() || '';

    const remisePourcent = parseFloat(document.getElementById('pf-remise')?.value) || 0;
    const tvaPourcent = parseFloat(document.getElementById('pf-tva')?.value) || 0;

    const avancePct = parseFloat(document.getElementById('pf-pay-avance-pct')?.value) || 50;
    const avanceLbl = document.getElementById('pf-pay-avance-lbl')?.value.trim() || 'À la commande / signature';
    const interPct = parseFloat(document.getElementById('pf-pay-inter-pct')?.value) || 0;
    const interLbl = document.getElementById('pf-pay-inter-lbl')?.value.trim() || 'À la validation MVP / Prototype';
    const soldePct = parseFloat(document.getElementById('pf-pay-solde-pct')?.value) || 50;
    const soldeLbl = document.getElementById('pf-pay-solde-lbl')?.value.trim() || 'À la livraison finale & recette';

    const delaiLivraison = document.getElementById('pf-delai')?.value.trim() || '3 à 4 semaines';
    const payMoyen = document.getElementById('pf-pay-moyen')?.value.trim() || 'Virement Bancaire ou Mobile Money';
    const conditions = document.getElementById('pf-conditions')?.value.trim() || '';
    const signRep = document.getElementById('pf-sign-rep')?.value.trim() || 'Direction AIFORCE AGENCY';
    const statut = document.getElementById('pf-statut')?.value || 'Envoyée';

    const sousTotal = currentItemsList.reduce((acc, it) => acc + (it.quantite * it.prixUnitaire), 0);
    const remiseMontant = Math.round(sousTotal * (remisePourcent / 100));
    const apresRemise = sousTotal - remiseMontant;
    const tvaMontant = Math.round(apresRemise * (tvaPourcent / 100));
    const totalTTC = apresRemise + tvaMontant;

    return {
      id: state.editingProforma?.id || `pro-${Date.now()}`,
      ref,
      date,
      validite,
      devise,
      clientNom,
      clientEntreprise,
      clientContact,
      clientEmail,
      titre,
      description,
      rawBesoin: state.editingProforma?.rawBesoin || '',
      items: currentItemsList,
      sousTotal,
      remisePourcent,
      remiseMontant,
      tvaPourcent,
      tvaMontant,
      totalTTC,
      avancePct,
      avanceLbl,
      interPct,
      interLbl,
      soldePct,
      soldeLbl,
      delaiLivraison,
      payMoyen,
      conditions,
      signRep,
      statut
    };
  }

  function updateProformaCalculationsAndPreview() {
    const pf = extractProformaDataFromForm();

    // En-tête & Métadonnées
    const prevRef = document.getElementById('prev-ref');
    const prevDate = document.getElementById('prev-date');
    const prevValidite = document.getElementById('prev-validite');

    if (prevRef) prevRef.textContent = pf.ref;
    if (prevDate) prevDate.textContent = pf.date ? formatDateFr(pf.date) : 'Date';
    if (prevValidite) prevValidite.textContent = pf.validite;

    // Coordonnées Client
    const prevClientNom = document.getElementById('prev-client-nom');
    const prevClientEntreprise = document.getElementById('prev-client-entreprise');
    const prevClientContact = document.getElementById('prev-client-contact');
    const prevClientEmail = document.getElementById('prev-client-email');

    if (prevClientNom) prevClientNom.textContent = pf.clientNom || 'Client Destinataire';
    if (prevClientEntreprise) prevClientEntreprise.textContent = pf.clientEntreprise || 'Entreprise / Structure';
    if (prevClientContact) prevClientContact.textContent = pf.clientContact ? `📞 ${pf.clientContact}` : '📞 Contact client';
    if (prevClientEmail) prevClientEmail.textContent = pf.clientEmail ? `✉️ ${pf.clientEmail}` : '✉️ contact@client.com';

    // Objet de la mission (Page 1)
    const prevTitre = document.getElementById('prev-titre');
    const prevDescription = document.getElementById('prev-description');
    if (prevTitre) prevTitre.textContent = pf.titre || 'Mission AIFORCE';
    if (prevDescription) prevDescription.textContent = pf.description || '';

    // Tableau des prestations
    const prevItemsTbody = document.getElementById('prev-items-tbody');
    if (prevItemsTbody) {
      prevItemsTbody.innerHTML = pf.items.map(it => `
        <tr>
          <td><strong>${escapeHtml(it.description || 'Prestation')}</strong></td>
          <td style="text-align: center;">${it.quantite}</td>
          <td style="text-align: right;">${formatNumber(it.prixUnitaire)} ${pf.devise}</td>
          <td style="text-align: right; font-weight:700;">${formatNumber(it.quantite * it.prixUnitaire)} ${pf.devise}</td>
        </tr>
      `).join('');
    }

    // Totaux
    const prevSubtotalTxt = document.getElementById('prev-subtotal-txt');
    const prevRemiseTxt = document.getElementById('prev-remise-txt');
    const prevTvaTxt = document.getElementById('prev-tva-txt');
    const prevTotalTTC = document.getElementById('prev-total-ttc');

    if (prevSubtotalTxt) prevSubtotalTxt.textContent = `Sous-Total : ${formatNumber(pf.sousTotal)} ${pf.devise}`;
    if (prevRemiseTxt) {
      if (pf.remisePourcent > 0) {
        prevRemiseTxt.style.display = 'inline';
        prevRemiseTxt.textContent = `• Remise : -${formatNumber(pf.remiseMontant)} ${pf.devise} (${pf.remisePourcent}%)`;
      } else {
        prevRemiseTxt.style.display = 'none';
      }
    }

    if (prevTvaTxt) {
      if (pf.tvaPourcent > 0) {
        prevTvaTxt.style.display = 'inline';
        prevTvaTxt.textContent = `• TVA : +${formatNumber(pf.tvaMontant)} ${pf.devise} (${pf.tvaPourcent}%)`;
      } else {
        prevTvaTxt.style.display = 'none';
      }
    }

    if (prevTotalTTC) prevTotalTTC.textContent = `${formatNumber(pf.totalTTC)} ${pf.devise}`;

    // Modalités de règlement
    const prevPaymentBox = document.getElementById('prev-payment-box');
    if (prevPaymentBox) {
      const avanceVal = Math.round(pf.totalTTC * (pf.avancePct / 100));
      const interVal = Math.round(pf.totalTTC * (pf.interPct / 100));
      const soldeVal = Math.max(0, pf.totalTTC - avanceVal - interVal);

      let payHtml = '';
      if (pf.avancePct > 0) {
        payHtml += `
          <div class="a4-payment-clean-line">
            <span>• <strong>Avance à la commande (${pf.avancePct}%) :</strong> ${escapeHtml(pf.avanceLbl)}</span>
            <strong>${formatNumber(avanceVal)} ${pf.devise}</strong>
          </div>`;
      }
      if (pf.interPct > 0) {
        payHtml += `
          <div class="a4-payment-clean-line">
            <span>• <strong>2ème acompte (${pf.interPct}%) :</strong> ${escapeHtml(pf.interLbl)}</span>
            <strong>${formatNumber(interVal)} ${pf.devise}</strong>
          </div>`;
      }
      if (pf.soldePct > 0) {
        payHtml += `
          <div class="a4-payment-clean-line">
            <span>• <strong>Solde à la livraison (${pf.soldePct}%) :</strong> ${escapeHtml(pf.soldeLbl)}</span>
            <strong>${formatNumber(soldeVal)} ${pf.devise}</strong>
          </div>`;
      }

      payHtml += `
        <div class="a4-payment-clean-line" style="margin-top: 4px;">
          <span>• <strong>Planning & Délais de réalisation :</strong> Délai estimé de ${escapeHtml(pf.delaiLivraison)}.</span>
        </div>`;

      if (pf.payMoyen) {
        payHtml += `
          <div class="a4-payment-clean-line">
            <span>• <strong>Mode de règlement :</strong> ${escapeHtml(pf.payMoyen)}.</span>
          </div>`;
      }

      prevPaymentBox.innerHTML = payHtml;
    }

    // Conditions particulières & Garanties
    const prevConditionsBox = document.getElementById('prev-conditions-box');
    if (prevConditionsBox) {
      if (pf.conditions) {
        const lines = pf.conditions.split('\n').map(l => l.trim()).filter(Boolean);
        prevConditionsBox.innerHTML = lines.map(l => `<p style="margin-bottom:3px;">${escapeHtml(l)}</p>`).join('');
      } else {
        prevConditionsBox.innerHTML = '<p>Conditions standard AIFORCE applicables.</p>';
      }
    }

    // Signatures Page 1
    const prevSignClient = document.getElementById('prev-sign-client');
    const prevSignRep = document.getElementById('prev-sign-rep');
    const prevSignDate = document.getElementById('prev-sign-date');

    if (prevSignClient) prevSignClient.textContent = pf.clientEntreprise || pf.clientNom || 'Client';
    if (prevSignRep) prevSignRep.textContent = pf.signRep || 'Direction AIFORCE AGENCY';
    if (prevSignDate) prevSignDate.textContent = pf.date ? formatDateFr(pf.date) : 'Date';

    const pageNumPrev = document.getElementById('prev-page-num');
    if (pageNumPrev) pageNumPrev.textContent = 'Facture Proforma • Document Officiel AIFORCE';
  }

  function renderProformas() {
    const grid = document.getElementById('proformas-list-grid');
    const searchInput = document.getElementById('proformas-search-input');
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const countAll = document.getElementById('count-proforma-all');
    if (countAll) countAll.textContent = state.proformas.length;

    let filtered = state.proformas.filter(p => {
      if (state.currentProformaFilter !== 'ALL' && p.statut !== state.currentProformaFilter) {
        return false;
      }
      if (term) {
        const text = `${p.ref} ${p.clientNom} ${p.clientEntreprise} ${p.totalTTC}`.toLowerCase();
        return text.includes(term);
      }
      return true;
    });

    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:var(--admin-surface); border-radius:12px; border:1px dashed var(--admin-border);">
          <span style="font-size:2rem; display:block; margin-bottom:10px;">📄</span>
          <p style="color:var(--admin-text-muted); font-size:0.95rem;">Aucune facture proforma trouvée.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(pf => `
      <div class="proforma-card" id="pf-card-${pf.id}">
        <div>
          <div class="pf-card-top">
            <span class="pf-ref-badge">${escapeHtml(pf.ref)}</span>
            <span class="lead-status-badge ${getStatusClass(pf.statut)}">${escapeHtml(pf.statut)}</span>
          </div>

          <div class="pf-card-client">
            <h4>${escapeHtml(pf.clientNom)}</h4>
            <p class="pf-card-company">${escapeHtml(pf.clientEntreprise || 'Client Particulier')}</p>
          </div>

          <div class="pf-card-items-summary" style="margin-top:12px;">
            <span>${pf.items?.length || 1} prestation(s) • Émise le ${formatDateFr(pf.date)}</span>
          </div>
        </div>

        <div>
          <div class="pf-card-total-row">
            <span class="pf-total-label">Montant Total :</span>
            <span class="pf-total-amount">${formatNumber(pf.totalTTC)} ${pf.devise || 'FCFA'}</span>
          </div>

          <div class="pf-card-actions">
            <button type="button" class="btn-admin-solid" style="padding:6px 14px; font-size:0.8rem; flex:1;" data-view-proforma="${pf.id}">
              👁️ Ouvrir / PDF A4
            </button>
            <button type="button" class="btn-icon-subtle delete" data-delete-proforma="${pf.id}" title="Supprimer">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-view-proforma]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-view-proforma');
        const target = state.proformas.find(p => p.id === id);
        if (target) openProformaBuilder(target);
      });
    });

    grid.querySelectorAll('[data-delete-proforma]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-proforma');
        if (confirm('Voulez-vous supprimer cette facture proforma ?')) {
          try {
            await fetch('/api/admin/proforma', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
          } catch(e) {}
          state.proformas = state.proformas.filter(p => p.id !== id);
          saveToLocalStorage();
          renderAll();
          showToast('Proforma supprimée.');
        }
      });
    });
  }

  // ==========================================================================
  // 7. PROJETS & MARCHÉS OBTENUS (BUSINESS TRACKER)
  // ==========================================================================
  function initProjectEvents() {
    const modal = document.getElementById('modal-project-form');
    const openAddBtn = document.getElementById('btn-open-add-project-modal');
    const closeBtn = document.getElementById('btn-close-project-modal');
    const cancelBtn = document.getElementById('btn-cancel-project-modal');
    const projectForm = document.getElementById('project-edit-form');

    const openModal = () => {
      document.getElementById('project-modal-title').textContent = 'Nouveau Projet / Marché Obtenu';
      projectForm.reset();
      document.getElementById('project-form-id').value = '';
      modal.classList.remove('hidden');
    };

    if (openAddBtn) openAddBtn.addEventListener('click', openModal);
    const closeModal = () => modal.classList.add('hidden');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (projectForm) {
      projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('project-form-id').value || `proj-${Date.now()}`;
        const montant = parseFloat(document.getElementById('project-form-montant').value) || 0;
        const encaisse = parseFloat(document.getElementById('project-form-encaisse').value) || 0;

        const newPrj = {
          id,
          ref: `AF-PRJ-2026-${String(state.projects.length + 1).padStart(2, '0')}`,
          titre: document.getElementById('project-form-titre').value.trim(),
          client: document.getElementById('project-form-client').value.trim(),
          contact: document.getElementById('project-form-contact').value.trim(),
          marcheMontant: montant,
          encaisse: encaisse,
          resteAPayer: Math.max(0, montant - encaisse),
          devise: 'FCFA',
          statut: document.getElementById('project-form-statut').value,
          progression: parseInt(document.getElementById('project-form-progression').value) || 30,
          etape: document.getElementById('project-form-etape').value.trim() || 'En cours de réalisation',
          dateDebut: document.getElementById('project-form-date-debut').value || new Date().toISOString().substring(0, 10),
          dateFinPrevue: document.getElementById('project-form-date-fin').value || '',
          livrables: [
            { nom: 'Spécifications & Architecture', fait: true },
            { nom: 'Développement Frontend & Backend', fait: false },
            { nom: 'Recette & Déploiement', fait: false }
          ]
        };

        try {
          await fetch('/api/admin/project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPrj)
          });
        } catch(e) {}

        const idx = state.projects.findIndex(p => p.id === id);
        if (idx >= 0) {
          state.projects[idx] = newPrj;
        } else {
          state.projects.unshift(newPrj);
        }

        saveToLocalStorage();
        closeModal();
        renderAll();
        showToast('Projet enregistré avec succès !');
      });
    }
  }

  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (state.projects.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:var(--admin-surface); border-radius:12px; border:1px dashed var(--admin-border);">
          <span style="font-size:2rem; display:block; margin-bottom:10px;">🚀</span>
          <p style="color:var(--admin-text-muted); font-size:0.95rem;">Aucun marché ou projet en cours.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = state.projects.map(prj => `
      <div class="project-card" id="prj-card-${prj.id}">
        <div class="project-card-header">
          <div>
            <h3>${escapeHtml(prj.titre)}</h3>
            <p class="project-client-name">🏢 ${escapeHtml(prj.client)} • 📞 ${escapeHtml(prj.contact || '')}</p>
          </div>
          <span class="lead-status-badge ${getStatusClass(prj.statut)}">${escapeHtml(prj.statut)}</span>
        </div>

        <div class="project-progress-wrap">
          <div class="project-progress-label">
            <span>Étape : <strong>${escapeHtml(prj.etape || 'Développement')}</strong></span>
            <strong>${prj.progression || 0}%</strong>
          </div>
          <div class="project-progress-bar-bg">
            <div class="project-progress-bar-fill" style="width: ${prj.progression || 0}%;"></div>
          </div>
        </div>

        <div class="project-finance-box">
          <div class="pf-fin-item">
            <span>Montant Marché</span>
            <strong>${formatNumber(prj.marcheMontant)} FCFA</strong>
          </div>
          <div class="pf-fin-item" style="color:#34d399;">
            <span>Encaissé</span>
            <strong>${formatNumber(prj.encaisse)} FCFA</strong>
          </div>
          <div class="pf-fin-item" style="color:#f87171;">
            <span>Reste à Payer</span>
            <strong>${formatNumber(prj.resteAPayer)} FCFA</strong>
          </div>
        </div>

        <div class="project-deliverables-list">
          <strong style="color:var(--admin-text-main); font-size:0.8rem; margin-bottom:2px;">Jalons & Livrables :</strong>
          ${(prj.livrables || []).map((l, lIdx) => `
            <label class="deliverable-item ${l.fait ? 'done' : ''}">
              <input type="checkbox" ${l.fait ? 'checked' : ''} data-toggle-livrable="${prj.id}" data-livrable-index="${lIdx}">
              <span>${escapeHtml(l.nom)}</span>
            </label>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--admin-border); padding-top:12px; margin-top:auto;">
          <span style="font-size:0.75rem; color:var(--admin-text-dim);">Démarré le ${formatDateFr(prj.dateDebut)}</span>
          <button type="button" class="btn-icon-subtle delete" data-delete-project="${prj.id}" title="Supprimer">
            🗑️ Supprimer
          </button>
        </div>
      </div>
    `).join('');

    // Checkbox Livrables
    grid.querySelectorAll('[data-toggle-livrable]').forEach(chk => {
      chk.addEventListener('change', async (e) => {
        const prjId = chk.getAttribute('data-toggle-livrable');
        const lIdx = parseInt(chk.getAttribute('data-livrable-index'));
        const prj = state.projects.find(p => p.id === prjId);
        if (prj && prj.livrables && prj.livrables[lIdx]) {
          prj.livrables[lIdx].fait = e.target.checked;
          
          // Calcul nouvelle progression
          const totalL = prj.livrables.length;
          const dones = prj.livrables.filter(item => item.fait).length;
          prj.progression = Math.round((dones / totalL) * 100);

          try {
            await fetch('/api/admin/project', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(prj)
            });
          } catch(err) {}

          saveToLocalStorage();
          renderProjects();
        }
      });
    });

    grid.querySelectorAll('[data-delete-project]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-project');
        if (confirm('Voulez-vous supprimer ce projet ?')) {
          try {
            await fetch('/api/admin/project', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
          } catch(e) {}
          state.projects = state.projects.filter(p => p.id !== id);
          saveToLocalStorage();
          renderAll();
          showToast('Projet supprimé.');
        }
      });
    });
  }

  // ==========================================================================
  // 8. UTILITAIRES & NOTIFICATIONS TOAST
  // ==========================================================================
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_LOCAL_DATA, JSON.stringify({
        leads: state.leads,
        proformas: state.proformas,
        projects: state.projects
      }));
    } catch(e) {}
  }

  function getStatusClass(statut) {
    switch (statut) {
      case 'Nouveau': return 'status-nouveau';
      case 'Contacté': return 'status-contacte';
      case 'Devis envoyé':
      case 'Envoyée': return 'status-devis';
      case 'Gagné':
      case 'Acceptée':
      case 'Livré': return 'status-gagne';
      case 'En cours':
      case 'Recette': return 'status-contacte';
      default: return 'status-archive';
    }
  }

  function formatNumber(num) {
    if (!num && num !== 0) return '0';
    return Number(num).toLocaleString('fr-FR');
  }

  function formatDateFr(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch(e) {
      return dateStr;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message) {
    const toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3500);
  }

})();
