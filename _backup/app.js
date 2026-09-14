/**
 * AIFORCE AGENCY — Logique applicative sobre et robuste
 * - Traduction bilingue instantanée FR / EN
 * - Accordéon FAQ fluide
 * - Préparation du message WhatsApp direct
 * - Menu mobile
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Moteur de Langues (i18n)
  let currentLang = localStorage.getItem('aiforce_lang') || 'fr';

  const setLanguage = (lang) => {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('aiforce_lang', lang);
    document.documentElement.lang = lang;

    // Titre de l'onglet
    if (translations[lang].meta_title) {
      document.title = translations[lang].meta_title;
    }

    // Éléments textuels
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Placeholders des champs
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // État actif des boutons de langue
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Mise à jour des liens WhatsApp
    updateWhatsAppLinks();
  };

  // Écouteurs sur les boutons FR / EN
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // 2. Liens WhatsApp par défaut
  const phoneE164 = "2290162115411";

  const updateWhatsAppLinks = () => {
    const defaultMsg = currentLang === 'fr'
      ? "Bonjour AIFORCE, je souhaite échanger avec vous sur un projet d'application ou d'automatisation pour mon entreprise."
      : "Hello AIFORCE, I would like to discuss a custom application or automation project for my business.";

    const url = `https://wa.me/${phoneE164}?text=${encodeURIComponent(defaultMsg)}`;

    document.querySelectorAll('.js-wa-link').forEach((link) => {
      link.href = url;
    });
  };

  // Initialisation
  setLanguage(currentLang);

  // 3. Gestion des Onglets du Portfolio (SMART JURIS)
  const portfolioTabs = document.querySelectorAll('.portfolio-tab-btn');
  const portfolioPanels = document.querySelectorAll('.portfolio-panel');

  portfolioTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const screenId = tab.getAttribute('data-screen');

      portfolioTabs.forEach(t => t.classList.remove('active'));
      portfolioPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`portfolio-panel-${screenId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 4. Accordéon FAQ
  const faqEntries = document.querySelectorAll('.faq-entry');
  faqEntries.forEach((entry) => {
    const btn = entry.querySelector('.faq-question-btn');
    const body = entry.querySelector('.faq-body');

    btn.addEventListener('click', () => {
      const isActive = entry.classList.contains('active');

      // Fermer les autres
      faqEntries.forEach((other) => {
        other.classList.remove('active');
        const otherBody = other.querySelector('.faq-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      if (!isActive) {
        entry.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        entry.classList.remove('active');
        body.style.maxHeight = null;
      }
    });
  });

  // 4. Formulaire de contact -> Envoi WhatsApp direct
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const contact = document.getElementById('contact-phone').value.trim();
      const need = document.getElementById('contact-need').value.trim();

      const isFr = currentLang === 'fr';

      let msg = isFr ? `*NOUVEAU PROJET — AIFORCE*\n\n` : `*NEW INQUIRY — AIFORCE*\n\n`;
      msg += isFr ? `👤 *Nom / Entreprise :* ${name}\n` : `👤 *Name / Company:* ${name}\n`;
      msg += isFr ? `📞 *Coordonnées :* ${contact}\n` : `📞 *Contact:* ${contact}\n`;
      msg += isFr ? `📝 *Besoin / Tâche à simplifier :*\n${need}\n` : `📝 *Need / Bottleneck:*\n${need}\n`;
      msg += isFr ? `\n_Envoyé depuis le site vitrine AIFORCE_` : `\n_Sent via AIFORCE website_`;

      const targetUrl = `https://wa.me/${phoneE164}?text=${encodeURIComponent(msg)}`;
      window.open(targetUrl, '_blank');
    });
  }

  // 5. Menu Mobile
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.main-nav');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
});
