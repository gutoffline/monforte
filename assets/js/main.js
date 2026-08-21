// MONFORTE — Menu mobile
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    function closeMenu() {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 991) closeMenu();
    });
  }

  var playBtn = document.getElementById('playVideoBtn');
  var modal = document.getElementById('videoModal');
  var modalContent = document.getElementById('videoModalContent');

  if (playBtn && modal && modalContent) {
    function getEmbedUrl(url) {
      var ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
      if (ytMatch) return 'https://www.youtube.com/embed/' + ytMatch[1] + '?autoplay=1&rel=0';

      var vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) return 'https://player.vimeo.com/video/' + vimeoMatch[1] + '?autoplay=1';

      return null;
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalContent.innerHTML = '';
    }

    playBtn.addEventListener('click', function () {
      var src = playBtn.getAttribute('data-video-src');
      var embedUrl = src && getEmbedUrl(src);

      if (!src) {
        modalContent.innerHTML = '<p class="video-modal-empty">Vídeo em breve. Para ativar, adicione a URL do YouTube, Vimeo ou .mp4 no atributo <code>data-video-src</code> do botão de play.</p>';
      } else if (embedUrl) {
        modalContent.innerHTML = '<iframe src="' + embedUrl + '" title="Vídeo institucional Monforte" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      } else {
        modalContent.innerHTML = '<video src="' + src + '" controls autoplay playsinline></video>';
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    modal.querySelectorAll('[data-close]').forEach(function (element) {
      element.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  var contactForm = document.getElementById('contactForm');
  var contactStatus = document.getElementById('contactStatus');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      contactStatus.textContent = 'Mensagem recebida. Em breve entraremos em contato.';
      contactForm.reset();
    });
  }

  var machinesListToggle = document.getElementById('machinesListToggle');
  var machinesListPanel = document.getElementById('machinesListPanel');
  if (machinesListToggle && machinesListPanel) {
    machinesListToggle.addEventListener('click', function () {
      var isExpanded = machinesListToggle.getAttribute('aria-expanded') === 'true';
      machinesListToggle.setAttribute('aria-expanded', String(!isExpanded));
      machinesListPanel.hidden = isExpanded;
    });
  }
});

(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroMedia = document.getElementById('heroMedia');
  var hero = document.getElementById('hero');
  if (!heroMedia || !hero || prefersReduced) return;

  var ticking = false;
  function updateParallax() {
    var scrolled = window.scrollY || window.pageYOffset;
    if (scrolled <= hero.offsetHeight) {
      heroMedia.style.transform = 'translate3d(0,' + (scrolled * 0.32) + 'px,0)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();

(function () {
  var items = document.querySelectorAll('.reveal-onscroll');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (element) { element.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(function (element) { observer.observe(element); });
})();