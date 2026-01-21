window.__MGI_SETTINGS_VER__ = "20260121";

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
