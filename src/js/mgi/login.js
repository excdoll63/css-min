(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var root = document.getElementById('login');
    if (!root) return;

    var mobileInput = root.querySelector('input[name="mobile"]');
    var passInput = root.querySelector('input[name="password"]');
    var eye = root.querySelector('.show-pass-icon');
    var remember = root.querySelector('#rememberMe');
    var loginBtn = root.querySelector('.btn.login');

    if (eye && passInput) {
      eye.addEventListener('click', function (e) {
        if (e && e.preventDefault) e.preventDefault();
        var isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';
        if (eye.classList) {
          eye.classList.toggle('fa-eye', !isPassword);
          eye.classList.toggle('fa-eye-slash', isPassword);
        }
      });
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
      var htmlLang = document.documentElement && document.documentElement.getAttribute
        ? document.documentElement.getAttribute('lang')
        : '';
      var byHtml = normLang(htmlLang);
      if (byHtml) return byHtml;

      var cls = document.body && typeof document.body.className === 'string' ? document.body.className : '';
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

    function applyI18n() {
      var lang = getLang();
      var t = dict[lang] || dict.EN;
      var nodes = root.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var key = nodes[i].getAttribute('data-i18n');
        if (t[key]) nodes[i].textContent = t[key];
      }
    }

    applyI18n();

    if (window.MutationObserver && document.body) {
      var obs = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'class') {
            applyI18n();
            break;
          }
        }
      });
      obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    var KEY_FLAG = 'mgi_remember_me';
    var KEY_MOBILE = 'mgi_remember_mobile';

    function safeGet(k) {
      try { return localStorage.getItem(k); } catch (e) { return null; }
    }

    function safeSet(k, v) {
      try { localStorage.setItem(k, v); } catch (e) {}
    }

    function safeRemove(k) {
      try { localStorage.removeItem(k); } catch (e) {}
    }

    function restoreRemember() {
      if (!remember || !mobileInput) return;
      if (safeGet(KEY_FLAG) === '1') {
        remember.checked = true;
        var savedMobile = safeGet(KEY_MOBILE);
        if (savedMobile) mobileInput.value = savedMobile;
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

    function filled(el) {
      return !!(el && (el.value || '').trim().length);
    }

    function update() {
      if (!mobileInput || !passInput || !loginBtn) return;
      var ok = filled(mobileInput) && filled(passInput);
      if (ok) {
        loginBtn.classList.add('active');
        loginBtn.setAttribute('aria-disabled', 'false');
      } else {
        loginBtn.classList.remove('active');
        loginBtn.setAttribute('aria-disabled', 'true');
      }
    }

    restoreRemember();
    update();

    if (remember) {
      remember.addEventListener('change', function () {
        persistRemember();
        update();
      });
    }

    if (mobileInput) {
      mobileInput.addEventListener('blur', function () {
        persistRemember();
        update();
      });
      mobileInput.addEventListener('input', function () {
        if (remember && remember.checked) persistRemember();
        update();
      });
    }

    if (passInput) {
      passInput.addEventListener('input', update);
      passInput.addEventListener('blur', update);
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', function (e) {
        if (!loginBtn.classList.contains('active')) {
          if (e && e.preventDefault) e.preventDefault();
          if (e && e.stopPropagation) e.stopPropagation();
        }
      });
    }
  });
})();
