window.__26M_REGISTER_VER__ = '20260219';

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
    EN: { already_have_account: 'Already have account?', login_here: 'Login Here' },
    ZH: { already_have_account: '已有账号？', login_here: '登入' },
    MS: { already_have_account: 'Sudah ada akaun?', login_here: 'Log Masuk Sini' },
    TH: { already_have_account: 'มีบัญชีแล้ว?', login_here: 'เข้าสู่ระบบที่นี่' },
    VN: { already_have_account: 'Đã có tài khoản?', login_here: 'Đăng nhập tại đây' },
    ID: { already_have_account: 'Sudah punya akun?', login_here: 'Masuk di sini' }
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

  function bindRegister(root) {
    if (!root) return;
    if (root.getAttribute('data-mgi-register-bound') === '1') return;
    root.setAttribute('data-mgi-register-bound', '1');

    applyI18n(root);

    var eye = root.querySelector('.show-pass-icon');
    var passInput = root.querySelector('#regPass');
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
  }

  function tryBind() {
    var root = document.getElementById('register');
    if (root) bindRegister(root);
  }

  function watchRegisterRoot() {
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

    if (window.MutationObserver) {
      try {
        var domObs = new MutationObserver(function () { schedule(); });
        domObs.observe(document.documentElement, { childList: true, subtree: true });

        if (document.body) {
          var classObs = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
              if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'class') {
                var r = document.getElementById('register');
                if (r) applyI18n(r);
                break;
              }
            }
          });
          classObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        }
      } catch (e) {}
    }
  }

  onReady(watchRegisterRoot);
})();
