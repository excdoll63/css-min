window.__MGI_LOGIN_VER__="20260120";

(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn, { once: true });
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

  function getLang() {
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
    return 'EN';
  }

  var dict = {
    EN: { dont_have_account: "Don’t have an account?", forgot_password: "Forgot Your Password?", remember_me: "Remember Me" },
    ZH: { dont_have_account: "还没有账号？", forgot_password: "忘记密码？", remember_me: "记住我" },
    MS: { dont_have_account: "Belum ada akaun?", forgot_password: "Lupa Kata Laluan?", remember_me: "Ingat Saya" },
    TH: { dont_have_account: "ยังไม่มีบัญชี?", forgot_password: "ลืมรหัสผ่าน?", remember_me: "จดจำฉัน" },
    VN: { dont_have_account: "Chưa có tài khoản?", forgot_password: "Quên mật khẩu?", remember_me: "Ghi nhớ tôi" },
    ID: { dont_have_account: "Belum punya akun?", forgot_password: "Lupa kata sandi?", remember_me: "Ingat Saya" }
  };

  function applyI18n(root) {
    if (!root) return;
    var lang = getLang();
    var t = dict[lang] || dict.EN;
    var nodes = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (t[key]) nodes[i].textContent = t[key];
    }
  }

  function safeGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function safeSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }
  function safeRemove(k) {
    try { localStorage.removeItem(k); } catch (e) {}
  }

  function filled(el) {
    return !!el && (el.value || '').trim().length > 0;
  }

  function bindLogin(root) {
    if (!root) return;
    if (root.getAttribute('data-mgi-login-bound') === '1') return;
    root.setAttribute('data-mgi-login-bound', '1');

    applyI18n(root);

    var eye = root.querySelector('.show-pass-icon');
    var passInput = root.querySelector('#loginPass');
    if (eye && passInput) {
      eye.addEventListener('click', function (e) {
        e.preventDefault();
        var isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';
        if (eye.classList) {
          eye.classList.toggle('fa-eye', !isPassword);
          eye.classList.toggle('fa-eye-slash', isPassword);
        }
      });
    }

    var remember = root.querySelector('#rememberMe');
    var mobileInput = root.querySelector('input[name="mobile"]');
    var passField = root.querySelector('input[name="password"]');
    var loginBtn = root.querySelector('.btn.login');

    var KEY_FLAG = 'mgi_remember_me';
    var KEY_MOBILE = 'mgi_remember_mobile';

    function updateBtn() {
      if (!mobileInput || !passField || !loginBtn) return;
      var ok = filled(mobileInput) && filled(passField);
      if (ok) {
        loginBtn.classList.add('active');
        loginBtn.setAttribute('aria-disabled', 'false');
      } else {
        loginBtn.classList.remove('active');
        loginBtn.setAttribute('aria-disabled', 'true');
      }
    }

    function persistRemember() {
      if (!remember || !mobileInput) return;
      if (remember.checked) {
        safeSet(KEY_FLAG, '1');
        var v = (mobileInput.value || '').trim();
        if (v) safeSet(KEY_MOBILE, v);
      } else {
        safeRemove(KEY_FLAG);
        safeRemove(KEY_MOBILE);
      }
    }

    if (remember && mobileInput) {
      if (safeGet(KEY_FLAG) === '1') {
        remember.checked = true;
        var savedMobile = safeGet(KEY_MOBILE);
        if (savedMobile) mobileInput.value = savedMobile;
      }
      remember.addEventListener('change', function () {
        persistRemember();
        updateBtn();
      });
      mobileInput.addEventListener('blur', function () {
        persistRemember();
        updateBtn();
      });
    }

    if (mobileInput) {
      mobileInput.addEventListener('input', updateBtn);
      mobileInput.addEventListener('blur', updateBtn);
    }
    if (passField) {
      passField.addEventListener('input', updateBtn);
      passField.addEventListener('blur', updateBtn);
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', function (e) {
        if (!loginBtn.classList.contains('active')) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    updateBtn();
  }

  function tryBind() {
    var root = document.getElementById('login');
    if (root) bindLogin(root);
  }

  function watchLoginRoot() {
    tryBind();

    var raf = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };
    var scheduled = false;

    function schedule() {
      if (scheduled) return;
      scheduled = true;
      raf(function () {
        scheduled = false;
        tryBind();
      });
    }

    if (window.MutationObserver && document.documentElement) {
      var obs = new MutationObserver(schedule);
      obs.observe(document.documentElement, { childList: true, subtree: true });
    } else {
      var tries = 0;
      var t = setInterval(function () {
        tries++;
        tryBind();
        if (document.getElementById('login') || tries > 40) clearInterval(t);
      }, 250);
    }

    if (window.MutationObserver && document.body) {
      var obsClass = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'class') {
            var root = document.getElementById('login');
            if (root) applyI18n(root);
            break;
          }
        }
      });
      obsClass.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }

  onReady(watchLoginRoot);
})();
