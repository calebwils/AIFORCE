/**
 * AIFORCE AGENCY — Logique applicative sobre et robuste
 * - Traduction bilingue instantanée FR / EN
 * - Accordéon FAQ fluide
 * - Préparation du message WhatsApp direct
 * - Menu mobile
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Moteur de Langues (i18n) — Français par défaut ou mémorisé
  const savedLang = localStorage.getItem('aiforce_lang');
  let currentLang = (savedLang === 'en' || savedLang === 'fr') ? savedLang : 'fr';

  const getHeroTitlesForLang = (lang) => {
    if (typeof translations !== 'undefined' && translations[lang] && Array.isArray(translations[lang].hero_titles)) {
      return translations[lang].hero_titles;
    }
    return [
      "<span class=\"hero-title-line\">Développement d'applications web & mobiles.</span><span class=\"hero-title-line\">Automatisation de vos tâches répétitives avec l'IA.</span>",
      "Optimisation des processus de travail en entreprise avec l'IA."
    ];
  };

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
      if (key === 'hero_title') {
        const titles = getHeroTitlesForLang(lang);
        el.innerHTML = titles[heroTitleIndex % titles.length];
        return;
      }
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

  // 1.1 Rotation dynamique du titre Hero toutes les 6 secondes (coulissant vers le bas)
  const heroHeading = document.querySelector('.hero-heading');
  let heroTitleIndex = 0;
  let heroRotatorTimer = null;

  const updateHeroTitle = (targetIndex) => {
    if (!heroHeading) return;
    const titles = getHeroTitlesForLang(currentLang);
    heroTitleIndex = targetIndex % titles.length;

    // 1. Coulisse vers le bas en disparaissant
    heroHeading.classList.add('hero-slide-down-exit');

    setTimeout(() => {
      // 2. Met à jour le texte et place en haut (sans transition)
      heroHeading.innerHTML = titles[heroTitleIndex];
      heroHeading.classList.remove('hero-slide-down-exit');
      heroHeading.classList.add('hero-slide-down-enter-from-top');

      // 3. Frame suivante : enlève l'état haut pour laisser la transition couler vers le bas
      setTimeout(() => {
        heroHeading.classList.remove('hero-slide-down-enter-from-top');
      }, 50);
    }, 450);
  };

  const startHeroTitleRotation = () => {
    if (heroRotatorTimer) clearInterval(heroRotatorTimer);
    heroRotatorTimer = setInterval(() => {
      updateHeroTitle(heroTitleIndex + 1);
    }, 6000); // Échange toutes les 6 secondes
  };

  if (heroHeading) {
    startHeroTitleRotation();
  }

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

      // Enregistrement automatique dans l'Espace Admin CRM
      try {
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: name,
            entreprise: name,
            contact: contact,
            whatsapp: contact.replace(/[^0-9]/g, ''),
            besoin: need,
            solution: 'Demande via formulaire de contact du site',
            source: 'Formulaire de contact web',
            statut: 'Nouveau'
          })
        }).catch(err => console.warn('Sync lead notice:', err.message));
      } catch (err) {}

      const targetUrl = `https://wa.me/${phoneE164}?text=${encodeURIComponent(msg)}`;
      window.open(targetUrl, '_blank');
    });
  }

  // 5. Menu Mobile & Dropdown Interaction
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.main-nav');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    const dropdownItem = navMenu.querySelector('.nav-item.has-dropdown');
    if (dropdownItem) {
      const dropdownLink = dropdownItem.querySelector('.nav-link-dropdown');
      const dropdownChevron = dropdownItem.querySelector('.dropdown-chevron');

      if (dropdownChevron) {
        dropdownChevron.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            e.stopPropagation();
            dropdownItem.classList.toggle('mobile-open');
          }
        });
      }

      if (dropdownLink) {
        dropdownLink.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024 && !dropdownItem.classList.contains('mobile-open')) {
            e.preventDefault();
            dropdownItem.classList.add('mobile-open');
          }
        });
      }
    }

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (link.classList.contains('nav-link-dropdown') && window.innerWidth <= 1024) {
          return;
        }
        navMenu.classList.remove('open');
        if (dropdownItem) dropdownItem.classList.remove('mobile-open');
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
  // 12. Conseillère Sofia — Accueil Client, Cadrage Express & Transmission
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

    if (!chatModal || !chatMessagesStage) return;

    let conversationHistory = [];
    let currentStep = 1; // 1: Coordonnées, 2: Votre Projet, 3: Prise en charge
    let isProcessing = false;
    let clientContact = {
      nom: '',
      entreprise: '',
      whatsapp: '',
      email: ''
    };

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

    // Update Step Tracker UI (1 -> 2 -> 3)
    const updateStepTracker = (step) => {
      currentStep = Math.min(Math.max(step, 1), 3);
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
      let clean = text.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\/?strong>/gi, '**');
      let escaped = clean
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      escaped = escaped.replace(/`([^`]+)`/g, '<code style="background:rgba(56,189,248,0.15);padding:2px 6px;border-radius:4px;color:#38bdf8;font-size:0.85em;">$1</code>');
      escaped = escaped.replace(/(?:^|\n)[-*•]\s+(.*?)(?=\n|$)/g, '<br>• $1');
      escaped = escaped.replace(/(?:^|\n)(\d+\.)\s+(.*?)(?=\n|$)/g, '<br><strong>$1</strong> $2');
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
        avatar.innerHTML = '<img src="assets/sofia.jpg" alt="Sofia" class="chat-bot-avatar-img">';
        row.appendChild(avatar);
      }

      const contentBox = document.createElement('div');
      contentBox.className = 'chat-msg-content';

      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${role === 'user' ? 'user' : 'bot'}`;
      bubble.innerHTML = formatMessageContent(content);

      contentBox.appendChild(bubble);

      const timeEl = document.createElement('span');
      timeEl.className = 'chat-time';
      timeEl.textContent = time;
      contentBox.appendChild(timeEl);

      row.appendChild(contentBox);
      chatMessagesStage.appendChild(row);
      chatMessagesStage.scrollTop = chatMessagesStage.scrollHeight;

      return row;
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
      avatar.innerHTML = '<img src="assets/sofia.jpg" alt="Sofia" class="chat-bot-avatar-img">';
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

    // Quick Reply Chips
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

    // 1. Étape 1 : Formulaire de Coordonnées Intégré dans le Chat
    const renderContactForm = (parentRow) => {
      const bubble = parentRow.querySelector('.chat-msg-content') || parentRow;
      const form = document.createElement('form');
      form.className = 'sofia-contact-card';
      form.id = 'sofia-contact-form';

      form.innerHTML = `
        <div class="sofia-form-row">
          <label><span class="s-icon">👤</span> ${currentLang === 'en' ? 'Full Name' : 'Nom & Prénom'}</label>
          <input type="text" id="sofia-input-name" placeholder="${currentLang === 'en' ? 'e.g. John Doe' : 'Ex: Jean Dupont'}" required autocomplete="name">
        </div>
        <div class="sofia-form-row">
          <label><span class="s-icon">🏢</span> ${currentLang === 'en' ? 'Company or Industry' : 'Entreprise ou Secteur'}</label>
          <input type="text" id="sofia-input-company" placeholder="${currentLang === 'en' ? 'e.g. Retail / Law firm / Individual' : 'Ex: Cabinet Juridique / Commerce / Particulier'}" required>
        </div>
        <div class="sofia-form-row">
          <label><span class="s-icon">📱</span> ${currentLang === 'en' ? 'WhatsApp Number (with country code)' : 'Numéro WhatsApp (avec indicatif pays)'}</label>
          <input type="tel" id="sofia-input-wa" placeholder="${currentLang === 'en' ? 'e.g. +229 01 62 11 54 / +1...' : 'Ex: +229 01 62 11 54 / +33 6...'}" required autocomplete="tel">
        </div>
        <div class="sofia-form-row">
          <label><span class="s-icon">✉️</span> ${currentLang === 'en' ? 'Email Address' : 'Adresse Email'}</label>
          <input type="email" id="sofia-input-email" placeholder="${currentLang === 'en' ? 'e.g. contact@company.com' : 'Ex: contact@entreprise.com'}" required autocomplete="email">
        </div>
        <button type="submit" class="sofia-btn-validate">
          <span>${currentLang === 'en' ? 'Confirm my details →' : 'Valider mes coordonnées →'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      `;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nom = form.querySelector('#sofia-input-name').value.trim();
        const entreprise = form.querySelector('#sofia-input-company').value.trim();
        const whatsapp = form.querySelector('#sofia-input-wa').value.trim();
        const email = form.querySelector('#sofia-input-email').value.trim();

        if (!nom || !entreprise || !whatsapp || !email) {
          showToast(currentLang === 'en' ? 'Please fill in all fields' : 'Veuillez renseigner tous les champs');
          return;
        }

        clientContact = { nom, entreprise, whatsapp, email };

        // Verrouiller visuellement le formulaire
        form.innerHTML = `
          <div class="sofia-contact-locked">
            <span>✅</span>
            <div><strong>${nom}</strong> — ${entreprise}<br><span style="color:#94a3b8;">${whatsapp} • ${email}</span></div>
          </div>
        `;

        // Afficher bulle de confirmation utilisateur
        const userSummary = `👤 **${nom}** — ${entreprise}\n📱 WhatsApp : ${whatsapp}\n✉️ Email : ${email}`;
        appendMessage('user', userSummary);
        conversationHistory.push({ role: 'user', content: userSummary });

        // Envoi en tâche de fond vers la plateforme de gestion & email de Caleb
        try {
          fetch('/api/send-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ficheOffre: {
                client: `${nom} — ${entreprise}`,
                email_client: email,
                whatsapp_client: whatsapp,
                secteur: entreprise,
                titre: `Nouveau Prospect — ${nom}`,
                besoin_cle: 'Coordonnées validées auprès de Sofia, en cours de description du projet.',
                solution_proposee: 'À qualifier avec Caleb'
              },
              messages: conversationHistory
            })
          }).catch(err => console.warn('Lead background sync notice:', err.message));
        } catch (err) {}

        // Passer à l'étape 2 (Votre Projet)
        updateStepTracker(2);

        // Réponse immédiate et chaleureuse de Sofia
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();

          const firstName = nom.split(' ')[0] || nom;
          const askProjectMsg = currentLang === 'en'
            ? `Pleased to meet you **${firstName}**! Your contact information has been securely recorded. ✅\n\nNow, **please tell me briefly about your project or the workflow you want to automate / develop**.\n\nTo make this effortless and super fast, here are 2 options:\n🎙️ **Voice Shortcut via ChatGPT:** Click the button below to open ChatGPT, speak out loud to dictate your project, ask it for a clean summary, then copy and paste the text right here!\n✍️ **Or write directly:** Simply type your project outline in the chat field below.`
            : `Enchantée **${firstName}** ! Vos coordonnées sont bien enregistrées. ✅\n\nMaintenant, **expliquez-moi simplement votre projet ou le besoin que vous souhaitez automatiser / développer**.\n\nPour vous faire gagner un temps précieux et aller très vite, voici 2 options simples :\n🎙️ **Astuce Vocale via ChatGPT :** Ouvrez ChatGPT ci-dessous, parlez-lui en audio pour lui dicter votre projet, demandez-lui un résumé clair, puis venez copier-coller le texte directement ici !\n✍️ **Ou écrivez directement :** Tapez simplement les grandes lignes de votre besoin dans le champ ci-dessous.`;

          const pRow = appendMessage('assistant', askProjectMsg, getTimeString());
          conversationHistory.push({ role: 'assistant', content: askProjectMsg });
          renderChatGPTHelper(pRow);

          // Tags de suggestion rapide
          const tags = currentLang === 'en'
            ? ['Custom Web Platform', 'Mobile App (iOS/Android)', 'WhatsApp & Invoice Automation', 'Custom AI Assistant']
            : ['Plateforme Web sur mesure', 'Application Mobile iOS / Android', 'Automatisation WhatsApp & Factures', 'Assistant IA Métier'];
          updateQuickReplies(tags);

          // Préparer le champ de saisie
          chatInputText.placeholder = currentLang === 'en'
            ? "Paste your ChatGPT summary or describe your project here..."
            : "Collez votre résumé ChatGPT ou décrivez votre projet ici...";
          chatInputText.focus();
        }, 600);
      });

      bubble.appendChild(form);
      chatMessagesStage.scrollTop = chatMessagesStage.scrollHeight;
    };

    // 2. Bouton d'Aide Dictée Audio ChatGPT
    const renderChatGPTHelper = (parentRow) => {
      const bubble = parentRow.querySelector('.chat-msg-content') || parentRow;
      const helper = document.createElement('div');
      helper.className = 'sofia-chatgpt-helper';
      helper.innerHTML = `
        <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" class="sofia-chatgpt-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 14.5a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm1.5-6.5a2.5 2.5 0 0 0-5 0 1 1 0 0 1-2 0 4.5 4.5 0 1 1 7.23 3.56c-.53.4-.73.68-.73 1.44a1 1 0 0 1-2 0c0-1.42.66-2.11 1.5-2.73A2.5 2.5 0 0 0 14.5 10z"/>
          </svg>
          <span>${currentLang === 'en' ? '🎙️ Open ChatGPT (Voice Dictation) ↗' : '🎙️ Ouvrir ChatGPT (Dictée Vocale) ↗'}</span>
        </a>
        <span class="sofia-helper-hint">${currentLang === 'en' ? '1. Speak on ChatGPT ➔ 2. Copy the summary ➔ 3. Paste it here' : '1. Parlez en audio sur ChatGPT ➔ 2. Copiez le texte résumé ➔ 3. Collez-le ici'}</span>
      `;
      bubble.appendChild(helper);
      chatMessagesStage.scrollTop = chatMessagesStage.scrollHeight;
    };

    // 3. Optionnel : Relais Direct WhatsApp vers Caleb (bouton élégant et non-bloquant)
    const renderDirectContactPill = (parentRow, waUrl) => {
      if (document.querySelector('.sofia-wa-direct-pill')) return;
      const bubble = parentRow.querySelector('.chat-msg-content') || parentRow;
      const pill = document.createElement('div');
      pill.className = 'sofia-wa-direct-pill';
      pill.style.cssText = 'margin-top: 12px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.15);';
      pill.innerHTML = `
        <a href="${waUrl}" target="_blank" class="sofia-wa-direct-btn" style="text-decoration:none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zM12 20.08c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.87 7.87 0 01-1.21-4.22c0-4.34 3.53-7.87 7.88-7.87 2.1 0 4.07.82 5.56 2.31 1.49 1.49 2.31 3.46 2.31 5.56 0 4.34-3.54 7.88-7.88 7.88zm4.31-5.9c-.24-.12-1.4-.69-1.62-.77-.22-.08-.37-.12-.53.12-.16.24-.61.77-.75.93-.14.16-.28.18-.51.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.01-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.42s-.53-1.27-.72-1.74c-.19-.46-.39-.4-.53-.4h-.45c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.45-.28z"/>
          </svg>
          <span>${currentLang === 'en' ? 'Direct WhatsApp with Caleb (Founder) 📲' : 'Échanger directement avec Caleb (Fondateur) sur WhatsApp 📲'}</span>
        </a>
      `;
      bubble.appendChild(pill);
      chatMessagesStage.scrollTop = chatMessagesStage.scrollHeight;
    };

    // Gestion de l'envoi de message conversationnel réel & intelligent
    const handleSendMessage = async (textToSend) => {
      const text = (textToSend || chatInputText.value || '').trim();
      if (!text || isProcessing) return;

      // Si le client n'a pas encore rempli le formulaire de coordonnées
      if (!clientContact.nom || !clientContact.whatsapp) {
        showToast(currentLang === 'en' ? 'Please confirm your contact details first' : 'Veuillez d\'abord valider vos coordonnées dans le formulaire');
        const firstInput = document.querySelector('#sofia-input-name');
        if (firstInput) firstInput.focus();
        return;
      }

      isProcessing = true;
      chatInputText.value = '';
      chatInputText.style.height = 'auto';

      appendMessage('user', text);
      conversationHistory.push({ role: 'user', content: text });
      updateQuickReplies([]); // Masquer les chips pendant le traitement

      showTypingIndicator();

      // Maintien à l'étape 2 (Échange & Diagnostic)
      updateStepTracker(2);

      try {
        // Appel en direct de l'IA Qwen via notre API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory,
            client: clientContact,
            lang: currentLang
          })
        });

        const data = await response.json();
        hideTypingIndicator();

        if (response.ok && data.reply) {
          const assistantReply = data.reply;
          conversationHistory.push({ role: 'assistant', content: assistantReply });
          const replyRow = appendMessage('assistant', assistantReply, getTimeString());

          // Mise à jour des options dynamiques proposées par Sofia
          if (Array.isArray(data.options) && data.options.length > 0) {
            updateQuickReplies(data.options);
          } else {
            updateQuickReplies([]);
          }

          // Préparation du lien WhatsApp direct vers Caleb au cas où
          const waMsgLines = [
            `*ÉCHANGE AIFORCE — SOFIA (IA)*`,
            `*Client :* ${clientContact.nom}`,
            clientContact.entreprise ? `*Entreprise :* ${clientContact.entreprise}` : '',
            `*WhatsApp :* ${clientContact.whatsapp}`,
            `*Email :* ${clientContact.email}`,
            ``,
            `*Dernier point abordé :*`,
            text,
            ``,
            `Bonjour Caleb, j'échange avec Sofia sur le site AIFORCE et je souhaite faire le point directement avec vous.`
          ].filter(Boolean).join('\n');
          const waUrl = `https://wa.me/2290162115411?text=${encodeURIComponent(waMsgLines)}`;

          // Afficher le bouton WhatsApp si au moins 2 questions/réponses ont eu lieu
          const userMessagesCount = conversationHistory.filter(m => m.role === 'user').length;
          if (userMessagesCount >= 2) {
            updateStepTracker(3);
            renderDirectContactPill(replyRow, waUrl);
          }

          // Synchronisation discrète de la conversation vers le CRM
          fetch('/api/send-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ficheOffre: {
                client: `${clientContact.nom} — ${clientContact.entreprise}`,
                email_client: clientContact.email,
                whatsapp_client: clientContact.whatsapp,
                secteur: clientContact.entreprise,
                titre: `Échange en direct avec ${clientContact.nom}`,
                besoin_cle: text,
                solution_proposee: 'Conseil & cadrage en direct avec Sofia'
              },
              messages: conversationHistory
            })
          }).catch(err => console.warn('Lead dispatch notice:', err.message));

        } else {
          throw new Error(data.error || 'Erreur API');
        }

      } catch (err) {
        console.warn('Chat API error:', err);
        hideTypingIndicator();

        const firstName = clientContact.nom.split(' ')[0] || clientContact.nom;
        const fallbackMsg = currentLang === 'en'
          ? `Thank you **${firstName}** for these details! I am noting down your points regarding "${text}".\n\nTo ensure our technical engineers provide the best architecture for your project, would you prefer an initial review via WhatsApp or a direct email reply?`
          : `C'est bien noté **${firstName}** ! Je prends note de votre point concernant « ${text} ».\n\nPour que notre équipe d'ingénieurs et Caleb puissent calibrer la meilleure solution technique, préférez-vous que nous fassions un point rapide directement par WhatsApp ou par email ?`;

        conversationHistory.push({ role: 'assistant', content: fallbackMsg });
        appendMessage('assistant', fallbackMsg, getTimeString());
        updateQuickReplies(currentLang === 'en' ? ['WhatsApp message', 'Email follow-up', 'Phone call'] : ['Par WhatsApp', 'Par email', 'Par appel téléphonique']);
      } finally {
        isProcessing = false;
        if (chatInputText) chatInputText.focus();
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
      clientContact = { nom: '', entreprise: '', whatsapp: '', email: '' };
      chatMessagesStage.innerHTML = '';
      updateStepTracker(1);

      const welcomeMsg = translations[currentLang]?.chat_welcome_msg ||
        "Bonjour et bienvenue chez AIFORCE ! Je suis **Sofia**, votre conseillère de projet. 👋\n\nPour que **Caleb et notre équipe technique** puissent étudier précisément votre demande et vous recontacter très rapidement, veuillez simplement renseigner vos coordonnées ci-dessous :";

      const firstRow = appendMessage('assistant', welcomeMsg, getTimeString());
      renderContactForm(firstRow);
      updateQuickReplies([]);
    };

    if (chatResetBtn) {
      chatResetBtn.addEventListener('click', () => {
        resetChat();
      });
    }

    // Redimensionnement Manuel Extensible (Top-Left Handle)
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

      if (chatMessagesStage.children.length === 0) {
        resetChat();
      }
    };

    // Close Modal
    const closeChat = () => {
      chatModal.classList.remove('active');
      chatModal.setAttribute('aria-hidden', 'true');
    };

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', closeChat);
    }

    // Close on overlay backdrop click
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

    // Expose openChat globally
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
  initAIChatbot();

  // Initialisation finale : activer la langue enregistrée sur tous les composants
  setLanguage(currentLang);
});