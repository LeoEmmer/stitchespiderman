/* ============================================================
   Stack House — ELITE pilot machinery
   Lenis smooth scroll + GSAP ScrollTrigger pin/scrub
   Receita B: frame sequence on canvas (mobile-safe)
   - Desktop: assets/frames/        120 frames · 1280px · ~1.6 MB
   - Mobile:  assets/frames-mobile/ 120 frames ·  720px · ~0.7 MB
   ============================================================ */
(function () {
  "use strict";

  var FRAME_COUNT = 82;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasLibs = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && typeof Lenis !== "undefined";

  /* ---------- booking form + footer year (works in every mode) ---------- */
  function initForm() {
    var form = document.getElementById("bookForm");
    if (!form) return;
    var fields = document.getElementById("formFields");
    var success = document.getElementById("formSuccess");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("fName");
      var phone = document.getElementById("fPhone");
      var service = document.getElementById("fService");
      var ok = true;
      [name, phone, service].forEach(function (el) {
        var valid = el.value && el.value.trim().length > 1;
        el.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      var first = (name.value.trim().split(" ")[0]) || "there";
      document.getElementById("successText").textContent =
        "Thanks, " + first + " — we'll text " + phone.value.trim() + " shortly to confirm your pickup time.";
      fields.hidden = true;
      success.hidden = false;
    });
    document.getElementById("bookAnother").addEventListener("click", function () {
      form.reset();
      success.hidden = true;
      fields.hidden = false;
    });
  }
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initForm();

  /* ---------- reduced motion / missing libs → static fallback ---------- */
  if (reduced || !hasLibs) {
    document.documentElement.classList.add("reduced");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll, driven by GSAP's ticker ---------- */
  var lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* anchor links through Lenis */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: id === "#book" ? -10 : 0, duration: 1.4 });
      }
    });
  });

  /* ---------- frame sequence ---------- */
  var isMobileSet = window.matchMedia("(max-width: 768px)").matches;
  var frameDir = isMobileSet ? "assets/frames-mobile/" : "assets/frames/";
  var frames = new Array(FRAME_COUNT);
  var canvas = document.getElementById("scrubCanvas");
  var ctx = canvas.getContext("2d");
  var poster = document.getElementById("scrubPoster");
  var loadFill = document.getElementById("loadFill");
  var loadPct = document.getElementById("loadPct");
  var loadWrap = document.querySelector(".loadwrap");
  var scrollHint = document.getElementById("scrollHint");
  var progressBar = document.getElementById("scrubProgress");
  var currentFrame = 0;   // smoothed (float)
  var targetFrame = 0;    // from scroll progress
  var drawnFrame = -1;
  var canvasReady = false;

  function framePath(i) {
    var n = String(i + 1);
    while (n.length < 3) n = "0" + n;
    return frameDir + "f" + n + ".webp";
  }

  function sizeCanvas() {
    var stage = canvas.parentElement;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(stage.clientWidth * dpr);
    canvas.height = Math.round(stage.clientHeight * dpr);
    drawnFrame = -1; // force redraw
    if (!canvasReady) paintPoster();
  }

  function isDrawable(img) {
    return !!(img && img.complete && img.naturalWidth > 0);
  }

  function paintCover(img) {
    var cw = canvas.width, ch = canvas.height;
    var scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function drawFrame(idx) {
    var img = frames[idx];
    if (!isDrawable(img)) {
      // fall back to the nearest frame that actually decoded — never paint air
      for (var d = 1; d < FRAME_COUNT; d++) {
        if (isDrawable(frames[idx - d])) { img = frames[idx - d]; break; }
        if (isDrawable(frames[idx + d])) { img = frames[idx + d]; break; }
      }
    }
    if (!isDrawable(img)) return false;
    paintCover(img);
    drawnFrame = idx;
    return true;
  }

  /* Paint the poster still into the canvas the moment it is available, so the
     stage shows the visual even before the first sequence frame decodes. */
  function paintPoster() {
    if (isDrawable(poster) && !canvasReady) paintCover(poster);
  }
  if (poster) {
    if (isDrawable(poster)) paintPoster();
    else poster.addEventListener("load", paintPoster);
    poster.addEventListener("error", function () {
      console.error("[SH scrub] Poster failed to load: " + poster.getAttribute("src") +
        " — stage background will rely on frames/CSS only.");
    });
  }

  var settledCount = 0;  // frames that finished, one way or the other
  var okCount = 0;       // frames that actually decoded
  var failCount = 0;     // frames that errored
  var firstFail = null;

  function onFrameSettled(i, ok) {
    settledCount++;
    if (ok) {
      okCount++;
    } else {
      failCount++;
      if (!firstFail) firstFail = framePath(i);
      if (failCount <= 3) {
        console.error("[SH scrub] Frame failed to load: " + framePath(i));
      }
    }
    var pct = Math.round((settledCount / FRAME_COUNT) * 100);
    if (loadFill) loadFill.style.width = pct + "%";
    if (loadPct && settledCount < FRAME_COUNT) {
      loadPct.textContent = "Loading the stack… " + pct + "%";
    }
    /* The canvas takes over ONLY after a real frame has been painted.
       (The old loader counted errors as loads, faded the poster out and
       left an empty canvas — the blank-background bug.) */
    if (!canvasReady && ok && drawFrame(Math.round(currentFrame))) {
      canvasReady = true;
      canvas.classList.add("ready");
      poster.classList.add("gone");
      if (loadWrap) loadWrap.classList.add("done");
      if (scrollHint) scrollHint.classList.add("show");
    }
    if (settledCount === FRAME_COUNT) {
      if (loadPct) loadPct.textContent = "";
      if (loadWrap) loadWrap.classList.add("done");
      if (okCount === 0) {
        document.documentElement.classList.add("frames-failed");
        console.error("[SH scrub] ALL " + FRAME_COUNT + " frames failed to load from \"" +
          frameDir + "\" (first failure: " + firstFail + "). " +
          "Poster fallback stays on stage; beats/copy keep working. " +
          "Check that the frame files are served relative to this page.");
      } else if (failCount > 0) {
        console.warn("[SH scrub] " + failCount + "/" + FRAME_COUNT +
          " frames failed (first: " + firstFail + ") — scrub uses the nearest loaded frame.");
      }
    }
  }

  function preload() {
    // first 15 frames first (hero becomes interactive), then the rest
    var order = [];
    for (var i = 0; i < FRAME_COUNT; i++) order.push(i);
    order.sort(function (a, b) {
      var ga = a < 15 ? 0 : 1, gb = b < 15 ? 0 : 1;
      return ga - gb || a - b;
    });
    order.forEach(function (i) {
      var img = new Image();
      img.onload = function () { onFrameSettled(i, true); };
      img.onerror = function () { onFrameSettled(i, false); };
      if (packSet) {
        try { img.src = blobUrlFromB64(packSet[i]); }
        catch (e) { onFrameSettled(i, false); return; }
      } else {
        img.src = framePath(i);
      }
      frames[i] = img;
    });
  }

  /* debug/verification handle */
  window.__scrubStatus = function () {
    return {
      settled: settledCount, ok: okCount, failed: failCount,
      canvasReady: canvasReady, drawnFrame: drawnFrame,
      posterGone: poster ? poster.classList.contains("gone") : null,
      frameDir: frameDir
    };
  };

  /* ---------- optional packed mode (e.g. GitHub Pages mirror) ----------
     If window.MAD_PACKED is set and base64 frame data is present
     (window.MAD_FRAMES_DESKTOP / window.MAD_FRAMES_MOBILE, plus
     window.MAD_POSTER), frames decode from Blob URLs instead of file
     paths. With no pack present this block is completely inert. */
  var packSet = null;
  function blobUrlFromB64(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
  }
  if (window.MAD_PACKED) {
    var packArr = isMobileSet ? window.MAD_FRAMES_MOBILE : window.MAD_FRAMES_DESKTOP;
    if (packArr && packArr.length === FRAME_COUNT) {
      packSet = packArr;
    } else {
      console.error("[SH scrub] Packed mode on but frame data missing/incomplete — falling back to file paths.");
    }
    if (window.MAD_POSTER) {
      try {
        var posterUrl = blobUrlFromB64(window.MAD_POSTER);
        poster.src = posterUrl;
        canvas.parentElement.style.backgroundImage = 'url("' + posterUrl + '")';
      } catch (e) {
        console.error("[SH scrub] Packed poster decode failed — keeping file poster.", e);
      }
    }
  }

  /* ---------- the pinned scrub ---------- */
  var beats = Array.prototype.slice.call(document.querySelectorAll(".beat"));
  var BEAT_ENDS = [0.13, 0.31, 0.51, 0.71, 0.88, 1.01]; // progress where each beat hands off
  var activeBeat = 0;

  function setBeat(p) {
    var idx = 0;
    while (idx < BEAT_ENDS.length - 1 && p >= BEAT_ENDS[idx]) idx++;
    if (idx !== activeBeat) {
      beats[activeBeat].classList.remove("is-active");
      beats[idx].classList.add("is-active");
      activeBeat = idx;
      if (scrollHint && idx > 0) scrollHint.classList.remove("show");
    }
  }

  ScrollTrigger.create({
    trigger: ".story",
    start: "top top",
    end: "+=400%",
    pin: ".stage",
    pinSpacing: true,
    anticipatePin: 1,
    onUpdate: function (self) {
      targetFrame = self.progress * (FRAME_COUNT - 1);
      if (progressBar) progressBar.style.width = (self.progress * 100).toFixed(2) + "%";
      setBeat(self.progress);
    }
  });

  /* smoothed render loop — scrub feels buttery, works both directions */
  gsap.ticker.add(function () {
    if (!canvasReady) return;
    currentFrame += (targetFrame - currentFrame) * 0.14;
    if (Math.abs(targetFrame - currentFrame) < 0.02) currentFrame = targetFrame;
    var idx = Math.round(currentFrame);
    if (idx !== drawnFrame) drawFrame(idx);
  });

  /* ---------- reveals for the rest of the page ---------- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        delay: parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0,
        scrollTrigger: { trigger: el, start: "top 86%", once: true }
      });
  });

  /* ---------- boot ---------- */
  sizeCanvas();
  preload();
  window.addEventListener("resize", function () {
    sizeCanvas();
    ScrollTrigger.refresh();
  });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
