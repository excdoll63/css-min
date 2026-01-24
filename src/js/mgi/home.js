(function () {
      var API_URL = "https://api-66.com/LiveTX=com01";

      var table = document.getElementById("home-livetx");
      var tbody = document.querySelector("#home-livetx tbody");
      if (!tbody || !table) return;

      function ensureRM(value) {
        if (value == null || value === "-") return "-";
        var s = String(value).trim();
        if (!s) return "-";
        return s.toUpperCase().indexOf("RM") === 0 ? s : ("RM" + s);
      }

      function normalizeRows(data) {
        var rows = [];
        if (Array.isArray(data)) {
          rows = data;
        } else if (data && typeof data === "object" && Array.isArray(data.rows)) {
          rows = data.rows;
        }

        return rows.map(function (r) {
          var txtype = (r.txtype || "").toString().toLowerCase();
          var type = (r.type || (txtype === "w" ? "WITHDRAW" : "DEPOSIT")).toUpperCase();
          var isWithdraw = type === "WITHDRAW";

          return {
            type: type,
            mobile: r.mobile || "-",
            amount: r.amount,
            game: isWithdraw ? (r.game || r.gameName || "-") : "-"
          };
        });
      }

      function renderRows(rows) {
        if (!Array.isArray(rows)) rows = [];

        var deposits = [];
        var withdraws = [];

        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          if (!r || !r.type) continue;
          if (r.type === "DEPOSIT") deposits.push(r);
          else if (r.type === "WITHDRAW") withdraws.push(r);
        }

        var maxRows = 5;
        var html = "";

        for (var j = 0; j < maxRows; j++) {
          var d = deposits[j];
          var w = withdraws[j];

          var dMobile = d && d.mobile ? d.mobile : "-";
          var dAmount = d ? ensureRM(d.amount) : "-";

          var wMobile = w && w.mobile ? w.mobile : "-";
          var wAmount = w ? ensureRM(w.amount) : "-";
          var wGame   = w && w.game ? w.game : "-";

          html += "<tr>"
               +    "<td>" + dMobile + "</td>"
               +    "<td class='amount'>" + dAmount + "</td>"
               +    "<td>" + wMobile + "</td>"
               +    "<td class='amount'>" + wAmount + "</td>"
               +    "<td>" + wGame + "</td>"
               +  "</tr>";
        }

        tbody.innerHTML = html;
        if (!table.classList.contains("mgi-live-ready")) table.classList.add("mgi-live-ready");
      }

      function loadTX() {
        fetch(API_URL, { cache: "no-store" })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (!j || (j.code !== 0 && j.code !== "0")) return;
            var rows = normalizeRows(j.data);
            renderRows(rows);
          })
          .catch(function () {});
      }

      loadTX();
      setInterval(loadTX, 15000);
    })();

(function() {
  function createElement(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  function createSlot(name) {
    return createElement("div", "slot " + name);
  }

  function createDesktopLayout() {
    var table = createElement("table", "box-3");
    table.style.minHeight = "813px";
    var tbody = createElement("tbody");
    var tr = document.createElement("tr");

    var td1 = createElement("td", "box-3-1");
    td1.appendChild(createSlot("slot-banner"));
    td1.appendChild(createSlot("slot-static-banner"));
    td1.appendChild(createSlot("slot-jackpot"));
    td1.appendChild(createSlot("slot-checkin"));
    td1.appendChild(createSlot("slot-livetx"));
    td1.appendChild(createSlot("slot-refer"));
    td1.appendChild(createSlot("slot-lucky"));
    td1.appendChild(createSlot("slot-movie"));
    td1.appendChild(createSlot("slot-soccer"));
    td1.appendChild(createSlot("slot-game-banners"));

    var td2 = createElement("td", "box-3-2");
    td2.appendChild(createSlot("slot-game"));
    td2.appendChild(createSlot("slot-footer"));

    var td3 = createElement("td", "box-3-3");
    td3.appendChild(createSlot("slot-heading"));
    td3.appendChild(createSlot("slot-application"));
    td3.appendChild(createSlot("slot-balance"));
    td3.appendChild(createSlot("slot-leaderboard"));
    td3.appendChild(createSlot("slot-bonus"));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tbody.appendChild(tr);
    table.appendChild(tbody);
    return table;
  }

  function createTabletLayout() {
    var table = createElement("table", "box-2");
    table.style.minHeight = "1048px";
    var tbody = createElement("tbody");
    var tr = document.createElement("tr");

    var td1 = createElement("td", "box-2-1");
    td1.appendChild(createSlot("slot-banner"));
    td1.appendChild(createSlot("slot-static-banner"));
    td1.appendChild(createSlot("slot-jackpot"));
    td1.appendChild(createSlot("slot-checkin"));
    td1.appendChild(createSlot("slot-livetx"));
    td1.appendChild(createSlot("slot-refer"));
    td1.appendChild(createSlot("slot-lucky"));
    td1.appendChild(createSlot("slot-movie"));
    td1.appendChild(createSlot("slot-soccer"));
    td1.appendChild(createSlot("slot-game-banners"));

    var td2 = createElement("td", "box-2-2");
    td2.appendChild(createSlot("slot-heading"));
    td2.appendChild(createSlot("slot-application"));
    td2.appendChild(createSlot("slot-balance"));
    td2.appendChild(createSlot("slot-leaderboard"));
    td2.appendChild(createSlot("slot-bonus"));
    td2.appendChild(createSlot("slot-game"));
    td2.appendChild(createSlot("slot-footer"));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tbody.appendChild(tr);
    table.appendChild(tbody);
    return table;
  }

  var modules = null;

  function cacheModules() {
    if (modules) return;
    modules = {
      bannerWrapper: document.querySelector(".banner-wrapper"),
      staticBanner: document.querySelector(".static-banner"),
      jackpotWrapper: document.querySelector(".jackpot-wrapper"),
      userCheckinWrapper: document.querySelector(".user-checkin-wrapper"),
      livetxWrapper: document.querySelector(".livetx-wrapper"),
      livetxAppendWrapper: document.querySelector(".livetx-append-wrapper"),
      referWrapper: document.querySelector(".refer-wrapper"),
      luckyWrapper: document.querySelector(".lucky-wrapper"),
      movieWrapper: document.querySelector(".movie-wrapper"),
      soccerBanner: document.querySelector(".soccer-banner"),
      popularGame: document.querySelector(".popular-game"),
      gameBanners: document.querySelector(".game-banners"),
      gameWrapper: document.querySelector(".game-wrapper"),
      footerWrapper: document.querySelector(".footer-wrapper"),
      applicationWrapper: document.querySelector(".application-1-wrapper"),
      balanceWrapper: document.querySelector(".balance-wrapper"),
      userRankWrapper: document.querySelector(".user-rank-wrapper"),
      leaderboardBanner: document.querySelector(".leaderboard-banner"),
      bonusWrapper: document.querySelector(".bonus-wrapper")
    };
  }

  function fetchInitLayout(width) {
    var container = document.querySelector("#home > .A") || document.querySelector("#home .A") || document.querySelector(".A");
    if (!container) return;
    container.innerHTML = "";
    if (width >= 1024) {
      container.appendChild(createDesktopLayout());
    } else {
      container.appendChild(createTabletLayout());
    }
  }

  function moveToSlot(moduleEl, slotSelector) {
    if (!moduleEl) return;
    var slotEl = document.querySelector(slotSelector);
    if (!slotEl) return;
    slotEl.appendChild(moduleEl);
  }

  function initHomeLayout() {
    cacheModules();
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) return;
    fetchInitLayout(width);
    moveToSlot(modules.bannerWrapper, ".slot-banner");
    moveToSlot(modules.staticBanner, ".slot-static-banner");
    moveToSlot(modules.jackpotWrapper, ".slot-jackpot");
    moveToSlot(modules.userCheckinWrapper, ".slot-checkin");
    moveToSlot(modules.livetxWrapper, ".slot-livetx");
    moveToSlot(modules.livetxAppendWrapper, ".slot-livetx");
    moveToSlot(modules.referWrapper, ".slot-refer");
    moveToSlot(modules.luckyWrapper, ".slot-lucky");
    moveToSlot(modules.movieWrapper, ".slot-movie");
    moveToSlot(modules.soccerBanner, ".slot-soccer");
    moveToSlot(modules.popularGame, ".slot-game-banners");
    moveToSlot(modules.gameBanners, ".slot-game-banners");
    moveToSlot(modules.gameWrapper, ".slot-game");
    moveToSlot(modules.footerWrapper, ".slot-footer");
    moveToSlot(modules.applicationWrapper, ".slot-application");
    moveToSlot(modules.balanceWrapper, ".slot-balance");
    moveToSlot(modules.userRankWrapper, ".slot-balance");
    moveToSlot(modules.leaderboardBanner, ".slot-leaderboard");
    moveToSlot(modules.bonusWrapper, ".slot-bonus");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomeLayout);
  } else {
    initHomeLayout();
  }

  window.addEventListener("resize", initHomeLayout);
})();

(function() {
  var VIP_COM = "com01";
  var CHECKIN_API_BASE = (window.CHECKIN_API_BASE || "https://api-66.com/vip/checkin").replace(/\/+$/g, "");
  var CHECKIN_LOCAL_PREFIX = "MGI_CHECKIN_DATE_";

  var translationsCKI = {
    EN: {
      checkinInfoTitle: "Check-In Bonus",
      checkinInfo: "Terms & Conditions: <br> *For Regular member, must have atleast deposit total RM100 before <br> *No Turnover / Rollover <br> *Withdraw Full <br> *For All Games",
      checkinBtn: "Check In",
      checkedinBtn: "Checked In",
      claimSuccess: "angpao sent, please claim at your promotion page！",
      checkinSuccess: "Check in successfully!",
      checkinError: "An error occurred while check in. Please try again.",
      titleCheckin: "Daily Check-In",
      contentTitleCheckin: "Check in for 7 consecutive days to receive a bonus, if miss 1 day during check-in duration, it will reset to Day1.",
      dayText: function(day) { return "Day " + day; },
      checkinDeposit: "Insufficient deposit, you must have at least deposit total RM100 before (after register) to claim this check-in bonus."
    },
    ZH: {
      checkinInfoTitle: "签到奖励",
      checkinInfo: "Terms & Conditions: <br> *For Regular member, must have atleast deposit total RM100 before <br> *No Turnover / Rollover <br> *Withdraw Full <br> *For All Games",
      checkinBtn: "签到",
      checkedinBtn: "已签到",
      claimSuccess: "红包已发送, 请在促销页面领取！",
      checkinSuccess: "签到成功!",
      checkinError: "签到时发生错误，请重试。",
      titleCheckin: "每日签到",
      contentTitleCheckin: "连续签到 7 天可获得奖励，如果在签到期间漏签 1 天，将重置为第 1 天.",
      dayText: function(day) { return day + "天"; },
      checkinDeposit: "存款不足，您必须在注册后至少存入总计 RM100，才能领取此签到奖励。"
    },
    MS: {
      checkinInfoTitle: "Daftar Masuk Bonus",
      checkinInfo: "Terms & Conditions: <br> *For Regular member, must have atleast deposit total RM100 before <br> *No Turnover / Rollover <br> *Cuci Full <br> *For All Games",
      checkinBtn: "Daftar Masuk",
      checkedinBtn: "Telah Daftar Masuk",
      claimSuccess: "angpau telah dihantar, sila tuntut di halaman promosi anda!",
      checkinSuccess: "Berjaya daftar masuk!",
      checkinError: "Ralat semasa daftar masuk. Sila cuba lagi.",
      titleCheckin: "Daftar Masuk Harian",
      contentTitleCheckin: "Daftar masuk selama 7 hari berturut-turut untuk menerima bonus, jika terlepas 1 hari sepanjang tempoh daftar masuk, ia akan diset semula ke Hari 1.",
      dayText: function(day) { return "Hari " + day; },
      checkinDeposit: "Deposit tidak mencukupi, anda mesti mempunyai jumlah deposit sekurang-kurangnya RM100 sebelum ini (selepas mendaftar) untuk menuntut bonus daftar masuk ini."
    }
  };

  function getLangConfig() {
    var key = (localStorage.getItem("LANGUAGE") || "EN").replace(/['"]/g, "");
    return translationsCKI[key] || translationsCKI.EN;
  }

  function getUserId() {
    try {
      var info = localStorage.getItem("USER");
      if (!info) return "0";
      var obj = JSON.parse(info);
      return obj && obj.id ? String(obj.id) : "0";
    } catch (e) {
      return "0";
    }
  }

  function getTodayKey() {
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, "0");
    var d = String(now.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function getLocalKey(userId) {
    return CHECKIN_LOCAL_PREFIX + String(userId || "0");
  }

  function saveLocalChecked(userId) {
    try {
      localStorage.setItem(getLocalKey(userId), getTodayKey());
    } catch (e) {}
  }

  function hasLocalCheckedToday(userId) {
    try {
      var v = localStorage.getItem(getLocalKey(userId));
      return v === getTodayKey();
    } catch (e) {
      return false;
    }
  }

  function applyStaticTexts() {
    var lang = getLangConfig();
    var titleSpan = document.querySelector(".header-checkin .checkin-group span:first-child");
    if (titleSpan) titleSpan.textContent = lang.titleCheckin;
    var contentTitle = document.querySelector(".content-title-checkin");
    if (contentTitle) contentTitle.textContent = lang.contentTitleCheckin;
    for (var i = 1; i <= 7; i++) {
      var dayLabel = document.querySelector("#checkin-box_" + i + " .checkin-day-text");
      if (dayLabel) dayLabel.textContent = lang.dayText(i);
    }
    var infoTitle = document.getElementById("checkin-info-title");
    if (infoTitle) infoTitle.textContent = lang.checkinInfoTitle;
    var infoBody = document.getElementById("checkin-info");
    if (infoBody) infoBody.innerHTML = lang.checkinInfo;
  }

  function updateBoxes(checkinDay) {
    var progress = Math.max(0, Math.min(7, Number(checkinDay || 0)));
    for (var i = 1; i <= 7; i++) {
      var box = document.getElementById("checkin-box_" + i);
      var circle = document.getElementById("checkin-circle_" + i);
      if (!box || !circle) continue;
      if (i <= progress) {
        box.classList.remove("unchecked");
        circle.textContent = "✔";
      } else {
        box.classList.add("unchecked");
        circle.textContent = "-";
      }
    }
    var bar = document.querySelector(".checkin-progress-bar");
    if (bar) {
      var pct = progress / 7 * 100;
      bar.style.background = "linear-gradient(to right, #ffa500 " + pct + "%, #ccc " + pct + "%)";
    }
  }

  function fillRanks(rankArray) {
    if (!rankArray || !rankArray.length) return;
    rankArray.forEach(function(r) {
      var lv = r.rankLevel != null ? r.rankLevel : r.ranklevel;
      var range = document.getElementById("range" + lv);
      var bonus = document.getElementById("bonus" + lv);
      if (range && r.rankName) range.textContent = r.rankName;
      if (bonus && r.bonusAmt != null) bonus.textContent = "RM" + r.bonusAmt;
    });
  }

  function setLoading(on) {
    var loading = document.getElementById("checkinLoadingSpinner");
    if (loading) loading.style.display = on ? "block" : "none";
  }

  function isSuccess(result) {
    if (!result) return false;
    var code = result.code;
    return (code === 0 || code === "0") && result.message === "SUCCESS";
  }

  function bindButton(state) {
    var btn = document.querySelector(".check-in-btn");
    if (!btn) return;
    var lang = getLangConfig();
    var userId = getUserId();

    if (!state || state.loingInd !== "Y" || userId === "0") {
      btn.disabled = false;
      btn.textContent = lang.checkinBtn;
      btn.onclick = function() {
        window.location.href = "#login";
      };
      return;
    }

    if (state.checkinInd === "Y") {
      btn.disabled = true;
      btn.textContent = lang.checkedinBtn;
      btn.onclick = null;
      return;
    }

    btn.disabled = false;
    btn.textContent = lang.checkinBtn;

    btn.onclick = async function() {
      try {
        btn.disabled = true;
        setLoading(true);

        var payload = JSON.stringify({ userId: userId });

        var resp = await fetch(CHECKIN_API_BASE + "/do?com=" + encodeURIComponent(VIP_COM), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: payload
        });

        var result = null;
        try {
          result = await resp.json();
        } catch (e) {
          result = null;
        }

        if (isSuccess(result) && result.data) {
          var d = result.data;
          updateBoxes(d.checkinDay);

          if (d.checkinInd === "Y") {
            saveLocalChecked(userId);
            btn.disabled = true;
            btn.textContent = lang.checkedinBtn;
          } else {
            btn.disabled = false;
            btn.textContent = lang.checkinBtn;
          }

          if (d.claimInd === "Y") {
            showAlert((d.promotTitle || "") + " " + lang.claimSuccess);
          } else {
            showAlert(lang.checkinSuccess);
          }
        } else {
          var code = result && result.code;
          var msg = result && result.message;

          if (msg === "REGULAR_MIN_DEPOSIT_NOT_MET" || code === "8" || code === 8) {
            btn.disabled = false;
            btn.textContent = lang.checkinBtn;
            showAlert(lang.checkinDeposit);
            await initCheckinFromApi();
          } else if (msg === "ALREADY_CHECKED_IN_TODAY") {
            saveLocalChecked(userId);
            await initCheckinFromApi();
          } else {
            btn.disabled = false;
            btn.textContent = lang.checkinBtn;
            showAlert(lang.checkinError);
          }
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = getLangConfig().checkinBtn;
        showAlert(getLangConfig().checkinError);
      } finally {
        setLoading(false);
      }
    };
  }

  async function initCheckinFromApi() {
    var userId = getUserId();

    if (userId === "0") {
      updateBoxes(0);
      bindButton({ loingInd: "N", checkinInd: "N" });
      return;
    }

    var url = CHECKIN_API_BASE + "/info?userId=" + encodeURIComponent(userId) + "&com=" + encodeURIComponent(VIP_COM);

    try {
      var resp = await fetch(url, { method: "GET", credentials: "include" });

      if (!resp.ok) {
        bindButton({ loingInd: "Y", checkinInd: hasLocalCheckedToday(userId) ? "Y" : "N" });
        return;
      }

      var result = await resp.json();

      if (isSuccess(result) && result.data) {
        var d = result.data;
        if (Array.isArray(d.rank)) fillRanks(d.rank);
        updateBoxes(d.checkinDay);
        bindButton(d);
      } else {
        bindButton({ loingInd: "Y", checkinInd: hasLocalCheckedToday(userId) ? "Y" : "N" });
      }
    } catch (err) {
      bindButton({ loingInd: "Y", checkinInd: hasLocalCheckedToday(userId) ? "Y" : "N" });
    }
  }

  window.openCheckinPopup = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    var popup = document.getElementById("checkin-popup");
    if (popup) popup.classList.add("open");
  };

  window.closePopup = function() {
    var popup = document.getElementById("checkin-popup");
    if (popup) popup.classList.remove("open");
  };

  window.showAlert = function(message) {
    var box = document.getElementById("customAlert");
    if (!box) return;
    var p = box.querySelector(".custom-alert-box-msg");
    if (p) p.textContent = message;
    box.style.display = "flex";
  };

  window.closeAlert = function() {
    var box = document.getElementById("customAlert");
    if (box) box.style.display = "none";
  };

  function boot() {
    applyStaticTexts();
    bindButton({ loingInd: "N", checkinInd: "N" });
    initCheckinFromApi();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

(function() {
  var VIP_COM = "com01";
  var VIP_API_BASE = "https://api-66.com/vip";

  var translationsVIP = {
    EN: {
      nextRank: function(amount) {
        return "RM" + amount + " to next rank";
      }
    },
    ZH: {
      nextRank: function(amount) {
        return "距离下一个等级还需 RM" + amount;
      }
    },
    MS: {
      nextRank: function(amount) {
        return "RM" + amount + " ke tahap seterusnya";
      }
    }
  };

  function getLangConfigVIP() {
    var key = (localStorage.getItem("LANGUAGE") || "EN").replace(/['"]/g, "");
    return translationsVIP[key] || translationsVIP.EN;
  }

  function getUserIdVIP() {
    try {
      var raw = localStorage.getItem("USER");
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (obj && obj.id) return obj.id;
      if (obj && obj.userId) return obj.userId;
      return null;
    } catch (e) {
      return null;
    }
  }

  function formatMoneyWithComma(v) {
    var num;
    if (v == null) return "0.00";
    if (typeof v === "number") {
      num = v;
    } else {
      var s = String(v).replace(/,/g, "").trim();
      if (!s) return "0.00";
      num = parseFloat(s);
      if (isNaN(num)) return "0.00";
    }
    var fixed = num.toFixed(2);
    return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function renderFallback(container) {
    container.innerHTML = "";
    var homeRank = document.createElement("div");
    homeRank.className = "home-rank";

    var left = document.createElement("div");
    left.className = "rank-left";
    var badge = document.createElement("div");
    badge.className = "rank-badge range0";
    badge.textContent = "REGULAR";
    left.appendChild(badge);

    var right = document.createElement("div");
    right.className = "rank-right";
    var p = document.createElement("p");
    p.className = "next-rank";
    p.textContent = "RM0.00 to next rank";
    var out = document.createElement("div");
    out.className = "user-rank-out";
    var inner = document.createElement("div");
    inner.className = "user-rank-in";
    inner.style.width = "0%";
    out.appendChild(inner);

    right.appendChild(p);
    right.appendChild(out);
    homeRank.appendChild(left);
    homeRank.appendChild(right);

    badge.addEventListener("click", function(e) {
      e.stopPropagation();
      window.location.href = "/vip";
    });

    container.appendChild(homeRank);
  }

  async function initUserRank() {
    var container = document.querySelector(".user-rank-wrapper");
    if (!container) return;

    var userId = getUserIdVIP();
    if (!userId) return;

    var lang = getLangConfigVIP();
    var url = VIP_API_BASE + "/profile?userId=" + encodeURIComponent(userId) + "&com=" + encodeURIComponent(VIP_COM);

    var resp;
    try {
      resp = await fetch(url, { method: "GET", credentials: "include" });
    } catch (e) {
      renderFallback(container);
      return;
    }

    if (!resp.ok) {
      renderFallback(container);
      return;
    }

    var json;
    try {
      json = await resp.json();
    } catch (e) {
      renderFallback(container);
      return;
    }

    var data = json && json.data ? json.data : json;
    if (!data) {
      renderFallback(container);
      return;
    }

    var levelNum = Number(data.levelNum || 0);
    if (!isFinite(levelNum) || levelNum < 0) levelNum = 0;
    if (levelNum > 9) levelNum = 9;

    var vipLevel = data.vipLevel || "REGULAR";

    var nextTo = data.nextLevelDepositTo || data.nextLevelDeposit || data.nextDeposit || 0;
    var percent = data.nextLevelDepositPercent || "0%";

    nextTo = formatMoneyWithComma(nextTo);

    container.innerHTML = "";

    var homeRank = document.createElement("div");
    homeRank.className = "home-rank";

    var left = document.createElement("div");
    left.className = "rank-left";
    var badge = document.createElement("div");
    badge.className = "rank-badge range" + levelNum;
    badge.textContent = vipLevel;
    left.appendChild(badge);

    var right = document.createElement("div");
    right.className = "rank-right";
    var p = document.createElement("p");
    p.className = "next-rank";
    p.textContent = lang.nextRank(nextTo);
    var out = document.createElement("div");
    out.className = "user-rank-out";
    var inner = document.createElement("div");
    inner.className = "user-rank-in";
    inner.style.width = percent;
    out.appendChild(inner);

    right.appendChild(p);
    right.appendChild(out);
    homeRank.appendChild(left);
    homeRank.appendChild(right);

    badge.addEventListener("click", function(e) {
      e.stopPropagation();
      window.location.href = "/vip";
    });

    container.appendChild(homeRank);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUserRank);
  } else {
    initUserRank();
  }
})();
