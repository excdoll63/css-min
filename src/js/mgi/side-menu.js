window.__MGI_SIDEMENU_VER__ = "2026-01-21";

(function () {
  "use strict";

  function onReady(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  function closest(el, selector) {
    while (el && el.nodeType === 1) {
      if (el.matches(selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function addClass(el, cls) {
    if (el && cls) el.classList.add(cls);
  }
  function removeClass(el, cls) {
    if (el && cls) el.classList.remove(cls);
  }
  function hasClass(el, cls) {
    return !!(el && cls && el.classList.contains(cls));
  }

  onReady(function () {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sideOverlay");
    var toggle = document.getElementById("sidebarToggle");
    var closeTop = document.getElementById("sidebarCloseTop");

    if (!sidebar || !overlay || !toggle) return;

    if (sidebar.getAttribute("data-mgi-inited") === "1") return;
    sidebar.setAttribute("data-mgi-inited", "1");

    function openSidebar() {
      addClass(sidebar, "open");
      addClass(overlay, "show");
    }

    function closeSidebar() {
      removeClass(sidebar, "open");
      removeClass(overlay, "show");
    }

    function toggleSidebar() {
      if (hasClass(sidebar, "open")) closeSidebar();
      else openSidebar();
    }

    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      toggleSidebar();
    });

    if (closeTop) {
      closeTop.addEventListener("click", function (e) {
        e.preventDefault();
        toggleSidebar();
      });
    }

    overlay.addEventListener("click", function () {
      closeSidebar();
    });

    document.addEventListener("keydown", function (e) {
      if (e && e.key === "Escape") closeSidebar();
    });

    sidebar.addEventListener("click", function (e) {
      var subToggle = closest(e.target, ".menu-list .has-sub > a");
      if (subToggle) {
        e.preventDefault();
        var parentLi = closest(subToggle, "li");
        if (parentLi) parentLi.classList.toggle("open");
        return;
      }

      var gridLink = closest(e.target, ".menu-grid a");
      if (gridLink) {
        closeSidebar();
        return;
      }

      var menuLink = closest(e.target, ".menu-list > li:not(.has-sub) > a");
      if (menuLink) {
        closeSidebar();
        return;
      }
    });

    document.addEventListener("click", function (e) {
      var langItem = closest(e.target, ".lang-item");
      if (!langItem) return;

      e.preventDefault();
      var items = document.querySelectorAll(".lang-item");
      for (var i = 0; i < items.length; i++) items[i].classList.remove("active");
      langItem.classList.add("active");
    });

    (function markActiveMenu() {
      var current = window.location && window.location.pathname ? window.location.pathname : "";
      if (!current) return;

      var links = sidebar.querySelectorAll(".menu-grid a, .menu-list > li > a");
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href") || "";
        if (!href || href === "#") continue;
        if (href.indexOf("http") === 0 || href.indexOf("//") === 0) continue;
        if (href.indexOf("javascript:") === 0) continue;

        if (current.indexOf(href) === 0) {
          var li = closest(links[i], "li");
          if (li) li.classList.add("active");
        }
      }
    })();

    document.addEventListener("click", function (e) {
      if (!hasClass(sidebar, "open")) return;

      var t = e.target;
      if (closest(t, "#sidebar") || closest(t, "#sidebarToggle")) return;

      closeSidebar();
    });
  });
})();
