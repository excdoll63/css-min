(function () {
  'use strict';

  window.togglePromoReadMore = function () {
    var content = document.getElementById('promoMoreContent');
    var btn = document.getElementById('promoReadMoreBtn');
    if (!content || !btn) return;

    var isHidden = window.getComputedStyle(content).display === 'none';

    if (isHidden) {
      content.style.setProperty('display', 'block', 'important');
      btn.textContent = 'Read Less';
      btn.setAttribute('aria-expanded', 'true');
    } else {
      content.style.setProperty('display', 'none', 'important');
      btn.textContent = 'Read More';
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      var content = document.getElementById('promoMoreContent');
      var btn = document.getElementById('promoReadMoreBtn');
      if (content) content.style.setProperty('display', 'none', 'important');
      if (btn) {
        btn.textContent = 'Read More';
        btn.setAttribute('aria-expanded', 'false');
      }
    },
    { once: true }
  );
})();
