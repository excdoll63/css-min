window.__MGI_SIDEMENU_VER__ = "2026-01-27";

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

(function () {
  "use strict";

  function onReady(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  function safeGet(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function normLang(raw) {
    var s = (raw || "").toLowerCase();
    if (!s) return "";
    if (s.indexOf("zh") === 0) return "ZH";
    if (s.indexOf("ms") === 0) return "MS";
    if (s.indexOf("th") === 0) return "TH";
    if (s.indexOf("vi") === 0) return "VN";
    if (s.indexOf("vn") === 0) return "VN";
    if (s.indexOf("id") === 0) return "ID";
    if (s.indexOf("en") === 0) return "EN";
    return "";
  }

  function getLangFromPage() {
    var htmlLang = document.documentElement ? document.documentElement.getAttribute("lang") : "";
    var byHtml = normLang(htmlLang);
    if (byHtml) return byHtml;

    var cls = document.body && document.body.className ? document.body.className : "";
    var m = cls.match(/(?:^|\s)(EN|ZH|MS|TH|VN|VI|ID)(?=\s|$)/i);
    if (m) {
      var code = (m[1] || "EN").toUpperCase();
      if (code === "VI") code = "VN";
      return code;
    }

    var ls = normLang(safeGet("LANGUAGE"));
    if (ls) return ls;

    return "EN";
  }

  var dict = {
    EN: {
      sm_home: "Home",
      sm_promo: "Promo",
      sm_lucky_number: "Lucky Number",
      sm_downline: "Downline",
      sm_download: "Download",
      sm_vip: "VIP",
      sm_deposit: "Deposit",
      sm_change_language: "Change Language",
      sm_tournament: "Tournament",
      sm_top20_withdrawal: "Top 20 Withdrawal",
      sm_top20_referral: "Top 20 Referral",
      sm_live_score: "Live Score",
      sm_soccer: "Soccer",
      sm_4d: "4D",
      sm_follow_us: "Follow Us",
      sm_facebook: "Facebook",
      sm_telegram: "Telegram",
      sm_youtube: "Youtube",
      sm_whatsapp: "Whatsapp",
      sm_live_chat: "Live Chat",
      sm_partnership: "Partnership",
      sm_mgi: "MGI"
    },
    ZH: {
      sm_home: "首页",
      sm_promo: "奖金",
      sm_lucky_number: "幸运号码",
      sm_downline: "下线",
      sm_download: "下载",
      sm_vip: "VIP",
      sm_deposit: "充值",
      sm_change_language: "更换语言",
      sm_tournament: "锦标赛",
      sm_top20_withdrawal: "提现前20",
      sm_top20_referral: "推荐前20",
      sm_live_score: "实时比分",
      sm_soccer: "足球",
      sm_4d: "万字",
      sm_follow_us: "关注我们",
      sm_facebook: "Facebook",
      sm_telegram: "Telegram",
      sm_youtube: "Youtube",
      sm_whatsapp: "Whatsapp",
      sm_live_chat: "在线客服",
      sm_partnership: "合作伙伴",
      sm_mgi: "MGI"
    },
    MS: {
      sm_home: "Utama",
      sm_promo: "Promosi",
      sm_lucky_number: "Nombor Bertuah",
      sm_downline: "Downline",
      sm_download: "Muat Turun",
      sm_vip: "VIP",
      sm_deposit: "Deposit",
      sm_change_language: "Tukar Bahasa",
      sm_tournament: "Kejohanan",
      sm_top20_withdrawal: "Top 20 Pengeluaran",
      sm_top20_referral: "Top 20 Rujukan",
      sm_live_score: "Skor Langsung",
      sm_soccer: "Bola Sepak",
      sm_4d: "4D",
      sm_follow_us: "Ikuti Kami",
      sm_facebook: "Facebook",
      sm_telegram: "Telegram",
      sm_youtube: "Youtube",
      sm_whatsapp: "Whatsapp",
      sm_live_chat: "Sembang Langsung",
      sm_partnership: "Rakan Kongsi",
      sm_mgi: "MGI"
    },
    TH: {
      sm_home: "หน้าแรก",
      sm_promo: "โปรโมชัน",
      sm_lucky_number: "เลขนำโชค",
      sm_downline: "ดาวน์ไลน์",
      sm_download: "ดาวน์โหลด",
      sm_vip: "VIP",
      sm_deposit: "ฝากเงิน",
      sm_change_language: "เปลี่ยนภาษา",
      sm_tournament: "ทัวร์นาเมนต์",
      sm_top20_withdrawal: "Top 20 ถอนเงิน",
      sm_top20_referral: "Top 20 แนะนำเพื่อน",
      sm_live_score: "สกอร์สด",
      sm_soccer: "ฟุตบอล",
      sm_4d: "4D",
      sm_follow_us: "ติดตามเรา",
      sm_facebook: "Facebook",
      sm_telegram: "Telegram",
      sm_youtube: "Youtube",
      sm_whatsapp: "Whatsapp",
      sm_live_chat: "แชทสด",
      sm_partnership: "พันธมิตร",
      sm_mgi: "MGI"
    },
    VN: {
      sm_home: "Trang chủ",
      sm_promo: "Khuyến mãi",
      sm_lucky_number: "Số may mắn",
      sm_downline: "Tuyến dưới",
      sm_download: "Tải xuống",
      sm_vip: "VIP",
      sm_deposit: "Nạp tiền",
      sm_change_language: "Đổi ngôn ngữ",
      sm_tournament: "Giải đấu",
      sm_top20_withdrawal: "Top 20 Rút tiền",
      sm_top20_referral: "Top 20 Giới thiệu",
      sm_live_score: "Tỷ số trực tiếp",
      sm_soccer: "Bóng đá",
      sm_4d: "4D",
      sm_follow_us: "Theo dõi chúng tôi",
      sm_facebook: "Facebook",
      sm_telegram: "Telegram",
      sm_youtube: "Youtube",
      sm_whatsapp: "Whatsapp",
      sm_live_chat: "Chat trực tuyến",
      sm_partnership: "Đối tác",
      sm_mgi: "MGI"
    },
    ID: {
      sm_home: "Beranda",
      sm_promo: "Promo",
      sm_lucky_number: "Nomor Keberuntungan",
      sm_downline: "Downline",
      sm_download: "Unduh",
      sm_vip: "VIP",
      sm_deposit: "Deposit",
      sm_change_language: "Ganti Bahasa",
      sm_tournament: "Turnamen",
      sm_top20_withdrawal: "Top 20 Penarikan",
      sm_top20_referral: "Top 20 Referral",
      sm_live_score: "Skor Langsung",
      sm_soccer: "Sepak Bola",
      sm_4d: "4D",
      sm_follow_us: "Ikuti Kami",
      sm_facebook: "Facebook",
      sm_telegram: "Telegram",
      sm_youtube: "Youtube",
      sm_whatsapp: "Whatsapp",
      sm_live_chat: "Live Chat",
      sm_partnership: "Kemitraan",
      sm_mgi: "MGI"
    }
  };

  function raf(fn) {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(fn);
    else setTimeout(fn, 16);
  }

  function setI18nAttr(el, key) {
    if (!el || !key) return;
    if (el.getAttribute("data-i18n") !== key) el.setAttribute("data-i18n", key);
  }

  function cleanText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function ensureTextSpanAfterIcon(a, key) {
    if (!a || !key) return;

    var existing = a.querySelector('span[data-i18n="' + key + '"]');
    if (existing) return;

    var label = cleanText(a.textContent);

    for (var i = a.childNodes.length - 1; i >= 0; i--) {
      var n = a.childNodes[i];
      if (n && n.nodeType === 3) a.removeChild(n);
    }

    var span = document.createElement("span");
    span.setAttribute("data-i18n", key);
    if (label) span.textContent = label;

    var img = null;
    for (var j = 0; j < a.children.length; j++) {
      var c = a.children[j];
      if (c && c.tagName === "IMG") {
        img = c;
        break;
      }
    }

    if (img && img.parentNode === a) {
      var space = document.createTextNode(" ");
      if (img.nextSibling) a.insertBefore(space, img.nextSibling);
      else a.appendChild(space);

      if (space.nextSibling) a.insertBefore(span, space.nextSibling);
      else a.appendChild(span);
    } else {
      a.appendChild(span);
    }
  }

  function ensureMarkers(root) {
    if (!root) return;

    var gridLinks = root.querySelectorAll(".menu-grid a.grid-item");
    for (var i = 0; i < gridLinks.length; i++) {
      var a = gridLinks[i];
      if (!a) continue;
      var href = a.getAttribute("href") || "";
      var key = "";

      if (href === "/home" || href === "#home" || href === "#/home" || href === "/#home") key = "sm_home";
      else if (href === "/promotion") key = "sm_promo";
      else if (href === "/luckynumber") key = "sm_lucky_number";
      else if (href === "/downline") key = "sm_downline";
      else if (href === "/vip") key = "sm_vip";
      else if (href && href.indexOf("mgi.hfcapital.top") !== -1) key = "sm_download";

      if (key) {
        var labelEl = a.querySelector(".grid-label");
        setI18nAttr(labelEl, key);
      }
    }

    setI18nAttr(root.querySelector('.menu-list a[href="/deposit"] .menu-label'), "sm_deposit");
    setI18nAttr(root.querySelector('#changelanguage .menu-label'), "sm_change_language");

    var hasSubs = root.querySelectorAll(".menu-list li.has-sub");
    for (var j = 0; j < hasSubs.length; j++) {
      var li = hasSubs[j];
      if (!li) continue;

      var topA = null;
      for (var k = 0; k < li.children.length; k++) {
        var ch = li.children[k];
        if (ch && ch.tagName === "A") {
          topA = ch;
          break;
        }
      }
      if (!topA) continue;

      var icon = topA.querySelector("img.menu-icon-img");
      var alt = icon ? (icon.getAttribute("alt") || "") : "";
      var key2 = "";

      if (/tournament/i.test(alt)) key2 = "sm_tournament";
      else if (/live\s*score/i.test(alt)) key2 = "sm_live_score";
      else if (/follow\s*us/i.test(alt)) key2 = "sm_follow_us";
      else if (/partnership/i.test(alt)) key2 = "sm_partnership";

      if (key2) setI18nAttr(topA.querySelector(".menu-label"), key2);
    }

    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="/top20wd-current"]'), "sm_top20_withdrawal");
    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="/top20ref-current"]'), "sm_top20_referral");

    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="/result-soccer"]'), "sm_soccer");
    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="/result-4d"]'), "sm_4d");

    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="https://www.facebook.com/mgiwallet"]'), "sm_facebook");
    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="https://t.me/mgiwallet"]'), "sm_telegram");
    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="https://www.youtube.com/@mgiwallet"]'), "sm_youtube");

    var wa = root.querySelector('.sub-menu a[href^="https://wa.me/"]');
    ensureTextSpanAfterIcon(wa, "sm_whatsapp");

    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="#chatroom"]'), "sm_live_chat");
    ensureTextSpanAfterIcon(root.querySelector('.sub-menu a[href="https://mgiwallet.com/"]'), "sm_mgi");
  }

  function applyI18n(root) {
    if (!root) return;

    ensureMarkers(root);

    var lang = getLangFromPage();
    var t = dict[lang] || dict.EN;

    var nodes = root.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (t[key]) nodes[i].textContent = t[key];
    }
  }

  function watchI18n() {
    if (document.body && document.body.getAttribute("data-mgi-sidemenu-i18n") === "1") return;
    if (document.body) document.body.setAttribute("data-mgi-sidemenu-i18n", "1");

    var scheduled = false;

    function scheduleApply() {
      if (scheduled) return;
      scheduled = true;
      raf(function () {
        scheduled = false;
        var root = document.getElementById("sidebar");
        if (root) applyI18n(root);
      });
    }

    scheduleApply();

    if (!window.MutationObserver) return;

    var obsLang = new MutationObserver(function () {
      scheduleApply();
    });

    if (document.body) obsLang.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    if (document.documentElement) obsLang.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    if (!document.getElementById("sidebar") && document.body) {
      var obsRoot = new MutationObserver(function () {
        if (document.getElementById("sidebar")) scheduleApply();
      });
      obsRoot.observe(document.body, { childList: true, subtree: true });
    }
  }

  onReady(watchI18n);
})();
