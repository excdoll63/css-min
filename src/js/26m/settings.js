window.__26M_SETTINGS_VER__ = "20260220";

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  }

  function getUserSafe() {
    var user = {};
    try {
      if (typeof User !== 'undefined' && User && typeof User.toJSON === 'function') {
        user = User.toJSON() || {};
      } else if (window.User && typeof window.User === 'object') {
        user = window.User || {};
      }
    } catch (e) {
      user = {};
    }
    return user && typeof user === 'object' ? user : {};
  }

  function parseBankSafe(raw) {
    var bank = {};
    try {
      if (typeof raw === 'string') {
        var s = raw.trim();
        bank = s ? JSON.parse(s) : {};
      } else if (raw && typeof raw === 'object') {
        bank = raw;
      }
    } catch (e) {
      bank = {};
    }
    return bank && typeof bank === 'object' ? bank : {};
  }

  function findBankName(bank, banks) {
    var name = '-';
    if (bank && bank.bank) {
      var code = bank.bank;
      if (isArray(banks)) {
        for (var i = 0; i < banks.length; i++) {
          var item = banks[i];
          if (item && item.code === code) {
            name = item.name ? item.name : code;
            return name;
          }
        }
      }
      name = code;
    }
    return name;
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (!el) return;
    var out = val;
    if (out === undefined || out === null || out === '') out = '-';
    el.textContent = out;
  }

  function hasUserObj() {
    try {
      if (typeof User !== 'undefined' && User) return true;
      if (window.User && typeof window.User === 'object') return true;
    } catch (e) {}
    return false;
  }

  function populate() {
    var user = getUserSafe();
    var bank = parseBankSafe(user.bank);
    var banks = isArray(user.banks) ? user.banks : [];
    var bankName = findBankName(bank, banks);

    setText('username', user.username);
    setText('name', user.name);
    setText('phone', user.mobile);

    var cash = user.cash;
    var walletText = '-';
    if (cash !== undefined && cash !== null && String(cash).trim() !== '') {
      walletText = 'RM' + cash;
    }
    setText('walletBalance', walletText);

    setText('bankName', bankName);
    setText('bankAccName', bank.bankAccountName);
    setText('bankAccNumber', bank.bankAccountNumber);
  }

  function init() {
    var root = document.getElementById('settings');
    if (!root) return;

    var tries = 0;
    function tick() {
      tries++;
      populate();
      if (!hasUserObj() && tries < 12) {
        setTimeout(tick, 300);
      }
    }
    tick();
  }

  ready(init);
})();

(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  function safeGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }

  function normLang(raw) {
    var s = (raw || '').toLowerCase();
    if (!s) return '';
    if (s.indexOf('zh') === 0) return 'ZH';
    if (s.indexOf('ms') === 0) return 'MS';
    if (s.indexOf('th') === 0) return 'TH';
    if (s.indexOf('vi') === 0) return 'VN';
    if (s.indexOf('vn') === 0) return 'VN';
    if (s.indexOf('id') === 0) return 'ID';
    if (s.indexOf('en') === 0) return 'EN';
    return '';
  }

  function getLangFromPage() {
    var htmlLang = document.documentElement ? document.documentElement.getAttribute('lang') : '';
    var byHtml = normLang(htmlLang);
    if (byHtml) return byHtml;

    var cls = document.body && document.body.className ? document.body.className : '';
    var m = cls.match(/(?:^|\s)(EN|ZH|MS|TH|VN|VI|ID)(?=\s|$)/i);
    if (m) {
      var code = (m[1] || 'EN').toUpperCase();
      if (code === 'VI') code = 'VN';
      return code;
    }

    var ls = normLang(safeGet('LANGUAGE'));
    if (ls) return ls;

    return 'EN';
  }

  var dict = {
    EN: {
      settings_profile: 'PROFILE',
      settings_username: 'Username',
      settings_name: 'Name',
      settings_phone: 'Phone Number',
      settings_wallet_balance: 'Wallet Balance',
      settings_bank_name: 'Bank Name',
      settings_bank_acc_name: 'Bank Account Name',
      settings_bank_acc_number: 'Bank Account Number',
      settings_change_password: 'Change Password',
      settings_language: 'Language',
      settings_report_problem: 'Report Problem',
      settings_logout: 'Logout'
    },
    ZH: {
      settings_profile: '个人资料',
      settings_username: '账号',
      settings_name: '名字',
      settings_phone: '手机号码',
      settings_wallet_balance: '钱包余额',
      settings_bank_name: '银行名称',
      settings_bank_acc_name: '银行账户名称',
      settings_bank_acc_number: '银行户口号码',
      settings_change_password: '修改密码',
      settings_language: '语言',
      settings_report_problem: '报告问题',
      settings_logout: '退出'
    },
    MS: {
      settings_profile: 'PROFIL',
      settings_username: 'Nama Pengguna',
      settings_name: 'Nama',
      settings_phone: 'Nombor Telefon',
      settings_wallet_balance: 'Baki Dompet',
      settings_bank_name: 'Nama Bank',
      settings_bank_acc_name: 'Nama Akaun Bank',
      settings_bank_acc_number: 'Nombor Akaun Bank',
      settings_change_password: 'Tukar Kata Laluan',
      settings_language: 'Bahasa',
      settings_report_problem: 'Laporkan Masalah',
      settings_logout: 'Keluar'
    },
    TH: {
      settings_profile: 'โปรไฟล์',
      settings_username: 'ชื่อผู้ใช้',
      settings_name: 'ชื่อ',
      settings_phone: 'หมายเลขโทรศัพท์',
      settings_wallet_balance: 'ยอดคงเหลือกระเป๋าเงิน',
      settings_bank_name: 'ชื่อธนาคาร',
      settings_bank_acc_name: 'ชื่อบัญชีธนาคาร',
      settings_bank_acc_number: 'เลขที่บัญชีธนาคาร',
      settings_change_password: 'เปลี่ยนรหัสผ่าน',
      settings_language: 'ภาษา',
      settings_report_problem: 'รายงานปัญหา',
      settings_logout: 'ออกจากระบบ'
    },
    VN: {
      settings_profile: 'Hồ sơ',
      settings_username: 'Tên người dùng',
      settings_name: 'Tên',
      settings_phone: 'Số điện thoại',
      settings_wallet_balance: 'Số dư ví',
      settings_bank_name: 'Tên ngân hàng',
      settings_bank_acc_name: 'Tên tài khoản ngân hàng',
      settings_bank_acc_number: 'Số tài khoản ngân hàng',
      settings_change_password: 'Đổi mật khẩu',
      settings_language: 'Ngôn ngữ',
      settings_report_problem: 'Báo cáo sự cố',
      settings_logout: 'Đăng xuất'
    },
    ID: {
      settings_profile: 'PROFIL',
      settings_username: 'Nama Pengguna',
      settings_name: 'Nama',
      settings_phone: 'Nomor Telepon',
      settings_wallet_balance: 'Saldo Dompet',
      settings_bank_name: 'Nama Bank',
      settings_bank_acc_name: 'Nama Rekening Bank',
      settings_bank_acc_number: 'Nomor Rekening Bank',
      settings_change_password: 'Ubah Kata Sandi',
      settings_language: 'Bahasa',
      settings_report_problem: 'Laporkan Masalah',
      settings_logout: 'Keluar'
    }
  };

  function isProfileItem(el) {
    if (!el || el.nodeType !== 1) return false;
    var cls = el.className || '';
    return (' ' + cls + ' ').indexOf(' profile-item ') !== -1;
  }

  function ensureProfileLabel(valueId, key) {
    var v = document.getElementById(valueId);
    if (!v) return;

    var item = v;
    while (item && item.nodeType === 1 && !isProfileItem(item)) {
      item = item.parentNode;
    }
    if (!item || item.nodeType !== 1) return;

    var label = item.querySelector ? item.querySelector('.label') : null;
    if (!label) return;

    if (label.getAttribute('data-i18n') !== key) {
      label.setAttribute('data-i18n', key);
    }
  }

  function ensureActionSpan(root, selector, key) {
    if (!root) return;
    var a = root.querySelector(selector);
    if (!a) return;

    var existed = a.querySelector('span[data-i18n="' + key + '"]');
    if (existed) return;

    var labelText = (a.textContent || '').replace(/\s+/g, ' ').trim();

    for (var i = a.childNodes.length - 1; i >= 0; i--) {
      var n = a.childNodes[i];
      if (n && n.nodeType === 3) a.removeChild(n);
    }

    var span = document.createElement('span');
    span.setAttribute('data-i18n', key);
    if (labelText) span.textContent = labelText;

    var icon = a.querySelector('i');
    if (icon && icon.parentNode === a) {
      var space = document.createTextNode(' ');
      if (icon.nextSibling) a.insertBefore(space, icon.nextSibling);
      else a.appendChild(space);

      if (space.nextSibling) a.insertBefore(span, space.nextSibling);
      else a.appendChild(span);
    } else {
      a.appendChild(span);
    }
  }

  function ensureI18nMarkers(root) {
    if (!root) return;

    var title = root.querySelector('.profile-box .title');
    if (title && title.getAttribute('data-i18n') !== 'settings_profile') {
      title.setAttribute('data-i18n', 'settings_profile');
    }

    ensureProfileLabel('username', 'settings_username');
    ensureProfileLabel('name', 'settings_name');
    ensureProfileLabel('phone', 'settings_phone');
    ensureProfileLabel('walletBalance', 'settings_wallet_balance');
    ensureProfileLabel('bankName', 'settings_bank_name');
    ensureProfileLabel('bankAccName', 'settings_bank_acc_name');
    ensureProfileLabel('bankAccNumber', 'settings_bank_acc_number');

    ensureActionSpan(root, '.settings-grid a[href="#changePassword"]', 'settings_change_password');
    ensureActionSpan(root, '.settings-grid a.change-language', 'settings_language');
    ensureActionSpan(root, '.settings-grid a.report-btn', 'settings_report_problem');
    ensureActionSpan(root, '.settings-grid a[href="#logout"]', 'settings_logout');
  }

  function applyI18n(root) {
    if (!root) return;
    ensureI18nMarkers(root);

    var lang = getLangFromPage();
    var t = dict[lang] || dict.EN;

    var nodes = root.querySelectorAll ? root.querySelectorAll('[data-i18n]') : [];
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (t[key] && nodes[i].textContent !== t[key]) nodes[i].textContent = t[key];
    }
  }

  function raf(fn) {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(fn);
    } else {
      setTimeout(fn, 16);
    }
  }

  function watchSettingsI18n() {
    var scheduled = false;

    function scheduleApply() {
      if (scheduled) return;
      scheduled = true;
      raf(function () {
        scheduled = false;
        var root = document.getElementById('settings');
        if (root) applyI18n(root);
      });
    }

    scheduleApply();

    if (!window.MutationObserver) return;

    if (document.body && document.body.getAttribute('data-mgi-settings-i18n') !== '1') {
      document.body.setAttribute('data-mgi-settings-i18n', '1');

      var obs = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].type === 'attributes') {
            scheduleApply();
            break;
          }
        }
      });

      if (document.body) obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      if (document.documentElement) obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }

    if (document.body && document.body.getAttribute('data-mgi-settings-watch') !== '1') {
      document.body.setAttribute('data-mgi-settings-watch', '1');

      var obs2 = new MutationObserver(function () {
        scheduleApply();
      });

      obs2.observe(document.body, { childList: true, subtree: true });
    }
  }

  onReady(watchSettingsI18n);
})();
