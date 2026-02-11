(function () {
  function init() {
    var btn = document.getElementById("readMoreBtn");
    var content = document.getElementById("moreContent") || document.querySelector(".more-content");
    if (!btn || !content) return;

    function setState(expanded) {
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      content.style.display = expanded ? "block" : "none";
      btn.textContent = expanded ? "Read Less" : "Read More";
    }

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      setState(!expanded);
    });

    setState(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
