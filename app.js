/**
 * Blissful Bumps Prenatal Yoga - Landing Page Logic
 * Features premium animations, interactive components, slider, tabs, map guide, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 0. PAGE LOADER SPLASH SCREEN ---
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    const hideLoader = () => {
      if (!pageLoader.classList.contains('loader-hidden')) {
        pageLoader.classList.add('loader-hidden');
        setTimeout(() => {
          pageLoader.style.display = 'none';
        }, 800);
      }
    };

    // Wait until full window load + subtle delay for smooth reveal
    window.addEventListener('load', () => {
      setTimeout(hideLoader, 600);
    });

    // Fallback in case load takes longer or is cached
    setTimeout(hideLoader, 2500);
  }
  const header = document.getElementById('main-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once at load

  // --- 2. MOBILE NAVIGATION ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  const openMobileNav = () => {
    mobileToggle.classList.add('open');
    navLinks.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close menu when clicking the overlay
  navOverlay.addEventListener('click', closeMobileNav);

  // Close menu when clicking a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // --- 2.5 HERO IMAGE SLIDER ---
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dots = heroSlider.querySelectorAll('.hero-slider-dots .dot');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    let currentSlide = 0;
    let slideInterval = null;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    };

    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      slideInterval = setInterval(nextSlide, 4500);
    };

    const stopAutoPlay = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(index) && index !== currentSlide) {
          showSlide(index);
          startAutoPlay();
        }
      });
    });

    // Pause on hover
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoPlay();
    }, { passive: true });

    startAutoPlay();
  }

  // --- 3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animates once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // --- 4. CLASS PANELS TABS SYSTEM ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const classPanels = document.querySelectorAll('.class-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      // Update Tab Button States
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update Tab Panel States
      classPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // --- 5. INTERACTIVE BENEFIT GUIDE (BODY MAP HOTSPOTS) ---
  const hotspots = document.querySelectorAll('.map-hotspot');
  const infoCards = document.querySelectorAll('.guide-info-card');

  hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      const benefitKey = spot.getAttribute('data-benefit');
      
      // Update Hotspot Trigger States
      hotspots.forEach(s => s.classList.remove('active'));
      spot.classList.add('active');
      
      // Update Info Cards display
      infoCards.forEach(card => {
        if (card.id === `benefit-${benefitKey}`) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });
  });

  // --- 6. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQ items first
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-body').style.maxHeight = null;
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        item.classList.remove('open');
        body.style.maxHeight = null;
      }
    });
  });

  // --- 8. INTERACTIVE BOOKING MODAL ---
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openTriggers = document.querySelectorAll('.open-modal-trigger');
  const bookingForm = document.getElementById('actual-booking-form');

  // Open modal triggers
  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      modal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scroll
  };

  closeBtn.addEventListener('click', closeModal);

  // Close modal when clicking on overlay background
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // --- 9. WHATSAPP BOOKING ---
  // Booking form opens WhatsApp chat with details pre-filled
  const WHATSAPP_NUMBER = '917337326686';

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('booking-name').value;
    const email = document.getElementById('booking-email').value;
    const phone = document.getElementById('booking-phone').value;
    const stage = document.getElementById('booking-trimester').value;

    const message =
      `Namaste! I want to book a prenatal yoga session.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Stage: ${stage}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    closeModal();
    bookingForm.reset();

    showSuccessToast(`Namaste, ${name}! WhatsApp is opening with your booking details. Just press send to confirm.`);
  });

  // Custom Toast Notification System
  function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = 'var(--primary-sage)';
    toast.style.color = '#fff';
    toast.style.padding = '1.25rem 2rem';
    toast.style.borderRadius = 'var(--border-radius-md)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.zIndex = '3000';
    toast.style.fontFamily = 'var(--font-sans)';
    toast.style.fontSize = '0.95rem';
    toast.style.maxWidth = '380px';
    toast.style.lineHeight = '1.5';
    toast.style.borderLeft = '6px solid var(--accent-terracotta)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

    toast.innerText = message;
    document.body.appendChild(toast);

    // Slide and fade in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 100);

    // Fade out and remove after 6.5s
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 6500);
  }

  // --- 10. FLOATING FLOWERS IN HERO BACKGROUND ---
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const flowerLayer = document.createElement('div');
    flowerLayer.className = 'hero-flowers';
    flowerLayer.setAttribute('aria-hidden', 'true');
    heroSection.appendChild(flowerLayer);

    const totalFlowers = window.innerWidth <= 768 ? 4 : 16;
    for (let i = 0; i < totalFlowers; i++) {
      const flower = document.createElement('span');
      flower.className = 'petal';
      flower.textContent = '🌸';
      flower.style.left = Math.random() * 100 + '%';
      flower.style.fontSize = `${Math.round(12 + Math.random() * 14)}px`;
      const duration = 11 + Math.random() * 9;
      flower.style.animationDuration = `${duration}s`;
      flower.style.animationDelay = `${-(Math.random() * duration)}s`;
      flowerLayer.appendChild(flower);
    }
  }

  // --- 11. ROLLER COASTER FLOWER TRACK (scroll-driven) ---
  const mainEl = document.querySelector('main');
  if (mainEl) {
    // Track layer + dashed curve
    const trackLayer = document.createElement('div');
    trackLayer.className = 'flower-track';
    trackLayer.setAttribute('aria-hidden', 'true');

    const svgNS = 'http://www.w3.org/2000/svg';
    const trackSvg = document.createElementNS(svgNS, 'svg');
    const trackPath = document.createElementNS(svgNS, 'path');
    trackPath.setAttribute('class', 'track-line');
    trackSvg.appendChild(trackPath);
    trackLayer.appendChild(trackSvg);
    mainEl.appendChild(trackLayer);

    // Flower at the track end — the butterfly rests on it
    const restFlower = document.createElement('img');
    restFlower.src = 'assets/flowerbutter.png';
    restFlower.alt = '';
    restFlower.className = 'rest-flower';
    trackLayer.appendChild(restFlower);

    // Branch at the track start — where the butterfly takes off from
    const startBranch = document.createElement('img');
    startBranch.src = 'assets/branchrotated.png';
    startBranch.alt = '';
    startBranch.className = 'start-branch';
    trackLayer.appendChild(startBranch);

    // A single butterfly gliding down the track as you scroll
    // (size is controlled by CSS so it adapts on mobile)
    const riders = [
      { offset: 0, opacity: 1 }
    ].map(cfg => {
      const el = document.createElement('img');
      el.src = 'assets/butterfly.png';
      el.alt = '';
      el.className = 'rider-flower';
      el.style.opacity = cfg.opacity;
      trackLayer.appendChild(el);
      return { ...cfg, el };
    });

    const buildTrack = () => {
      const w = mainEl.clientWidth;
      const h = mainEl.scrollHeight;
      const heroH = heroSection ? heroSection.offsetHeight : 400;

      trackSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      trackSvg.setAttribute('width', w);
      trackSvg.setAttribute('height', h);

      // Wavy S-curves from just below hero.
      // The flower is centered ON the footer's top border:
      // half sits on the page, half overlaps the footer.
      const restSize = window.innerWidth <= 768 ? 300 : 550;
      const halfW = restSize / 2;
      trackStartY = heroH + 50;

      // Use the flower's CSS-pinned position as the stable track endpoint.
      // Walk offsetParent chain to get the flower's absolute position inside mainEl —
      // this is scroll-independent, unlike getBoundingClientRect().
      let flowerOffsetX = 0;
      let flowerOffsetY = 0;
      let node = restFlower;
      while (node && node !== mainEl) {
        flowerOffsetX += node.offsetLeft;
        flowerOffsetY += node.offsetTop;
        node = node.offsetParent;
      }
      const flowerW = restFlower.offsetWidth;
      const flowerH = restFlower.offsetHeight;
      // Land at the horizontal centre of the flower, vertically ~35% down from top
      const landX = flowerOffsetX + flowerW / 2;
      trackEndY = flowerOffsetY + flowerH * 0.35;

      const startY = trackStartY;
      const endY = trackEndY;
      const segs = Math.max(4, Math.round(Math.abs(endY - startY) / 420));
      const stepY = (endY - startY) / segs;

      let d = `M ${w * 0.12} ${startY}`;
      let prevX = w * 0.12;
      for (let i = 1; i <= segs; i++) {
        const targetX = i === segs ? landX : (i % 2 === 0 ? w * 0.15 : w * 0.85);
        const y = startY + stepY * i;
        d += ` C ${prevX} ${y - stepY * 0.55}, ${targetX} ${y - stepY * 0.45}, ${targetX} ${y}`;
        prevX = targetX;
      }
      trackPath.setAttribute('d', d);
      pathLength = trackPath.getTotalLength();

      // The rest-flower is pinned via CSS (bottom / right) so its position
      // is stable across every page load.  We only read its centre here so
      // the track path can land exactly on it.

      // Place the branch at the screen's left edge, level with the start
      const startPt = trackPath.getPointAtLength(0);
      startBranch.style.left = '0px';
      startBranch.style.top = startPt.y + 'px';

      // Forget old positions so facing/tilt recompute cleanly after resize
      riders.forEach(r => { r.prev = null; });
    };

    let pathLength = 0;
    let trackStartY = 0;
    let trackEndY = 0;

    const updateRiders = () => {
      const rect = mainEl.getBoundingClientRect();

      // Butterfly rides at ~55% of screen height: it only starts moving once
      // its track point is actually on screen, and parks at the footer end.
      const anchor = window.innerHeight * 0.55;
      const startYDoc = rect.top + trackStartY;
      const endYDoc = rect.top + trackEndY;
      const span = endYDoc - startYDoc;
      let p = span > 0 ? (anchor - startYDoc) / span : 0;
      p = Math.min(1, Math.max(0, p));

      // Scroll direction: when scrolling back up, the butterfly flies the
      // track in reverse, so it must face the opposite way.
      riders.forEach(r => {
        const rp = p > r.offset ? p - r.offset : 0;
        const pt = trackPath.getPointAtLength(pathLength * rp);

        // Face + tilt follow the REAL movement between frames, so the
        // butterfly always flies head-first, also when scrolling back up.
        if (r.prev) {
          const dx = pt.x - r.prev.x;
          const dy = pt.y - r.prev.y;
          if (Math.abs(dx) > 0.4) {
            r.facing = dx > 0 ? 'scaleX(1)' : 'scaleX(-1)';
          }
          const pitch = Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI;
          r.pitch = Math.max(-38, Math.min(38, pitch));
        }
        r.prev = { x: pt.x, y: pt.y };

        r.el.style.transform =
          `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%) ${r.facing || 'scaleX(1)'} rotate(${r.pitch || 0}deg)`;
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateRiders();
          ticking = false;
        });
      }
    };

    const rebuild = () => {
      buildTrack();
      updateRiders();
    };

    rebuild();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', rebuild);

    // Rebuild once every image/font has loaded — page height changes while
    // loading, which used to leave the flower at a random position.
    window.addEventListener('load', rebuild);

    // Rebuild whenever the page height changes afterwards
    // (images loading late, FAQ accordion opening, etc.)
    if (window.ResizeObserver) {
      let pending = false;
      const ro = new ResizeObserver(() => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          rebuild();
          pending = false;
        });
      });
      ro.observe(mainEl);
    }
  }

});
