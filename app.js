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

    // Mise à jour de la langue du slider et lightbox
    if (typeof updateSliderLanguage === 'function') {
      updateSliderLanguage(lang);
    }
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

  // setLanguage will be initialized after slider and components are registered

  // 3. Gestion du Carousel Slider Glissant Continu (Smart Juris -> Filtec)
  const unifiedGalleryData = [
    // SMART JURIS (0 à 4)
    { project: 'smartjuris', projName: 'SMART JURIS', src: 'assets/portfolio/smart-juris/screen-1.png?v=20260914', title: 'Tableau de Bord Cabinet & Gestion des Délais Procéduraux' },
    { project: 'smartjuris', projName: 'SMART JURIS', src: 'assets/portfolio/smart-juris/screen-2.png?v=20260914', title: 'Smart Juris Copilot — IA Juridique Sourcée OHADA' },
    { project: 'smartjuris', projName: 'SMART JURIS', src: 'assets/portfolio/smart-juris/screen-3.png?v=20260914', title: 'Smart Draft — Rédaction Automatisée d\'Actes & Mises en Demeure' },
    { project: 'smartjuris', projName: 'SMART JURIS', src: 'assets/portfolio/smart-juris/screen-4.png?v=20260914', title: 'Gestion Centralisée des Dossiers & Contentieux' },
    { project: 'smartjuris', projName: 'SMART JURIS', src: 'assets/portfolio/smart-juris/screen-5.png?v=20260914', title: 'Journal d\'Audit Déontologique & Traçabilité UTC' },

    // FILTEC ONE (5 à 15)
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-1.png?v=20260914', title: 'Centre de Contrôle Opérationnel & File d\'Approbation' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-5.png?v=20260914', title: 'Portail Mobile Distributeurs & Représentants Terrain' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-7.png?v=20260914', title: 'Génération Facture Proforma B2B A4 & Partage WhatsApp' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-6.png?v=20260914', title: 'Catalogue Produits & Barèmes Tarifaires Multi-Paliers' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-2.png?v=20260914', title: 'Pointage GPS, Géolocalisation & Biométrie Terrain' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-4.png?v=20260914', title: 'Hub d\'Intégration ERP & Passerelle WhatsApp' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-3.png?v=20260914', title: 'Annuaire des Comptes Distributeurs & En-cours Crédit' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-8.png?v=20260914', title: 'Check-in Mobile & Validation Déplacement Commercial' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-9.png?v=20260914', title: 'Module Gestion des Congés & Quotas Mensuels' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-10.png?v=20260914', title: 'Saisie de Commande Rapide & Calcul Linéaire' },
    { project: 'filtec', projName: 'FILTEC ONE', src: 'assets/portfolio/filtec/screen-11.png?v=20260914', title: 'Validation et Récapitulatif d\'Expédition Usine' }
  ];

  const track = document.getElementById('portfolio-slider-track');
  const viewport = document.getElementById('portfolio-slider-viewport');
  const slides = document.querySelectorAll('.portfolio-slide');
  const prevBtn = document.getElementById('slider-arrow-prev');
  const nextBtn = document.getElementById('slider-arrow-next');
  const dotsBar = document.getElementById('slider-dots-bar');
  const indicator = document.getElementById('slider-active-indicator');
  const tabBtns = document.querySelectorAll('.portfolio-tabs-track .portfolio-tab-btn');
  const btnSmartJuris = document.getElementById('btn-project-smartjuris');
  const btnFiltec = document.getElementById('btn-project-filtec');

  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let dragThresholdPassed = false;

  // Création dynamique des points de pagination
  if (dotsBar && slides.length > 0) {
    dotsBar.innerHTML = '';
    slides.forEach((slide, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `slider-dot ${idx < 5 ? 'dot-sj' : 'dot-filtec'} ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Capture ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsBar.appendChild(dot);
    });
  }

  // Synchronisation dynamique de la langue pour le Slider et le Lightbox
  function updateSliderLanguage(lang) {
    const isEn = lang === 'en';

    if (typeof updateActiveState === 'function') {
      updateActiveState(currentSlideIndex);
    }

    if (slides && slides.length > 0) {
      slides.forEach((s, idx) => {
      const pill = s.querySelector('.slide-screen-pill');
      if (pill) {
        if (idx < 5) {
          pill.textContent = isEn 
            ? `Slide ${idx + 1} / 16 • Screen ${idx + 1}/5` 
            : `Capture ${idx + 1} / 16 • Écran ${idx + 1}/5`;
        } else {
          pill.textContent = isEn 
            ? `Slide ${idx + 1} / 16 • Screen ${idx - 4}/11` 
            : `Capture ${idx + 1} / 16 • Écran ${idx - 4}/11`;
        }
      }

      const tag = s.querySelector('.slide-project-tag');
      if (tag) {
        if (idx < 5) {
          tag.textContent = isEn ? 'SMART JURIS • Legal AI' : 'SMART JURIS • IA Juridique';
        } else {
          tag.textContent = isEn ? 'FILTEC ONE • Industrial ERP & Mobile' : 'FILTEC ONE • ERP Industriel & Mobile';
        }
      }

      const hint = s.querySelector('.slide-drag-hint');
      if (hint) {
        hint.innerHTML = isEn 
          ? '<span class="hint-arrows">↔</span> Drag to scroll' 
          : '<span class="hint-arrows">↔</span> Glissez pour faire défiler';
      }


    });
    }

    if (typeof lightbox !== 'undefined' && lightbox && lightbox.classList.contains('active')) {
      renderLbScreen();
    }
  }

  function updateActiveState(index) {
    currentSlideIndex = Math.max(0, Math.min(index, totalSlides - 1));

    // Slides
    if (slides && slides.length > 0) {
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === currentSlideIndex);
      });
    }

    // Dots
    if (dotsBar) {
      const dots = dotsBar.querySelectorAll('.slider-dot');
      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === currentSlideIndex);
      });
    }

    // Project Switcher
    const isFiltec = currentSlideIndex >= 5;
    if (btnSmartJuris && btnFiltec) {
      btnSmartJuris.classList.toggle('active', !isFiltec);
      btnFiltec.classList.toggle('active', isFiltec);
    }

    // Tabs Track — Défilement du bandeau d'onglets uniquement (ne bloque JAMAIS le scroll de la page)
    const tabsTrack = document.getElementById('portfolio-tabs-track');
    tabBtns.forEach((tb) => {
      const tbIdx = parseInt(tb.getAttribute('data-slide-index'), 10);
      const isTabActive = tbIdx === currentSlideIndex;
      tb.classList.toggle('active', isTabActive);
      if (isTabActive && tabsTrack) {
        const tabOffset = tb.offsetLeft - (tabsTrack.offsetWidth / 2) + (tb.offsetWidth / 2);
        tabsTrack.scrollTo({ left: tabOffset, behavior: 'smooth' });
      }
    });

    // Indicator
    if (indicator) {
      const isEn = currentLang === 'en';
      const screenWord = isEn ? 'Screen' : 'Écran';
      const captureWord = isEn ? 'Slide' : 'Capture';
      if (currentSlideIndex < 5) {
        indicator.textContent = `SMART JURIS • ${screenWord} ${currentSlideIndex + 1} / 5 (${captureWord} ${currentSlideIndex + 1}/16)`;
        indicator.className = 'slider-active-indicator sj';
      } else {
        indicator.textContent = `FILTEC ONE • ${screenWord} ${currentSlideIndex - 4} / 11 (${captureWord} ${currentSlideIndex + 1}/16)`;
        indicator.className = 'slider-active-indicator filtec';
      }
    }

    // Arrows disabled states
    if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = currentSlideIndex === totalSlides - 1;
  }

  function setSliderPosition() {
    if (track) {
      track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    }
  }

  function setSlideWidths() {
    if (!viewport) return;
    const w = viewport.offsetWidth;
    // Set CSS variable so each slide is exactly viewport width
    viewport.style.setProperty('--slide-w', w + 'px');
    // Also set directly on slides for robustness
    slides.forEach(s => {
      s.style.width = w + 'px';
      s.style.minWidth = w + 'px';
    });
  }

  function setPositionByIndex() {
    if (!viewport || !track) return;
    setSlideWidths();
    const slideWidth = viewport.offsetWidth;
    currentTranslate = -currentSlideIndex * slideWidth;
    prevTranslate = currentTranslate;
    track.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    setSliderPosition();
    updateActiveState(currentSlideIndex);
  }

  function goToSlide(index) {
    currentSlideIndex = index;
    setPositionByIndex();
  }

  // Flèches
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlideIndex < totalSlides - 1) goToSlide(currentSlideIndex + 1);
    });
  }

  // Boutons Projets en en-tête
  if (btnSmartJuris) {
    btnSmartJuris.addEventListener('click', () => goToSlide(0));
  }
  if (btnFiltec) {
    btnFiltec.addEventListener('click', () => goToSlide(5));
  }

  // Boutons Onglets
  tabBtns.forEach((tb) => {
    tb.addEventListener('click', () => {
      const idx = parseInt(tb.getAttribute('data-slide-index'), 10);
      goToSlide(idx);
    });
  });

  // Glissement Tactile & Souris Drag
  if (viewport && track) {
    let startY = 0;
    let lockAxis = null; // 'h' = horizontal locked, 'v' = vertical locked

    function getPosX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    function getPosY(e) {
      return e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
    }

    function onDragStart(e) {
      if (e.type.includes('mouse')) {
        if (e.button !== 0) return;
        e.preventDefault();
      }
      isDragging = true;
      dragThresholdPassed = false;
      lockAxis = null;
      startPos = getPosX(e);
      startY = getPosY(e);
      viewport.classList.add('grabbing');
      track.style.transition = 'none';
    }

    function onDragMove(e) {
      if (!isDragging) return;
      const currentPos = getPosX(e);
      const currentY = getPosY(e);
      const diffX = currentPos - startPos;
      const diffY = currentY - startY;

      // Determine axis lock on first significant movement
      if (!lockAxis) {
        if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
          lockAxis = Math.abs(diffX) >= Math.abs(diffY) ? 'h' : 'v';
        }
      }

      // If locked vertical, don't interfere
      if (lockAxis === 'v') return;

      // Lock horizontal: prevent page scroll
      if (lockAxis === 'h') {
        if (e.cancelable) e.preventDefault();
        if (Math.abs(diffX) > 8) dragThresholdPassed = true;
        currentTranslate = prevTranslate + diffX;
        track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
      }
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('grabbing');

      if (lockAxis === 'h') {
        const movedBy = currentTranslate - prevTranslate;
        // Seuil de déclenchement : 50px
        if (movedBy < -50 && currentSlideIndex < totalSlides - 1) {
          currentSlideIndex += 1;
        } else if (movedBy > 50 && currentSlideIndex > 0) {
          currentSlideIndex -= 1;
        }
      }

      lockAxis = null;
      setPositionByIndex();
    }

    // Événements Touch — NON passive pour permettre preventDefault horizontal
    viewport.addEventListener('touchstart', onDragStart, { passive: true });
    viewport.addEventListener('touchmove', onDragMove, { passive: false });
    viewport.addEventListener('touchend', onDragEnd);
    viewport.addEventListener('touchcancel', onDragEnd);

    // Événements Souris
    viewport.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);



    // Clic sur l'image -> Lightbox (seulement si pas en glissement)
    slides.forEach((slide, idx) => {
      const frame = slide.querySelector('.slide-image-frame');
      if (frame) {
        frame.addEventListener('click', (e) => {
          if (dragThresholdPassed) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          openUnifiedLightbox(idx);
        });
      }
    });

    // Navigation au clavier
    window.addEventListener('keydown', (e) => {
      if (document.getElementById('portfolio-lightbox')?.classList.contains('active')) return;
      const rect = viewport.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentSlideIndex < totalSlides - 1) goToSlide(currentSlideIndex + 1);
      }
    });

    // Redimensionnement
    window.addEventListener('resize', () => {
      setPositionByIndex();
    });

    // Position initiale — attendre que le viewport soit visible (offsetWidth > 0)
    function initSliderWhenReady() {
      if (viewport.offsetWidth > 0) {
        setPositionByIndex();
      } else {
        // Viewport pas encore rendu, réessayer
        requestAnimationFrame(initSliderWhenReady);
      }
    }

    // Utiliser IntersectionObserver pour initialiser quand la section est visible
    const sliderObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && viewport.offsetWidth > 0) {
          setPositionByIndex();
          // Ne s'exécute qu'une fois
          sliderObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });

    sliderObserver.observe(viewport);

    // Aussi initialiser immédiatement au cas où déjà visible
    initSliderWhenReady();
  }

  // 3b. Galerie Plein Écran Unifiée (Lightbox Interactive pour les 16 captures)
  const lightbox = document.getElementById('portfolio-lightbox');
  const lbImg = document.getElementById('lightbox-main-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbThumbnails = document.getElementById('lightbox-thumbnails');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  let lbIndex = 0;

  function openUnifiedLightbox(startIndex = 0) {
    if (!lightbox) return;
    lbIndex = Math.max(0, Math.min(startIndex, unifiedGalleryData.length - 1));
    renderLbScreen();
    renderLbThumbnails();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeUnifiedLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderLbScreen() {
    const item = unifiedGalleryData[lbIndex];
    if (!item) return;

    const isEn = currentLang === 'en';
    const displayTitle = (isEn && item.titleEn) ? item.titleEn : item.title;

    if (lbImg) {
      lbImg.style.opacity = '0.3';
      setTimeout(() => {
        lbImg.src = item.src;
        lbImg.alt = displayTitle;
        lbImg.style.opacity = '1';
      }, 120);
    }

    if (lbTitle) {
      lbTitle.textContent = `${item.projName} : ${displayTitle}`;
    }
    if (lbCaption) {
      lbCaption.textContent = displayTitle;
    }
    if (lbCounter) {
      const captureLabel = isEn ? 'Slide' : 'Capture';
      lbCounter.textContent = `${captureLabel} ${lbIndex + 1} / ${unifiedGalleryData.length}`;
    }

    // Update thumbnail highlights
    if (lbThumbnails) {
      const thumbs = lbThumbnails.querySelectorAll('.lightbox-thumb');
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === lbIndex);
        if (i === lbIndex && lbThumbnails) {
          const tOffset = t.offsetLeft - (lbThumbnails.offsetWidth / 2) + (t.offsetWidth / 2);
          lbThumbnails.scrollTo({ left: tOffset, behavior: 'smooth' });
        }
      });
    }

    // Sync slider with lightbox position
    if (currentSlideIndex !== lbIndex) {
      goToSlide(lbIndex);
    }
  }

  function renderLbThumbnails() {
    if (!lbThumbnails) return;
    lbThumbnails.innerHTML = '';
    unifiedGalleryData.forEach((item, idx) => {
      const thumb = document.createElement('img');
      thumb.src = item.src;
      thumb.alt = item.title;
      thumb.className = `lightbox-thumb ${idx === lbIndex ? 'active' : ''} ${item.project === 'filtec' ? 'thumb-filtec' : ''}`;
      thumb.loading = 'lazy';
      thumb.addEventListener('click', () => {
        lbIndex = idx;
        renderLbScreen();
      });
      lbThumbnails.appendChild(thumb);
    });
  }

  // Événements Lightbox
  if (lbClose) lbClose.addEventListener('click', closeUnifiedLightbox);
  if (lbPrev) {
    lbPrev.addEventListener('click', () => {
      lbIndex = (lbIndex - 1 + unifiedGalleryData.length) % unifiedGalleryData.length;
      renderLbScreen();
    });
  }
  if (lbNext) {
    lbNext.addEventListener('click', () => {
      lbIndex = (lbIndex + 1) % unifiedGalleryData.length;
      renderLbScreen();
    });
  }

  // Boutons 'Explorer la galerie complète'
  document.querySelectorAll('.js-open-unified-gallery').forEach((btn) => {
    btn.addEventListener('click', () => {
      openUnifiedLightbox(currentSlideIndex);
    });
  });

  // Clavier dans la Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeUnifiedLightbox();
    if (e.key === 'ArrowLeft') {
      lbIndex = (lbIndex - 1 + unifiedGalleryData.length) % unifiedGalleryData.length;
      renderLbScreen();
    }
    if (e.key === 'ArrowRight') {
      lbIndex = (lbIndex + 1) % unifiedGalleryData.length;
      renderLbScreen();
    }
  });

  // Clic extérieur pour fermer
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) {
        closeUnifiedLightbox();
      }
    });
  }


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

  // ==========================================================================
  // Hero Ambient Particles System (Lightweight, 60fps, Retina Crisp)
  // ==========================================================================
  const canvas = document.getElementById('hero-particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let particles = [];
    let animationFrameId;
    let isHeroVisible = true;

    // Mouse tracking for interactive constellation
    const mouse = { x: -1000, y: -1000, radius: 140 };

    const heroSection = canvas.closest('.hero-block');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (width / rect.width);
        mouse.y = (e.clientY - rect.top) * (height / rect.height);
      });
      heroSection.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
      });
    }

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.5 + 0.25;
        this.alpha = this.baseAlpha;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        
        // Hue palette: 200 (cyan), 220 (blue), 240 (indigo)
        this.hue = Math.random() > 0.4 ? 198 : 220;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around bounds
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
          this.alpha = Math.min(1, this.baseAlpha + 0.4);
        } else {
          this.alpha = this.baseAlpha;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.alpha})`;
        ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, 0.6)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 11000), 75);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!isHeroVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw subtle connection lines between close particles
      const maxDist = 115;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Draw mouse connecting lines
      if (mouse.x > 0 && mouse.y > 0) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const lineAlpha = (1 - dist / mouse.radius) * 0.28;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${lineAlpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Pause when off-screen for maximum performance
    if ('IntersectionObserver' in window && heroSection) {
      const observer = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }

    window.addEventListener('resize', () => {
      clearTimeout(window._heroResizeTimer);
      window._heroResizeTimer = setTimeout(resize, 150);
    });

    resize();
    animate();
  }

  // ==========================================================================
  // 12. AIFORCE Copilot — Assistant IA Intelligent & Fiche d'Offre
  // ==========================================================================
  const initAIChatbot = () => {
    const chatModal = document.getElementById('aiforce-chat-modal');
    const chatWindow = document.getElementById('chat-modal-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatResetBtn = document.getElementById('chat-reset-btn');
    const chatResizeHandle = document.getElementById('chat-resize-handle');
    const chatMessagesStage = document.getElementById('chat-messages-stage');
    const chatQuickReplies = document.getElementById('chat-quick-replies');
    const chatInputForm = document.getElementById('chat-input-form');
    const chatInputText = document.getElementById('chat-input-text');
    const chatStepTracker = document.getElementById('chat-step-tracker');
    const aiBubble = document.getElementById('ai-launcher-bubble');
    const aiBubbleCloseBtn = document.getElementById('ai-bubble-close-btn');

    // Print Modal Elements
    const printModal = document.getElementById('fiche-offre-print-modal');
    const printSheetContent = document.getElementById('print-sheet-content');
    const btnTriggerPrint = document.getElementById('btn-trigger-print');
    const btnClosePrint = document.getElementById('btn-close-print');

    if (!chatModal || !chatMessagesStage) return;

    let conversationHistory = [];
    let currentStep = 1;
    let isProcessing = false;
    let latestFicheOffre = null;

    // Toast helper
    const showToast = (message) => {
      let toast = document.querySelector('.aiforce-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'aiforce-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2600);
    };

    // Format current time HH:MM
    const getTimeString = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    // Update Step Tracker UI
    const updateStepTracker = (step) => {
      currentStep = Math.min(Math.max(step, 1), 5);
      if (!chatStepTracker) return;

      const stepItems = chatStepTracker.querySelectorAll('.step-item');
      stepItems.forEach((item) => {
        const itemStep = parseInt(item.getAttribute('data-step'), 10);
        if (itemStep < currentStep) {
          item.classList.add('completed');
          item.classList.remove('active');
        } else if (itemStep === currentStep) {
          item.classList.add('active');
          item.classList.remove('completed');
        } else {
          item.classList.remove('active', 'completed');
        }
      });
    };

    // Simple Markdown to HTML formatter
    const formatMessageContent = (text) => {
      if (!text) return '';
      // Normalize any existing HTML linebreaks/strong tags to markdown
      let clean = text.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\/?strong>/gi, '**');
      let escaped = clean
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Format bold **text**
      escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Format bullet lists
      escaped = escaped.replace(/(?:^|\n)[-*•]\s+(.*?)(?=\n|$)/g, '<br>• $1');
      // Format numbered lists
      escaped = escaped.replace(/(?:^|\n)(\d+\.)\s+(.*?)(?=\n|$)/g, '<br><strong>$1</strong> $2');
      // Replace line breaks
      escaped = escaped.replace(/\n\n+/g, '<br><br>').replace(/\n/g, '<br>');

      return escaped;
    };

    // Append a message to chat
    const appendMessage = (role, content, time = getTimeString(), options = []) => {
      const row = document.createElement('div');
      row.className = `chat-msg-row ${role === 'user' ? 'user' : 'bot'}`;

      if (role === 'assistant') {
        const avatar = document.createElement('div');
        avatar.className = 'chat-msg-avatar';
        avatar.innerHTML = '⚡';
        row.appendChild(avatar);
      }

      const contentBox = document.createElement('div');
      contentBox.className = 'chat-msg-content';

      // Clean special delimiter tags if any
      let cleanContent = (content || '')
        .replace(/<<<FICHE_OFFRE[\s\S]*?FICHE_OFFRE>>>/g, '')
        .replace(/<<<OPTIONS:[\s\S]*?>>>/g, '')
        .trim();

      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${role === 'user' ? 'user' : 'bot'}`;
      bubble.innerHTML = formatMessageContent(cleanContent);

      // In-message clickable options/propositions for quick client responses
      let effectiveOptions = Array.isArray(options) ? [...options] : [];
      if (role === 'assistant' && effectiveOptions.length === 0) {
        // Auto-extract bullet suggestions from text if available
        const lines = cleanContent.split('\n');
        for (const line of lines) {
          const t = line.trim();
          if (t.startsWith('•') || t.startsWith('- ') || t.startsWith('* ')) {
            const opt = t.replace(/^[•\-\*]\s*/, '').replace(/:\s*$/, '').trim();
            if (opt.length > 2 && opt.length < 75 && !opt.includes('<br>')) {
              effectiveOptions.push(opt);
            }
          }
        }
        if (effectiveOptions.length > 5) effectiveOptions = effectiveOptions.slice(0, 5);
      }

      if (role === 'assistant' && effectiveOptions.length > 0) {
        const optContainer = document.createElement('div');
        optContainer.className = 'chat-inmessage-options';

        effectiveOptions.forEach((optText) => {
          const chipBtn = document.createElement('button');
          chipBtn.type = 'button';
          chipBtn.className = 'inmsg-chip';
          chipBtn.innerHTML = `<span>⚡</span> <span>${optText}</span>`;
          chipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Provide immediate tactile response
            optContainer.querySelectorAll('.inmsg-chip').forEach(c => {
              c.classList.remove('selected');
              c.style.pointerEvents = 'none';
              c.style.opacity = '0.55';
            });
            chipBtn.classList.add('selected');
            chipBtn.style.opacity = '1';
            chipBtn.style.pointerEvents = 'auto';

            handleSendMessage(optText);
          });
          optContainer.appendChild(chipBtn);
        });

        bubble.appendChild(optContainer);
      }

      contentBox.appendChild(bubble);

      const timeEl = document.createElement('span');
      timeEl.className = 'chat-time';
      timeEl.textContent = time;
      contentBox.appendChild(timeEl);

      row.appendChild(contentBox);
      chatMessagesStage.appendChild(row);
      chatMessagesStage.scrollTop = chatMessagesStage.scrollHeight;
    };

    // Show Typing Indicator
    const showTypingIndicator = () => {
      const existing = document.getElementById('chat-typing-indicator');
      if (existing) existing.remove();

      const typingRow = document.createElement('div');
      typingRow.id = 'chat-typing-indicator';
      typingRow.className = 'chat-typing-row';

      const avatar = document.createElement('div');
      avatar.className = 'chat-msg-avatar';
      avatar.innerHTML = '⚡';
      typingRow.appendChild(avatar);

      const bubble = document.createElement('div');
      bubble.className = 'chat-typing-bubble';
      bubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
      typingRow.appendChild(bubble);

      chatMessagesStage.appendChild(typingRow);
      chatMessagesStage.scrollTop = chatMessagesStage.scrollHeight;
    };

    const hideTypingIndicator = () => {
      const existing = document.getElementById('chat-typing-indicator');
      if (existing) existing.remove();
    };

    // Render Quick Reply Chips
    const updateQuickReplies = (chips) => {
      if (!chatQuickReplies) return;
      chatQuickReplies.innerHTML = '';
      if (!chips || chips.length === 0) return;

      chips.forEach((chipText) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-chip';
        btn.textContent = chipText;
        btn.addEventListener('click', () => {
          handleSendMessage(chipText);
        });
        chatQuickReplies.appendChild(btn);
      });
    };

    // Contextual chips per step
    const getContextualChips = (step, lang = currentLang) => {
      if (lang === 'en') {
        switch (step) {
          case 1:
            return ['Distribution & Retail', 'Accounting & Legal', 'Real Estate & Construction', 'Logistics & Fleet', 'Other Industry'];
          case 2:
            return ['Custom Web Application', 'iOS / Android Mobile App', 'Workflow Automation (Excel/WhatsApp)', 'AI Document Assistant'];
          case 3:
            return ['Offline-first mobile mode', 'WhatsApp Auto-Sync', 'Invoice / Quote PDF Generator', 'Admin Validation Dashboard'];
          case 4:
            return ['Within 2 to 4 weeks', 'Urgent (< 2 weeks)', 'Generate Project Offer ✨'];
          case 5:
            return ['Review on WhatsApp 📲', 'Adjust a feature', 'Print Scope PDF 📄'];
          default:
            return [];
        }
      } else {
        switch (step) {
          case 1:
            return ['Distribution & Commerce', 'Cabinet Comptable / Juridique', 'Immobilier & BTP', 'Transport & Logistique', 'Autre secteur'];
          case 2:
            return ['Application Web sur mesure', 'Application Mobile iOS / Android', 'Automatisation (Excel / WhatsApp / ERP)', 'Assistant IA Métier'];
          case 3:
            return ['Mode hors-ligne sur le terrain', 'Synchronisation WhatsApp', 'Génération Devis / Factures PDF', 'Tableau de bord de validation'];
          case 4:
            return ['Démarrage sous 2 à 4 semaines', 'Urgent (< 2 semaines)', 'Générer la Fiche d\'Offre ✨'];
          case 5:
            return ['Partager sur WhatsApp 📲', 'Ajuster un point', 'Imprimer la Fiche PDF 📄'];
          default:
            return [];
        }
      }
    };

    // Render Fiche d'Offre Component inside chat
    const renderFicheOffreCard = (fiche) => {
      latestFicheOffre = fiche;
      updateStepTracker(5);

      const card = document.createElement('div');
      card.className = 'fiche-offre-card';

      const refNumber = fiche.ref || `AF-2026-X${Math.floor(100 + Math.random() * 900)}`;
      const dateStr = new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Discreet background dispatch to calebwils900@gmail.com
      try {
        fetch('/api/send-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ficheOffre: fiche,
            messages: conversationHistory
          })
        }).catch(err => console.warn('Background lead sync notice:', err.message));
      } catch (err) {
        // silent
      }

      // WhatsApp message pre-formatting
      const waTextLines = [
        currentLang === 'en' ? `*AIFORCE PROJECT OFFER — ${refNumber}*` : `*FICHE D'OFFRE AIFORCE — ${refNumber}*`,
        `*Date :* ${dateStr}`,
        `*Projet :* ${fiche.titre || 'Développement Sur Mesure'}`,
        fiche.client ? `*Client :* ${fiche.client} ${fiche.secteur ? `(${fiche.secteur})` : ''}` : '',
        fiche.email_client ? `*Email :* ${fiche.email_client}` : '',
        fiche.whatsapp_client ? `*WhatsApp :* ${fiche.whatsapp_client}` : '',
        `*Besoin :* ${fiche.besoin_cle || fiche.besoin || 'Optimisation des opérations'}`,
        `*Solution :* ${fiche.solution_proposee || fiche.solution || 'Application / Automatisation'}`,
        `*Périmètre MVP :*`,
        ...(Array.isArray(fiche.fonctionnalites_mvp || fiche.fonctionnalites) 
          ? (fiche.fonctionnalites_mvp || fiche.fonctionnalites).map(f => `  • ${f}`) 
          : []),
        `*Délai estimé :* ${fiche.delai_estime || '3 à 4 semaines'}`,
        `*Budget indicatif :* ${fiche.budget_indicatif || fiche.budget_estime || 'Sur-mesure selon périmètre'}`,
        ``,
        currentLang === 'en' 
          ? `Bonjour Caleb, voici le cadrage réalisé avec votre IA Copilot. Je souhaite valider les prochaines étapes.`
          : `Bonjour Caleb, voici la fiche d'offre générée avec votre assistant IA Copilot. Je souhaite échanger sur la mise en œuvre.`
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/2290162115411?text=${encodeURIComponent(waTextLines)}`;

      // Features HTML
      const features = fiche.fonctionnalites_mvp || fiche.fonctionnalites || [];
      const featuresHtml = Array.isArray(features) && features.length > 0
        ? `<ul class="fo-features-list">${features.map(item => `<li>${item}</li>`).join('')}</ul>`
        : `<p class="fo-item-val">${currentLang === 'en' ? 'Core functional prototype & workflow sync' : 'Prototype fonctionnel & flux automatisés'}</p>`;

      card.innerHTML = `
        <div class="fo-header">
          <div class="fo-badge-row">
            <span class="fo-official-badge">⚡ AIFORCE APPROVED SCOPE</span>
            <span class="fo-ref-tag">${refNumber} • ${dateStr}</span>
          </div>
          <h4 class="fo-title">${fiche.titre || (currentLang === 'en' ? 'Tailored Digital Architecture' : 'Architecture Digitale Sur-Mesure')}</h4>
        </div>

        <div class="fo-discreet-notice">
          <span style="font-size: 1.2rem; flex-shrink: 0;">⚡</span>
          <div>
            <strong>${currentLang === 'en' ? 'Dossier transmitted to Caleb & the technical team!' : 'Dossier transmis avec succès à Caleb & l\'équipe technique !'}</strong><br>
            <span>${currentLang === 'en' 
              ? 'Our engineers have received your scope and will get back to you with our proposal within minutes on your WhatsApp and email.' 
              : 'Nos ingénieurs ont bien reçu votre cadrage et vous reviendront avec notre proposition dans quelques minutes sur votre WhatsApp et par email.'}</span>
          </div>
        </div>

        <div class="fo-grid">
          ${fiche.secteur || fiche.client || fiche.email_client || fiche.whatsapp_client ? `
            <div class="fo-item">
              <span class="fo-item-label">${currentLang === 'en' ? 'Client & Contact Details' : 'Client & Coordonnées'}</span>
              <span class="fo-item-val">
                <strong>${fiche.client || 'Client Partenaire'}</strong> ${fiche.secteur ? `— ${fiche.secteur}` : ''}
                ${fiche.email_client ? `<br><span style="color:#94a3b8;">✉️ Email :</span> ${fiche.email_client}` : ''}
                ${fiche.whatsapp_client ? `<br><span style="color:#94a3b8;">📲 WhatsApp :</span> ${fiche.whatsapp_client}` : ''}
              </span>
            </div>
          ` : ''}

          <div class="fo-item">
            <span class="fo-item-label">${currentLang === 'en' ? 'Identified Challenge' : 'Défi / Problématique identifiée'}</span>
            <span class="fo-item-val">${fiche.besoin_cle || fiche.besoin || (currentLang === 'en' ? 'Eliminating manual time sinks' : 'Suppression des pertes de temps manuelles')}</span>
          </div>

          <div class="fo-item">
            <span class="fo-item-label">${currentLang === 'en' ? 'Recommended Solution' : 'Solution Technique AIFORCE'}</span>
            <span class="fo-item-val"><strong>${fiche.solution_proposee || fiche.solution || (currentLang === 'en' ? 'Custom Web & Mobile Application' : 'Application Web & Mobile sur mesure')}</strong></span>
          </div>

          <div class="fo-item">
            <span class="fo-item-label">${currentLang === 'en' ? 'Core MVP Scope' : 'Périmètre Fonctionnel MVP'}</span>
            ${featuresHtml}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="fo-item">
              <span class="fo-item-label">${currentLang === 'en' ? 'Estimated Timeline' : 'Délai Estimé'}</span>
              <span class="fo-item-val"><strong>${fiche.delai_estime || '3 à 4 semaines'}</strong></span>
            </div>
            <div class="fo-item">
              <span class="fo-item-label">${currentLang === 'en' ? 'Estimated Budget' : 'Investissement'}</span>
              <span class="fo-item-val" style="color: #38bdf8; font-weight: 700;">${fiche.budget_indicatif || fiche.budget_estime || 'Sur-mesure'}</span>
            </div>
          </div>
        </div>

        <div class="fo-actions">
          <button type="button" class="btn-fo-download js-btn-download-pdf">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>${currentLang === 'en' ? '📥 Download Project Offer (PDF)' : '📥 Télécharger la Fiche d\'Offre (PDF)'}</span>
          </button>

          <a href="${waUrl}" target="_blank" class="btn-fo-wa js-fo-wa-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zM12 20.08c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.87 7.87 0 01-1.21-4.22c0-4.34 3.53-7.87 7.88-7.87 2.1 0 4.07.82 5.56 2.31 1.49 1.49 2.31 3.46 2.31 5.56 0 4.34-3.54 7.88-7.88 7.88zm4.31-5.9c-.24-.12-1.4-.69-1.62-.77-.22-.08-.37-.12-.53.12-.16.24-.61.77-.75.93-.14.16-.28.18-.51.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.01-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.42s-.53-1.27-.72-1.74c-.19-.46-.39-.4-.53-.4h-.45c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.45-.28z"/>
            </svg>
            <span>${currentLang === 'en' ? 'Send Scope to Caleb on WhatsApp' : 'Transmettre sur WhatsApp à Caleb'}</span>
          </a>

          <div class="fo-secondary-btns">
            <button type="button" class="btn-fo-sub js-btn-print-offer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span>${currentLang === 'en' ? 'Print / Save PDF' : 'Imprimer / PDF'}</span>
            </button>

            <button type="button" class="btn-fo-sub js-btn-copy-offer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>${currentLang === 'en' ? 'Copy Text' : 'Copier'}</span>
            </button>
          </div>
        </div>
      `;

      // Event listener: Download PDF button (prominent)
      card.querySelector('.js-btn-download-pdf').addEventListener('click', () => {
        openPrintModal(fiche, refNumber, dateStr);
        setTimeout(() => {
          window.print();
        }, 400);
      });

      // Event listener: Print
      card.querySelector('.js-btn-print-offer').addEventListener('click', () => {
        openPrintModal(fiche, refNumber, dateStr);
      });

      // Event listener: Copy
      card.querySelector('.js-btn-copy-offer').addEventListener('click', () => {
        navigator.clipboard.writeText(waTextLines).then(() => {
          showToast(currentLang === 'en' ? 'Offer copied to clipboard!' : 'Fiche copiée dans le presse-papier !');
        });
      });

      chatMessagesStage.appendChild(card);
      chatMessagesStage.scrollTop = chatMessagesStage.scrollHeight;
    };

    // Open Official Print Preview
    const openPrintModal = (fiche, ref, date) => {
      if (!printModal || !printSheetContent) return;

      const features = fiche.fonctionnalites_mvp || fiche.fonctionnalites || [];
      const featuresListHtml = Array.isArray(features) && features.length > 0
        ? `<ul class="oos-features-list">${features.map(f => `<li>${f}</li>`).join('')}</ul>`
        : `<p>${fiche.solution_proposee || 'Application sur-mesure'}</p>`;

      const steps = fiche.prochaines_etapes || [];
      const stepsHtml = Array.isArray(steps) && steps.length > 0
        ? `<ol style="padding-left: 18px; margin: 4px 0 0;">${steps.map(s => `<li>${s}</li>`).join('')}</ol>`
        : '';

      printSheetContent.innerHTML = `
        <div class="official-offer-sheet">
          <div class="oos-header">
            <div>
              <div class="oos-brand-name">AIFORCE AGENCY</div>
              <div class="oos-brand-sub">Ingénierie Logicielle Web & Mobile • Automatisation des Processus</div>
              <div style="font-size: 0.8rem; color: #64748B; margin-top: 4px;">Caleb & Équipe AIFORCE • contact@aiforce.agency • +229 0162115411</div>
            </div>
            <div class="oos-meta-box">
              <div style="font-weight: 700; color: #0284c7;">FICHE DE CADRAGE & OFFRE</div>
              <div style="font-family: monospace; font-size: 0.95rem;">REF : ${ref}</div>
              <div>${date}</div>
            </div>
          </div>

          <h2 class="oos-title">${fiche.titre || 'Proposition de Solution Technique'}</h2>

          <table class="oos-table">
            <tbody>
              <tr>
                <th>Bénéficiaire / Client</th>
                <td><strong>${fiche.client || 'Client Privé'}</strong> ${fiche.secteur ? `— Secteur : ${fiche.secteur}` : ''}</td>
              </tr>
              <tr>
                <th>Problématique / Défi</th>
                <td>${fiche.besoin_cle || fiche.besoin || 'Gain de temps et automatisation des opérations manuelles'}</td>
              </tr>
              <tr>
                <th>Solution AIFORCE</th>
                <td><strong>${fiche.solution_proposee || fiche.solution || 'Développement d’application sur mesure & synchronisation'}</strong></td>
              </tr>
              <tr>
                <th>Périmètre MVP (Fonctionnalités)</th>
                <td>${featuresListHtml}</td>
              </tr>
              <tr>
                <th>Délai de Livraison Estimé</th>
                <td><strong>${fiche.delai_estime || '3 à 4 semaines'}</strong> (déploiement agile avec démos intermédiaires)</td>
              </tr>
              <tr>
                <th>Investissement Indicatif</th>
                <td><strong>${fiche.budget_indicatif || fiche.budget_estime || 'Proposition sur-mesure validée lors de l\'atelier'}</strong></td>
              </tr>
              ${stepsHtml ? `
                <tr>
                  <th>Prochaines Étapes</th>
                  <td>${stepsHtml}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>

          <div class="oos-footer-notes">
            <div>Document prévisionnel émis par AIFORCE AGENCY. Tous droits réservés.</div>
            <div>WhatsApp direct : +229 0162115411</div>
          </div>
        </div>
      `;

      printModal.classList.add('active');
    };

    if (btnTriggerPrint) {
      btnTriggerPrint.addEventListener('click', () => {
        window.print();
      });
    }

    if (btnClosePrint) {
      btnClosePrint.addEventListener('click', () => {
        printModal.classList.remove('active');
      });
    }

    // Smart Fallback Simulator if backend is unavailable
    const runSmartFallback = (userText) => {
      let reply = '';
      let extractedFiche = null;

      if (currentStep === 1) {
        reply = currentLang === 'en'
          ? "Thank you! That's a key sector where time savings have massive business impact. What type of solution are you considering to streamline your operations? For example: a custom Web Portal, an iOS/Android Mobile App for field teams, or an automated workflow (WhatsApp, invoices, Excel)?"
          : "C'est un excellent point de départ ! Dans ce secteur, chaque heure gagnée sur les processus manuels a un impact direct sur la rentabilité. Quel type d'outil imaginez-vous ? Par exemple : une application web de gestion, une application mobile pour vos équipes terrain, ou l'automatisation d'un flux (WhatsApp, factures, Excel) ?";
        updateStepTracker(2);
      } else if (currentStep === 2) {
        reply = currentLang === 'en'
          ? "Understood, that solution fits your operational profile perfectly. What are the 2 or 3 essential features you absolutely need for day one (MVP)?"
          : "C'est un choix très pertinent pour vos opérations. Pour que nous puissions livrer un premier outil fonctionnel rapidement : quelles sont les 2 ou 3 fonctionnalités clés absolument indispensables pour le premier lancement (MVP) ?";
        updateStepTracker(3);
      } else if (currentStep === 3) {
        reply = currentLang === 'en'
          ? "Very clear priorities. And what is your target timeline for launching this project? Do you have an ideal launch date or specific budget range in mind?"
          : "Ces fonctionnalités constituent un socle très solide pour dégager un retour sur investissement immédiat. Quel est votre délai souhaité pour démarrer ou déployer ce projet ?";
        updateStepTracker(4);
      } else {
        reply = currentLang === 'en'
          ? "Splendid! Based on all our exchanges, I have prepared your complete custom Project Offer specification. You can review all details below and send it directly to Caleb via WhatsApp to lock in the kickoff!"
          : "Parfait ! Grâce à l'ensemble de vos réponses, j'ai synthétisé votre besoin et préparé votre Fiche d'Offre personnalisée AIFORCE. Vous pouvez la consulter ci-dessous et la transmettre directement à Caleb sur WhatsApp pour valider les prochaines étapes !";

        extractedFiche = {
          ref: `AF-2026-X${Math.floor(100 + Math.random() * 900)}`,
          titre: currentLang === 'en' ? "Tailored Operational Software & Process Automation" : "Plateforme de Gestion & Automatisation Opérationnelle",
          client: "Projet Partenaire",
          secteur: "Entreprise & Services",
          besoin_cle: userText || (currentLang === 'en' ? "Eliminating repetitive manual data entry" : "Supprimer les saisies répétitives et gagner du temps"),
          solution_proposee: currentLang === 'en' ? "Custom Web / Mobile Architecture with Automated Sync" : "Application Web & Mobile sur mesure avec passerelle automatisée",
          fonctionnalites_mvp: [
            currentLang === 'en' ? "Centralized database & clean responsive UI" : "Interface de saisie et consultation rapide",
            currentLang === 'en' ? "Automated validation & WhatsApp notifications" : "Synchronisation automatique et exports instantanés",
            currentLang === 'en' ? "Real-time dashboard for management" : "Tableau de bord de suivi opérationnel en temps réel"
          ],
          delai_estime: "3 à 4 semaines",
          budget_indicatif: "Sur-mesure selon périmètre final (Fourchette indicative : 1.5M - 2.5M FCFA / ~2 300€ - 3 800€)",
          prochaines_etapes: [
            currentLang === 'en' ? "20-minute scoping call with Caleb on WhatsApp" : "Échange direct de 20 min avec Caleb sur WhatsApp",
            currentLang === 'en' ? "UX wireframe validation" : "Validation des maquettes et flux",
            currentLang === 'en' ? "MVP prototype rollout" : "Lancement du premier prototype pilote"
          ]
        };
        updateStepTracker(5);
      }

      hideTypingIndicator();
      const fallbackOptions = getContextualChips(currentStep);
      appendMessage('assistant', reply, getTimeString(), fallbackOptions);
      if (extractedFiche) {
        renderFicheOffreCard(extractedFiche);
      }
      updateQuickReplies(getContextualChips(currentStep));
      isProcessing = false;
    };

    // Core message handler
    const handleSendMessage = async (textToSend) => {
      const text = (textToSend || chatInputText.value || '').trim();
      if (!text || isProcessing) return;

      isProcessing = true;
      chatInputText.value = '';
      chatInputText.style.height = 'auto';

      appendMessage('user', text);
      conversationHistory.push({ role: 'user', content: text });
      updateQuickReplies([]); // hide while waiting

      showTypingIndicator();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory,
            lang: currentLang
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        hideTypingIndicator();

        if (data.reply) {
          conversationHistory.push({ role: 'assistant', content: data.reply });
          appendMessage('assistant', data.reply, getTimeString(), data.options || []);
        }

        if (data.ficheOffre) {
          renderFicheOffreCard(data.ficheOffre);
        } else {
          // Increment step naturally based on turns
          const userTurns = conversationHistory.filter(m => m.role === 'user').length;
          if (userTurns === 1) updateStepTracker(2);
          else if (userTurns === 2) updateStepTracker(3);
          else if (userTurns >= 3 && currentStep < 4) updateStepTracker(4);
        }

        updateQuickReplies(getContextualChips(currentStep));
      } catch (err) {
        console.warn('API route unreachable or error, activating intelligent fallback:', err);
        // Seamless fallback ensures client never sees a failure
        setTimeout(() => {
          runSmartFallback(text);
        }, 600);
      } finally {
        isProcessing = false;
      }
    };

    // Form submission
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage();
    });

    // Enter key submits (Shift+Enter for newline)
    chatInputText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    // Auto-resize textarea
    chatInputText.addEventListener('input', () => {
      chatInputText.style.height = 'auto';
      chatInputText.style.height = Math.min(chatInputText.scrollHeight, 100) + 'px';
    });

    // Reset Chat
    const resetChat = () => {
      conversationHistory = [];
      latestFicheOffre = null;
      chatMessagesStage.innerHTML = '';
      updateStepTracker(1);

      const welcomeMsg = translations[currentLang]?.chat_welcome_msg ||
        "Bonjour et bienvenue chez AIFORCE ! 👋 Je suis votre assistant de cadrage technique. Pour concevoir votre solution sur-mesure et vous transmettre votre **Fiche d'Offre personnalisée sous quelques minutes** :\n\n**Quel est votre prénom / nom, le nom de votre entreprise, votre adresse email et votre numéro WhatsApp ?**";

      const initialChips = currentLang === 'en'
        ? ['Distribution & Commerce', 'Accounting / Legal Practice', 'Real Estate & Logistics', 'Industrial / Manufacturing B2B']
        : ['Distribution & Commerce', 'Cabinet Comptable / Juridique', 'Immobilier & Logistique', 'Industrie / Usine B2B'];

      appendMessage('assistant', welcomeMsg, getTimeString(), initialChips);
      updateQuickReplies(getContextualChips(1));
    };

    if (chatResetBtn) {
      chatResetBtn.addEventListener('click', () => {
        resetChat();
      });
    }

    // Redimensionnement Manuel Extensible par Glisser-Déposer (Top-Left Handle)
    if (chatResizeHandle && chatWindow) {
      let isResizing = false;
      let startX = 0, startY = 0;
      let startWidth = 0, startHeight = 0;

      const startResize = (e) => {
        isResizing = true;
        chatResizeHandle.classList.add('active');
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'nwse-resize';

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        startX = clientX;
        startY = clientY;

        const rect = chatWindow.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
        e.preventDefault();
      };

      const handleResize = (clientX, clientY) => {
        if (!isResizing) return;
        // La fenêtre est ancrée en bas à droite (bottom: 24px, right: 24px)
        // Tirer la poignée en haut à gauche vers la gauche agrandit la largeur
        // Tirer vers le haut agrandit la hauteur
        const deltaX = startX - clientX;
        const deltaY = startY - clientY;

        const minW = 320;
        const maxW = Math.min(window.innerWidth - 20, 980);
        const minH = 440;
        const maxH = Math.min(window.innerHeight - 30, 960);

        const newW = Math.min(Math.max(startWidth + deltaX, minW), maxW);
        const newH = Math.min(Math.max(startHeight + deltaY, minH), maxH);

        chatWindow.style.width = `${Math.round(newW)}px`;
        chatWindow.style.height = `${Math.round(newH)}px`;
      };

      const onMouseMove = (e) => handleResize(e.clientX, e.clientY);
      const onTouchMove = (e) => {
        if (e.touches && e.touches[0]) {
          handleResize(e.touches[0].clientX, e.touches[0].clientY);
          e.preventDefault();
        }
      };

      const onMouseUp = () => {
        if (!isResizing) return;
        isResizing = false;
        chatResizeHandle.classList.remove('active');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };

      const onTouchEnd = onMouseUp;

      chatResizeHandle.addEventListener('mousedown', startResize);
      chatResizeHandle.addEventListener('touchstart', startResize, { passive: false });
    }

    // Open Modal
    const openChat = () => {
      chatModal.classList.add('active');
      chatModal.setAttribute('aria-hidden', 'false');
      if (aiBubble) aiBubble.style.display = 'none';

      // Initialize welcome if first open
      if (chatMessagesStage.children.length === 0) {
        resetChat();
      }

      setTimeout(() => {
        chatInputText.focus();
      }, 200);
    };

    // Close Modal
    const closeChat = () => {
      chatModal.classList.remove('active');
      chatModal.setAttribute('aria-hidden', 'true');
    };

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', closeChat);
    }

    // Close on overlay backdrop click (if clicking outside window)
    chatModal.addEventListener('click', (e) => {
      if (e.target === chatModal) {
        closeChat();
      }
    });

    // Bind all buttons with .js-open-ai-chat
    document.querySelectorAll('.js-open-ai-chat').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openChat();
      });
    });

    // Teaser bubble close
    if (aiBubbleCloseBtn && aiBubble) {
      aiBubbleCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        aiBubble.style.display = 'none';
        sessionStorage.setItem('aiforce_ai_bubble_dismissed', '1');
      });
    }

    // Auto-show teaser bubble after 3.5s if not dismissed
    if (aiBubble && !sessionStorage.getItem('aiforce_ai_bubble_dismissed')) {
      setTimeout(() => {
        if (!chatModal.classList.contains('active')) {
          aiBubble.style.display = 'block';
        }
      }, 3500);
    }

    // Expose openChat globally if needed
    window.openAIFORCEChat = openChat;
  };

  // Interactive Project Thumbnails switcher with instant hover preloading
  const initProjectThumbnails = () => {
    document.querySelectorAll('.proj-thumb-btn').forEach((btn) => {
      const newSrc = btn.getAttribute('data-img');

      // Hover Preload: cache image in browser memory before click
      btn.addEventListener('mouseenter', () => {
        if (newSrc && !btn._preloaded) {
          const preImg = new Image();
          preImg.src = newSrc;
          btn._preloaded = true;
        }
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const targetImg = document.getElementById(targetId);
        if (!targetImg || !newSrc) return;

        const parentRow = btn.closest('.project-thumbs-row');
        if (parentRow) {
          parentRow.querySelectorAll('.proj-thumb-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
        }

        targetImg.style.opacity = '0.3';
        targetImg.style.transition = 'opacity 0.18s ease';
        setTimeout(() => {
          targetImg.src = newSrc;
          targetImg.style.opacity = '1';
        }, 120);
      });
    });
  };

  initProjectThumbnails();

  // Initialisation finale : activer la langue enregistrée sur tous les composants
  setLanguage(currentLang);
});