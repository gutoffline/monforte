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

  var contactForm = document.getElementById('contactForm');
  var contactStatus = document.getElementById('contactStatus');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var submitButton = contactForm.querySelector('.contact-submit');
      var originalButtonText = submitButton ? submitButton.textContent : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
      }
      contactStatus.textContent = 'Enviando sua mensagem...';

      emailjs.sendForm('service_zo3fmgr', 'contato_site', contactForm)
        .then(function () {
          contactStatus.textContent = 'Mensagem enviada com sucesso. Em breve entraremos em contato.';
          contactForm.reset();
        })
        .catch(function (error) {
          console.error('Erro EmailJS:', error);
          contactStatus.textContent = 'Não foi possível enviar a mensagem agora. Tente novamente.';
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        });
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