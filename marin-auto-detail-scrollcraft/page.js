/* ============================================================
   Marin Auto Detail — Scrollcraft test build · page layer JS
   Owns: the split divider + Inspection Light beam (driven by the
   engine's --sc-p), the packed-mirror asset swap, the booking form.
   The engine owns everything else.
   ============================================================ */
(function () {
  'use strict';

  var mqMobile = window.matchMedia('(max-width: 860px)');
  var mqFine = window.matchMedia('(pointer: fine)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MIRROR = !!window.__SC_MIRROR;

  var canvas = document.getElementById('washCanvas');

  /* ---------- packed mirror: decode frames before the engine mounts ----------
     The GitHub connector only carries text, so in the mirror build the WebP
     frames travel as base64 inside js/pack-*.js (window.SC_PACK). We swap
     every <img> to a Blob URL and paint the wash canvas ourselves, because
     the engine's sequence loader fetches files that do not exist there. */
  var mirrorFrames = null; // [HTMLImageElement] for the wash painter

  function b64ToBlobUrl(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: 'image/webp' }));
  }

  /* Pack format: window.SC_PACK = { "poster.webp": b64, "d001".."d071": b64,
     "m001".."m071": b64 } — d = desktop frame set, m = mobile frame set. */
  function prepareMirror() {
    var pack = window.SC_PACK;
    var urls = {};
    Object.keys(pack).forEach(function (k) { urls[k] = b64ToBlobUrl(pack[k]); });
    var set = mqMobile.matches ? 'm' : 'd';

    // Swap every content image to the Blob URL of this viewport's frame set.
    Array.prototype.forEach.call(document.querySelectorAll('img'), function (img) {
      var base = (img.getAttribute('src') || '').split('/').pop();
      if (base === 'poster.webp') { img.src = urls['poster.webp']; return; }
      var m = base.match(/^f(\d{3})\.webp$/);
      if (m && urls[set + m[1]]) img.src = urls[set + m[1]];
    });

    // The wash sequence: hand-painted from the decoded set.
    mirrorFrames = [];
    for (var n = 1; n <= 71; n++) {
      var img = new Image();
      var u = urls[set + ('00' + n).slice(-3)];
      if (u) img.src = u;
      mirrorFrames.push(img);
    }
    if (canvas) canvas.removeAttribute('data-sc-sequence');
  }

  if (MIRROR) {
    window.__SC_DEFER_MOUNT = true;
    window.__SC_MOUNT = function () {
      // Load only this viewport's pack files, in order, then decode + mount.
      var set = mqMobile.matches ? 'm' : 'd';
      var count = (window.__SC_PACKS || {})[set] || 0;
      var chain = Promise.resolve();
      for (var i = 1; i <= count; i++) {
        (function (src) {
          chain = chain.then(function () {
            return new Promise(function (res, rej) {
              var s = document.createElement('script');
              s.src = src; s.onload = res; s.onerror = rej;
              document.head.appendChild(s);
            });
          });
        })('js/pack-' + set + '-' + i + '.js');
      }
      chain.then(function () {
        prepareMirror();
        ScrollCraft.mount(document.body);
        start();
      }).catch(function () {
        // A pack failed: use whatever arrived, mount anyway, never hang.
        if (window.SC_PACK) prepareMirror();
        else if (canvas) canvas.removeAttribute('data-sc-sequence');
        ScrollCraft.mount(document.body);
        start();
      });
    };
  } else {
    // Canonical build: point the engine's sequence loader at the right set.
    if (canvas) {
      if (reduced) canvas.removeAttribute('data-sc-sequence');
      else if (mqMobile.matches) {
        canvas.setAttribute('data-sc-sequence', 'assets/frames-mobile/f{iii}.webp:71:1');
      }
    }
    // The inline bootstrap mounts right after the engine script; start on load.
    window.addEventListener('load', start);
  }

  /* ---------- divider + beam, driven by the engine's --sc-p ---------- */

  function actP(act) {
    var v = parseFloat(act.style.getPropertyValue('--sc-p'));
    return isNaN(v) ? 0 : v;
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  var splitActs = Array.prototype.slice.call(document.querySelectorAll('.split-act'));
  var peakAct = document.querySelector('.act-peak');
  var peakStage = peakAct ? peakAct.querySelector('.stage-peak') : null;
  var peakMedia = peakStage ? peakStage.querySelector('.peak-media') : null;

  var dragging = false, dragBeam = null, shownBeam = 8;

  function scrollBeam() {
    var from = parseFloat(peakAct.getAttribute('data-div-from'));
    var to = parseFloat(peakAct.getAttribute('data-div-to'));
    return from + (to - from) * actP(peakAct);
  }

  function applyAct(act) {
    var stage = act.querySelector('.split-stage');
    if (!stage) return;
    var from = parseFloat(act.getAttribute('data-div-from'));
    var to = parseFloat(act.getAttribute('data-div-to'));
    if (act === peakAct) {
      var target = dragging && dragBeam !== null ? dragBeam : scrollBeam();
      shownBeam += (target - shownBeam) * (dragging ? 0.4 : 0.12);
      if (Math.abs(target - shownBeam) < 0.05) shownBeam = target;
      stage.style.setProperty('--beam', shownBeam.toFixed(2) + '%');
      stage.setAttribute('data-sc-verify-state',
        'beam:' + Math.round(shownBeam) + (dragging ? ':drag' : ''));
    } else {
      var v = from + (to - from) * actP(act);
      stage.style.setProperty('--div', v.toFixed(2) + '%');
    }
  }

  /* Mirror wash painter: cover-fit the current frame into the canvas. */
  var lastFrame = -1;
  function paintWash() {
    if (!mirrorFrames || !canvas) return;
    var washAct = canvas.closest('[data-sc-act]');
    var idx = clamp(Math.round(actP(washAct) * 70), 0, 70);
    if (idx === lastFrame) return;
    var img = mirrorFrames[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    var box = canvas.getBoundingClientRect();
    if (!box.width) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    var W = Math.round(box.width * dpr), H = Math.round(box.height * dpr);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    var ctx = canvas.getContext('2d');
    var s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    var dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    lastFrame = idx;
  }

  function start() {
    if (reduced) {
      // Frozen composition: every act rests at its resolved end state.
      splitActs.forEach(function (act) {
        var stage = act.querySelector('.split-stage');
        if (!stage) return;
        var to = parseFloat(act.getAttribute('data-div-to'));
        if (act === peakAct) {
          stage.style.setProperty('--beam', to + '%');
          stage.setAttribute('data-sc-verify-state', 'beam:' + Math.round(to));
        } else {
          stage.style.setProperty('--div', to + '%');
        }
      });
      return;
    }

    (function loop() {
      splitActs.forEach(applyAct);
      paintWash();
      requestAnimationFrame(loop);
    })();

    /* The Inspection Light can be dragged on fine pointers. */
    if (peakStage && peakMedia && mqFine.matches) {
      var hit = function (e) {
        return e.target.closest('.peak-media') || e.target.closest('.beam');
      };
      peakStage.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch' || !hit(e)) return;
        dragging = true; dragBeam = beamFromEvent(e);
        peakStage.setPointerCapture(e.pointerId);
      });
      peakStage.addEventListener('pointermove', function (e) {
        if (dragging) dragBeam = beamFromEvent(e);
      });
      ['pointerup', 'pointercancel'].forEach(function (type) {
        peakStage.addEventListener(type, function () { dragging = false; dragBeam = null; });
      });
    }
  }

  function beamFromEvent(e) {
    var r = peakMedia.getBoundingClientRect();
    if (mqMobile.matches) return clamp((e.clientY - r.top) / r.height * 100, 0, 100);
    return clamp((e.clientX - r.left) / r.width * 100, 0, 100);
  }

  /* ---------- booking form (same behavior as the current pilot) ---------- */

  var form = document.getElementById('bookForm');
  if (form) {
    var fields = document.getElementById('formFields');
    var success = document.getElementById('formSuccess');
    var successText = document.getElementById('successText');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('fName');
      var phone = document.getElementById('fPhone');
      var service = document.getElementById('fService');
      var ok = true;
      [[name, name.value.trim().length >= 2],
       [phone, phone.value.replace(/\D/g, '').length >= 7],
       [service, !!service.value]].forEach(function (pair) {
        var bad = !pair[1];
        pair[0].setAttribute('aria-invalid', bad ? 'true' : 'false');
        pair[0].style.borderColor = bad ? '#E4572E' : '';
        if (bad) ok = false;
      });
      if (!ok) return;
      var first = name.value.trim().split(/\s+/)[0];
      successText.textContent = 'Thanks, ' + first + '. We will call ' +
        phone.value.trim() + ' shortly to confirm your slot for: ' + service.value + '.';
      fields.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
    document.getElementById('bookAnother').addEventListener('click', function () {
      form.reset();
      success.hidden = true;
      fields.hidden = false;
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
