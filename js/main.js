(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var menuBtn = document.getElementById('menuBtn');
  var siteNav = document.getElementById('siteNav');
  var navLinks = siteNav.querySelectorAll('a');
  var cursorGlow = document.querySelector('.cursor-glow');
  var hero = document.getElementById('hero');
  var wordTrack = document.getElementById('wordRotate');
  var marqueeTrack = document.querySelector('.marquee__track');

  var lastScroll = 0;
  var wordIndex = 0;
  var wordCount = wordTrack ? wordTrack.children.length : 0;

  /* Mobile menu */
  menuBtn.addEventListener('click', function () {
    var open = siteNav.classList.toggle('open');
    menuBtn.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      siteNav.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* Rotating headline words */
  if (wordTrack && wordCount > 1) {
    function setWordPosition() {
      var step = wordTrack.children[0].offsetHeight;
      wordTrack.style.transform = 'translate3d(0, -' + (wordIndex * step) + 'px, 0)';
    }

    setWordPosition();
    window.addEventListener('resize', setWordPosition);

    setInterval(function () {
      wordIndex = (wordIndex + 1) % wordCount;
      setWordPosition();
    }, 2800);
  }

  /* Parallax + scroll effects */
  function onScroll() {
    var y = window.scrollY;
    var dir = y > lastScroll ? 1 : -1;

    header.classList.toggle('scrolled', y > 40);
    if (hero) hero.classList.toggle('is-scrolled', y > 80);

    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax'));
      var offset = y * speed;
      el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    });

    /* Marquee reverses direction feel on scroll up */
    if (marqueeTrack) {
      var speed = dir > 0 ? 28 : 18;
      marqueeTrack.style.animationDuration = speed + 's';
    }

    /* Active nav */
    var navY = y + 120;
    document.querySelectorAll('section[id]').forEach(function (sec) {
      if (navY >= sec.offsetTop && navY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + sec.id);
        });
      }
    });

    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Cursor glow */
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  /* Scroll reveal */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 6) * 0.07 + 's';
    revealObs.observe(el);
  });

  /* Growth panel metric counters */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var start = 0;
    var duration = 1400;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var metricObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        metricObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.gp-metric__val[data-count]').forEach(function (el) {
    metricObs.observe(el);
  });
})();
