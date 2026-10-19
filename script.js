(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuToggle.setAttribute('aria-label', expanded ? 'Open navigation menu' : 'Close navigation menu');
      navLinks.classList.toggle('open', !expanded);
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    }));
  }
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

// Accessible full-screen gallery viewer with keyboard and touch-friendly controls.
(() => {
  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  const lightbox = document.getElementById('galleryLightbox');
  if (!cards.length || !lightbox) return;
  const image = lightbox.querySelector('img');
  const count = lightbox.querySelector('.lightbox-count');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const prevButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let current = 0;
  let previousFocus = null;
  const getImage = index => cards[index].querySelector('img');
  const show = index => {
    current = (index + cards.length) % cards.length;
    const source = getImage(current);
    image.src = source.currentSrc || source.src;
    image.alt = source.alt || 'Graphic design by Martina Pius Minde';
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  };
  const open = index => {
    previousFocus = document.activeElement;
    show(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  };
  cards.forEach((card, index) => {
    const link = card.querySelector('.gallery-image-link');
    link.removeAttribute('target');
    link.addEventListener('click', event => { event.preventDefault(); open(index); });
  });
  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', () => show(current - 1));
  nextButton.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
})();


// Horizontal gallery controls: move one card at a time, without vertical page scrolling.
(() => {
  const gallery = document.getElementById('portfolioGallery');
  const previous = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  if (!gallery || !previous || !next) return;
  const distance = () => {
    const card = gallery.querySelector('.gallery-card');
    if (!card) return gallery.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(gallery).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };
  previous.addEventListener('click', () => gallery.scrollBy({left: -distance(), behavior: 'smooth'}));
  next.addEventListener('click', () => gallery.scrollBy({left: distance(), behavior: 'smooth'}));
})();
