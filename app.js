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

      const zoom = s.querySelector('.slide-zoom-badge span');
      if (zoom) {
        zoom.textContent = isEn ? 'Full screen HD' : 'Plein écran HD';
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

    // Tabs Track
    tabBtns.forEach((tb) => {
      const tbIdx = parseInt(tb.getAttribute('data-slide-index'), 10);
      const isTabActive = tbIdx === currentSlideIndex;
      tb.classList.toggle('active', isTabActive);
      if (isTabActive) {
        tb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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

    // Support Défilement Trackpad horizontal (Mac 2 doigts) & Molette Shift
    let wheelTimer = null;
    let accumulatedDelta = 0;
    viewport.addEventListener('wheel', (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (Math.abs(delta) > 6) {
        if (e.cancelable) e.preventDefault();
        accumulatedDelta += delta;
        if (!wheelTimer) {
          wheelTimer = setTimeout(() => {
            if (accumulatedDelta > 20 && currentSlideIndex < totalSlides - 1) {
              goToSlide(currentSlideIndex + 1);
            } else if (accumulatedDelta < -20 && currentSlideIndex > 0) {
              goToSlide(currentSlideIndex - 1);
            }
            accumulatedDelta = 0;
            wheelTimer = null;
          }, 35);
        }
      }
    }, { passive: false });

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
        if (i === lbIndex) {
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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


  // Initialisation finale : activer la langue enregistrée sur tous les composants
  setLanguage(currentLang);
});