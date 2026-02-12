(function () {
  'use strict';
  function init() {
    var root = document.getElementById('promoFooter');
    if (!root) return;
    var btn = root.querySelector('#promoReadMoreBtn');
    var content = root.querySelector('#promoMoreContent');
    if (!btn || !content) return;
    function setState(expanded) {
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      content.style.display = expanded ? 'block' : 'none';
      btn.textContent = expanded ? 'Read Less' : 'Read More';
    }
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      setState(btn.getAttribute('aria-expanded') !== 'true');
    });
    setState(false);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
