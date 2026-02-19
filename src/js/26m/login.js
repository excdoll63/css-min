window.__26M_LOGIN_VER__ = "20260219";

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
    var lang = getLangFromPage();
    var t = dict[lang] || dict.EN;
    var nodes = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (t[key]) nodes[i].textContent = t[key];
    }
  }

  function observeLangChanges(root) {
    if (!window.MutationObserver || !document.body) return;
    if (document.body.getAttribute('data-mgi-login-i18n') === '1') return;
    document.body.setAttribute('data-mgi-login-i18n', '1');

    var obs = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'class') {
          applyI18n(root);
          break;
        }
      }
    });

    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
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

  function restoreRememberMe(root) {
    var remember = root.querySelector('#rememberMe');
    var mobileInput = root.querySelector('input[name="mobile"]');
    if (!remember || !mobileInput) return;

    var KEY_FLAG = 'mgi_remember_me';
    var KEY_MOBILE = 'mgi_remember_mobile';

    if (safeGet(KEY_FLAG) === '1') {
      remember.checked = true;
      var savedMobile = safeGet(KEY_MOBILE);
      if (savedMobile) mobileInput.value = savedMobile;
    }
  }

  function persistRememberMe(root) {
    var remember = root.querySelector('#rememberMe');
    var mobileInput = root.querySelector('input[name="mobile"]');
    if (!remember || !mobileInput) return;

    var KEY_FLAG = 'mgi_remember_me';
    var KEY_MOBILE = 'mgi_remember_mobile';

    if (remember.checked) {
      safeSet(KEY_FLAG, '1');
      var v = (mobileInput.value || '').trim();
      if (v) safeSet(KEY_MOBILE, v);
    } else {
      safeRemove(KEY_FLAG);
      safeRemove(KEY_MOBILE);
    }
  }

  function bindRememberMe(root) {
    var remember = root.querySelector('#rememberMe');
    var mobileInput = root.querySelector('input[name="mobile"]');
    if (!remember || !mobileInput) return;

    if (remember.getAttribute('data-mgi-bound') === '1') return;
    remember.setAttribute('data-mgi-bound', '1');

    remember.addEventListener('change', function () { persistRememberMe(root); });
    mobileInput.addEventListener('blur', function () { persistRememberMe(root); });
  }

  function updateActiveButton(root) {
    var mobileInput = root.querySelector('input[name="mobile"]');
    var passInput = root.querySelector('input[name="password"]');
    var loginBtn = root.querySelector('.btn.login');
    if (!mobileInput || !passInput || !loginBtn) return;

    function filled(el) {
      return (el.value || '').trim().length > 0;
    }

    var ok = filled(mobileInput) && filled(passInput);
    if (ok) {
      loginBtn.classList.add('active');
      loginBtn.setAttribute('aria-disabled', 'false');
    } else {
      loginBtn.classList.remove('active');
      loginBtn.setAttribute('aria-disabled', 'true');
    }
  }

  function bindPasswordToggle(root) {
    var eye = root.querySelector('.show-pass-icon');
    var passInput = root.querySelector('#loginPass');
    if (!eye || !passInput) return;

    if (eye.getAttribute('data-mgi-bound') === '1') return;
    eye.setAttribute('data-mgi-bound', '1');

    eye.addEventListener('click', function (e) {
      e.preventDefault();
      var isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';

      if (eye.classList) {
        if (isPassword) {
          eye.classList.remove('fa-eye');
          eye.classList.add('fa-eye-slash');
        } else {
          eye.classList.remove('fa-eye-slash');
          eye.classList.add('fa-eye');
        }
      }
    });
  }

  function bindAll(root) {
    if (!root) return;
    if (root.getAttribute('data-mgi-login-bound') === '1') return;
    root.setAttribute('data-mgi-login-bound', '1');

    applyI18n(root);
    observeLangChanges(root);

    restoreRememberMe(root);
    bindRememberMe(root);

    bindPasswordToggle(root);

    updateActiveButton(root);

    var mobileInput = root.querySelector('input[name="mobile"]');
    var passInput = root.querySelector('input[name="password"]');
    var loginBtn = root.querySelector('.btn.login');

    function onChange() { updateActiveButton(root); }

    if (mobileInput) {
      mobileInput.addEventListener('input', onChange);
      mobileInput.addEventListener('blur', onChange);
    }

    if (passInput) {
      passInput.addEventListener('input', onChange);
      passInput.addEventListener('blur', onChange);
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', function (e) {
        if (!loginBtn.classList.contains('active')) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }
  }

  function watchLoginRoot() {
    var root = document.getElementById('login');
    if (root) bindAll(root);

    if (!window.MutationObserver || !document.body) return;
    if (document.body.getAttribute('data-mgi-login-watch') === '1') return;
    document.body.setAttribute('data-mgi-login-watch', '1');

    var obs = new MutationObserver(function () {
      var r = document.getElementById('login');
      if (r) bindAll(r);
    });

    obs.observe(document.body, { childList: true, subtree: true });
  }

  onReady(watchLoginRoot);
})();
