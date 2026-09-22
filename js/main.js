document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const body = document.body;

  /* Header scroll state */
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav */
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => body.classList.remove('nav-open'));
    });
  }

  /* Dynamic parallax layers */
  const parallaxLayers = document.querySelectorAll('[data-speed]');
  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    parallaxLayers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed);
      const offset = layer.closest('section');
      const rect = offset ? offset.getBoundingClientRect() : { top: 0 };
      const localY = y - (offset ? offset.offsetTop : 0);
      layer.style.transform = `translate3d(0, ${localY * speed}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* Active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Contact forms */
  document.querySelectorAll('form[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim()) valid = false;
        if (field.type === 'email' && field.value && !/^\S+@\S+\.\S+$/.test(field.value)) valid = false;
      });

      if (!status) return;
      status.classList.remove('ok', 'err');
      if (!valid) {
        status.textContent = 'Por favor complete los campos requeridos con un formato válido.';
        status.classList.add('show', 'err');
        return;
      }
      status.textContent = 'Gracias por contactarnos. Su mensaje ha sido recibido y le responderemos a la brevedad.';
      status.classList.add('show', 'ok');
      form.reset();
    });
  });
});
