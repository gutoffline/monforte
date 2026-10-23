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
(function () {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;

  var section = grid.closest('.gallery');
  var filters = section.querySelector('.gallery-filters');
  var filterButtons = filters.querySelectorAll('.gallery-filter');
  var moreButton = document.getElementById('galleryMore');
  var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var categoryLabels = { maquinas: 'Máquinas', pecas: 'Peças' };

  // Blocos do bento por número de colunas. Cada slot é [coluna, linha, colunas, linhas]
  // dentro do bloco. Um tamanho pode ter variações; chooseTemplate escolhe a que melhor
  // combina com a orientação das fotos (foto horizontal não vai para slot alto).
  var layouts = {
    4: {
      rotation: [4, 5, 4, 6], minLast: 3, initialBlocks: 2,
      sizes: {
        1: [{ rows: 2, slots: [[1, 1, 4, 2]] }],
        2: [{ rows: 2, slots: [[1, 1, 2, 2], [3, 1, 2, 2]] }],
        3: [
          { rows: 2, slots: [[1, 1, 2, 2], [3, 1, 1, 2], [4, 1, 1, 2]] },
          { rows: 2, slots: [[1, 1, 2, 2], [3, 1, 2, 1], [3, 2, 2, 1]] }
        ],
        4: [
          { rows: 2, slots: [[1, 1, 2, 2], [3, 1, 1, 2], [4, 1, 1, 1], [4, 2, 1, 1]] },
          { rows: 2, slots: [[1, 1, 2, 2], [3, 1, 2, 1], [3, 2, 1, 1], [4, 2, 1, 1]] }
        ],
        5: [
          { rows: 2, slots: [[1, 1, 2, 2], [3, 1, 1, 1], [4, 1, 1, 1], [3, 2, 1, 1], [4, 2, 1, 1]] },
          { rows: 2, slots: [[1, 1, 1, 2], [2, 1, 1, 1], [3, 1, 1, 1], [4, 1, 1, 2], [2, 2, 2, 1]] }
        ],
        6: [
          { rows: 2, slots: [[1, 1, 1, 2], [2, 1, 1, 1], [2, 2, 1, 1], [3, 1, 1, 2], [4, 1, 1, 1], [4, 2, 1, 1]] },
          { rows: 2, slots: [[1, 1, 1, 2], [2, 1, 2, 1], [4, 1, 1, 1], [4, 2, 1, 1], [2, 2, 1, 1], [3, 2, 1, 1]] }
        ]
      }
    },
    3: {
      rotation: [3, 4, 3, 5], minLast: 2, initialBlocks: 3,
      sizes: {
        1: [{ rows: 2, slots: [[1, 1, 3, 2]] }],
        2: [{ rows: 2, slots: [[1, 1, 2, 2], [3, 1, 1, 2]] }],
        3: [{ rows: 2, slots: [[1, 1, 2, 2], [3, 1, 1, 1], [3, 2, 1, 1]] }],
        4: [
          { rows: 2, slots: [[1, 1, 1, 2], [2, 1, 1, 2], [3, 1, 1, 1], [3, 2, 1, 1]] },
          { rows: 2, slots: [[1, 1, 1, 2], [2, 1, 1, 1], [3, 1, 1, 1], [2, 2, 2, 1]] }
        ],
        5: [{ rows: 2, slots: [[1, 1, 1, 2], [2, 1, 1, 1], [3, 1, 1, 1], [2, 2, 1, 1], [3, 2, 1, 1]] }],
        6: [{ rows: 2, slots: [[1, 1, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1], [3, 2, 1, 1]] }]
      }
    },
    2: {
      rotation: [3, 2], minLast: 1, initialBlocks: 4,
      sizes: {
        1: [{ rows: 2, slots: [[1, 1, 2, 2]] }],
        2: [
          { rows: 2, slots: [[1, 1, 1, 2], [2, 1, 1, 2]] },
          { rows: 1, slots: [[1, 1, 1, 1], [2, 1, 1, 1]] }
        ],
        3: [
          { rows: 2, slots: [[1, 1, 1, 2], [2, 1, 1, 1], [2, 2, 1, 1]] },
          { rows: 2, slots: [[1, 1, 2, 1], [1, 2, 1, 1], [2, 2, 1, 1]] }
        ],
        4: [{ rows: 2, slots: [[1, 1, 1, 1], [2, 1, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1]] }]
      }
    }
  };

  var currentFilter = 'todos';
  var currentCols = 0;
  var pages = 1;

  items.forEach(function (item, index) {
    var img = item.querySelector('img');
    var ratio = img.getAttribute('width') / img.getAttribute('height');
    item.dataset.orientation = ratio > 1.15 ? 'landscape' : ratio < 0.87 ? 'portrait' : 'square';
    item.style.viewTransitionName = 'galeria-foto-' + index;
  });

  function matchesFilter(item) {
    return currentFilter === 'todos' || item.dataset.category === currentFilter;
  }

  function slotKind(slot) {
    if (slot[2] === slot[3]) return slot[2] > 1 ? 'big' : 'small';
    return slot[3] > slot[2] ? 'tall' : 'wide';
  }

  // Divide as fotos em blocos seguindo a rotação, sem deixar um último bloco pequeno demais.
  function partition(total, layout) {
    var maxSize = Math.max.apply(null, Object.keys(layout.sizes).map(Number));
    var sizes = [];
    var rest = total;
    var turn = 0;
    while (rest > 0) {
      var size = Math.min(layout.rotation[turn++ % layout.rotation.length], rest);
      var left = rest - size;
      if (left > 0 && left < layout.minLast) size = rest <= maxSize ? rest : rest - layout.minLast;
      sizes.push(size);
      rest -= size;
    }
    return sizes;
  }

  function chooseTemplate(variants, blockItems) {
    var landscapes = blockItems.filter(function (item) { return item.dataset.orientation === 'landscape'; }).length;
    var others = blockItems.length - landscapes;
    var best = variants[0];
    var bestScore = Infinity;
    variants.forEach(function (variant) {
      var tall = 0;
      var wide = 0;
      variant.slots.forEach(function (slot) {
        var kind = slotKind(slot);
        if (kind === 'tall') tall++;
        if (kind === 'wide') wide++;
      });
      if (wide > landscapes) return;
      var score = Math.max(0, tall - others) * 10 - wide;
      if (score < bestScore) {
        best = variant;
        bestScore = score;
      }
    });
    return best;
  }

  function assignSlots(template, blockItems) {
    var pool = blockItems.slice();
    // Slots com formato restrito escolhem primeiro; o grande (quase quadrado) aceita qualquer foto.
    var priority = { wide: 0, tall: 1, big: 2, small: 3 };

    function take(orientations) {
      for (var o = 0; o < orientations.length; o++) {
        for (var i = 0; i < pool.length; i++) {
          if (pool[i].dataset.orientation === orientations[o]) return pool.splice(i, 1)[0];
        }
      }
      return pool.shift();
    }

    return template.slots
      .map(function (slot) { return { slot: slot, kind: slotKind(slot) }; })
      .sort(function (a, b) { return priority[a.kind] - priority[b.kind]; })
      .map(function (entry) {
        var item = entry.kind === 'wide' ? take(['landscape', 'square'])
          : entry.kind === 'tall' ? take(['portrait', 'square'])
          : pool.shift();
        return { item: item, slot: entry.slot };
      });
  }

  function layoutGallery() {
    var cols = parseInt(getComputedStyle(grid).getPropertyValue('--cols'), 10) || 4;
    var layout = layouts[cols] || layouts[4];
    var active = items.filter(matchesFilter);
    var sizes = partition(active.length, layout);
    var visibleBlocks = layout.initialBlocks * pages;
    var placed = [];
    var row = 1;
    var start = 0;

    sizes.forEach(function (size, block) {
      var blockItems = active.slice(start, start + size);
      var template = chooseTemplate(layout.sizes[size], blockItems);
      start += size;

      assignSlots(template, blockItems).forEach(function (entry) {
        var slot = entry.slot;
        // Blocos ímpares são espelhados para o bento não repetir o mesmo desenho.
        var col = block % 2 ? cols - slot[0] - slot[2] + 2 : slot[0];
        var itemRow = row + slot[1] - 1;
        entry.item.style.gridColumn = col + ' / span ' + slot[2];
        entry.item.style.gridRow = itemRow + ' / span ' + slot[3];
        entry.item.hidden = block >= visibleBlocks;
        placed.push({ item: entry.item, row: itemRow, col: col });
      });
      row += template.rows;
    });

    // A ordem no HTML segue a ordem visual, para o Tab e o lightbox andarem na mesma sequência.
    placed.sort(function (a, b) { return a.row - b.row || a.col - b.col; });
    placed.forEach(function (entry) { grid.appendChild(entry.item); });
    items.forEach(function (item) {
      if (matchesFilter(item)) return;
      item.hidden = true;
      grid.appendChild(item);
    });

    moreButton.hidden = sizes.length <= visibleBlocks;
    currentCols = cols;
  }

  function withTransition(update) {
    if (document.startViewTransition && !prefersReduced) document.startViewTransition(update);
    else update();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.getAttribute('aria-pressed') === 'true') return;
      filterButtons.forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === button));
      });
      currentFilter = button.dataset.filter;
      pages = 1;
      withTransition(layoutGallery);
    });
  });

  moreButton.addEventListener('click', function () {
    var wasHidden = items.filter(function (item) { return item.hidden && matchesFilter(item); });
    pages++;
    withTransition(function () {
      layoutGallery();
      // Sem mais fotos o botão some; o foco vai para a primeira foto nova.
      if (!moreButton.hidden) return;
      var firstNew = Array.prototype.find.call(grid.children, function (item) {
        return !item.hidden && wasHidden.indexOf(item) !== -1;
      });
      if (firstNew) firstNew.focus();
    });
  });

  window.addEventListener('resize', function () {
    var cols = parseInt(getComputedStyle(grid).getPropertyValue('--cols'), 10);
    if (cols !== currentCols) layoutGallery();
  });

  filters.hidden = false;
  layoutGallery();

  var lightbox = document.getElementById('galleryLightbox');
  if (!lightbox || typeof lightbox.showModal !== 'function') return;

  var lightboxImg = lightbox.querySelector('.lightbox-img');
  var lightboxCategory = lightbox.querySelector('.lightbox-category');
  var lightboxCounter = lightbox.querySelector('.lightbox-counter');
  var prevButton = lightbox.querySelector('.lightbox-prev');
  var nextButton = lightbox.querySelector('.lightbox-next');
  var lightboxItems = [];
  var lightboxIndex = 0;
  var lightboxTrigger = null;
  var touchStartX = null;

  function preload(index) {
    var item = lightboxItems[(index + lightboxItems.length) % lightboxItems.length];
    if (item) new Image().src = item.getAttribute('href');
  }

  function showPhoto(index) {
    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    var item = lightboxItems[lightboxIndex];
    var src = item.getAttribute('href');

    if (lightboxImg.getAttribute('src') !== src) {
      lightboxImg.classList.add('is-loading');
      lightboxImg.src = src;
    }
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCategory.textContent = categoryLabels[item.dataset.category] || '';
    lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + lightboxItems.length;
    preload(lightboxIndex + 1);
    preload(lightboxIndex - 1);
  }

  function stepPhoto(step) {
    if (lightboxItems.length > 1) showPhoto(lightboxIndex + step);
  }

  function revealPhoto() {
    lightboxImg.classList.remove('is-loading');
  }

  lightboxImg.addEventListener('load', revealPhoto);
  lightboxImg.addEventListener('error', revealPhoto);

  grid.addEventListener('click', function (event) {
    var item = event.target.closest('.gallery-item');
    // Ctrl/Cmd + clique continua abrindo a foto em outra aba.
    if (!item || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();

    lightboxItems = Array.prototype.filter.call(grid.children, matchesFilter);
    lightboxTrigger = item;
    prevButton.hidden = nextButton.hidden = lightboxItems.length < 2;
    showPhoto(lightboxItems.indexOf(item));
    lightbox.showModal();
    document.body.style.overflow = 'hidden';
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', function () { lightbox.close(); });
  prevButton.addEventListener('click', function () { stepPhoto(-1); });
  nextButton.addEventListener('click', function () { stepPhoto(1); });

  // Clique fora da foto fecha o lightbox.
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox || event.target.classList.contains('lightbox-figure')) lightbox.close();
  });

  lightbox.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') stepPhoto(1);
    if (event.key === 'ArrowLeft') stepPhoto(-1);
  });

  lightbox.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (event) {
    if (touchStartX === null) return;
    var distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) stepPhoto(distance < 0 ? 1 : -1);
    touchStartX = null;
  });

  lightbox.addEventListener('close', function () {
    document.body.style.overflow = '';
    if (lightboxTrigger) lightboxTrigger.focus({ preventScroll: true });
  });
})();
