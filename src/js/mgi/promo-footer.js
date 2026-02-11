(function () {
  'use strict';

  window.toggleReadMore = function () {
    var content = document.getElementById("moreContent");
    var btn = document.getElementById("readMoreBtn");
    if (!content || !btn) return;

    var isHidden = window.getComputedStyle(content).display === "none";
    if (isHidden) {
      content.style.display = "block";
      btn.textContent = "Read Less";
      btn.setAttribute("aria-expanded", "true");
    } else {
      content.style.display = "none";
      btn.textContent = "Read More";
      btn.setAttribute("aria-expanded", "false");
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var content = document.getElementById("moreContent");
    var btn = document.getElementById("readMoreBtn");
    if (content) content.style.display = "none";
    if (btn) {
      btn.textContent = "Read More";
      btn.setAttribute("aria-expanded", "false");
    }
  }, { once: true });
})();
