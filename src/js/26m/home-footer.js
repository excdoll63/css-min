window.__26M_HOME_VER__ = '20260313';

(function () {
  'use strict';

  function syncReadMore(open) {
    var content = document.getElementById('moreContent');
    var btn = document.getElementById('readMoreBtn');
    if (!content || !btn) return;

    content.hidden = !open;
    content.setAttribute('aria-hidden', open ? 'false' : 'true');
    btn.textContent = open ? 'Read Less' : 'Read More';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  window.toggleReadMore = function () {
    var content = document.getElementById('moreContent');
    if (!content) return;
    syncReadMore(content.hidden);
  };

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      var content = document.getElementById('moreContent');
      var btn = document.getElementById('readMoreBtn');

      if (content) {
        if (!content.hasAttribute('hidden')) {
          content.hidden = true;
        }
        content.setAttribute('aria-hidden', content.hidden ? 'true' : 'false');
      }

      if (btn) {
        btn.textContent = content && !content.hidden ? 'Read Less' : 'Read More';
        btn.setAttribute('aria-expanded', content && !content.hidden ? 'true' : 'false');
        btn.setAttribute('aria-controls', 'moreContent');
      }
    },
    { once: true }
  );
})();
