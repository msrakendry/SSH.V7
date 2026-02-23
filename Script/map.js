// ============================================
// INTERACTIVE WORLD MAP FUNCTIONALITY
// ============================================
// Implements zoom, pan (drag), scroll-to-zoom,
// and touch support for the image-based world map.

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  var scale       = 1;
  var MIN_SCALE   = 0.5;
  var MAX_SCALE   = 5;
  var ZOOM_STEP   = 0.2;
  var translateX  = 0;
  var translateY  = 0;

  // Drag state
  var isDragging  = false;
  var dragStartX  = 0;
  var dragStartY  = 0;
  var dragOriginX = 0;
  var dragOriginY = 0;

  // Touch pinch state
  var lastPinchDist = 0;

  // DOM refs (resolved after DOMContentLoaded)
  var mapContainer;
  var mapWrapper;
  var zoomDisplay;

  // ── Apply Transform ────────────────────────────────────────────────────────
  function applyTransform() {
    if (!mapWrapper) return;
    mapWrapper.style.transform =
      'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale + ')';
    if (zoomDisplay) {
      zoomDisplay.textContent = 'Zoom: ' + Math.round(scale * 100) + '%';
    }
  }

  // ── Clamp Helper ──────────────────────────────────────────────────────────
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  // ── Zoom Around Point ──────────────────────────────────────────────────────
  // zoom around a viewport-relative point (cx, cy)
  function zoomAround(newScale, cx, cy) {
    if (!mapWrapper) return;
    var rect = mapWrapper.getBoundingClientRect();

    // Point relative to wrapper origin (before transform)
    var originX = cx - rect.left;
    var originY = cy - rect.top;

    var scaleDelta = newScale / scale;

    translateX = cx - (rect.left + originX * scaleDelta);
    translateY = cy - (rect.top  + originY * scaleDelta);

    scale = newScale;
    applyTransform();
  }

  // ── Public Zoom Functions ──────────────────────────────────────────────────
  // Called from HTML onclick="zoomIn()" etc.
  window.zoomIn = function () {
    var newScale = clamp(scale + ZOOM_STEP, MIN_SCALE, MAX_SCALE);
    if (newScale === scale) return;
    // Zoom towards centre of container
    var rect = mapContainer ? mapContainer.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    zoomAround(newScale, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  window.zoomOut = function () {
    var newScale = clamp(scale - ZOOM_STEP, MIN_SCALE, MAX_SCALE);
    if (newScale === scale) return;
    var rect = mapContainer ? mapContainer.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    zoomAround(newScale, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  window.resetView = function () {
    scale      = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  };

  // ── Mouse Drag (Pan) ───────────────────────────────────────────────────────
  function onMouseDown(e) {
    if (e.button !== 0) return; // left-click only
    isDragging  = true;
    dragStartX  = e.clientX;
    dragStartY  = e.clientY;
    dragOriginX = translateX;
    dragOriginY = translateY;
    mapContainer.classList.add('grabbing');
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    translateX = dragOriginX + (e.clientX - dragStartX);
    translateY = dragOriginY + (e.clientY - dragStartY);
    applyTransform();
  }

  function onMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    mapContainer.classList.remove('grabbing');
  }

  // ── Scroll-to-Zoom ─────────────────────────────────────────────────────────
  function onWheel(e) {
    e.preventDefault();
    var delta    = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    var newScale = clamp(scale + delta, MIN_SCALE, MAX_SCALE);
    if (newScale !== scale) {
      zoomAround(newScale, e.clientX, e.clientY);
    }
  }

  // ── Touch Support ──────────────────────────────────────────────────────────
  function getTouchDist(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging  = true;
      dragStartX  = e.touches[0].clientX;
      dragStartY  = e.touches[0].clientY;
      dragOriginX = translateX;
      dragOriginY = translateY;
    } else if (e.touches.length === 2) {
      isDragging    = false;
      lastPinchDist = getTouchDist(e.touches);
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      translateX = dragOriginX + (e.touches[0].clientX - dragStartX);
      translateY = dragOriginY + (e.touches[0].clientY - dragStartY);
      applyTransform();
    } else if (e.touches.length === 2) {
      var dist     = getTouchDist(e.touches);
      var pinchDelta = (dist - lastPinchDist) / 200;
      var newScale = clamp(scale + pinchDelta, MIN_SCALE, MAX_SCALE);
      var midX     = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      var midY     = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      zoomAround(newScale, midX, midY);
      lastPinchDist = dist;
    }
  }

  function onTouchEnd(e) {
    if (e.touches.length === 0) {
      isDragging    = false;
      lastPinchDist = 0;
    }
  }

  // ── Keyboard Shortcuts ─────────────────────────────────────────────────────
  function onKeyDown(e) {
    // Only act if the map section is visible/scrolled to
    if (!mapContainer) return;
    var PAN_STEP = 30;
    switch (e.key) {
      case '+': case '=': window.zoomIn();  e.preventDefault(); break;
      case '-': case '_': window.zoomOut(); e.preventDefault(); break;
      case '0':           window.resetView(); e.preventDefault(); break;
      case 'ArrowUp':    translateY += PAN_STEP; applyTransform(); e.preventDefault(); break;
      case 'ArrowDown':  translateY -= PAN_STEP; applyTransform(); e.preventDefault(); break;
      case 'ArrowLeft':  translateX += PAN_STEP; applyTransform(); e.preventDefault(); break;
      case 'ArrowRight': translateX -= PAN_STEP; applyTransform(); e.preventDefault(); break;
      default: break;
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    mapContainer = document.getElementById('mapContainer');
    mapWrapper   = document.getElementById('mapWrapper');
    zoomDisplay  = document.getElementById('zoomLevel');

    if (!mapContainer || !mapWrapper) {
      // Map elements not present on this page — silently exit
      return;
    }

    // Apply initial transform (no-op at 100%)
    applyTransform();

    // Mouse events
    mapContainer.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('mousemove',        onMouseMove);
    window.addEventListener('mouseup',          onMouseUp);

    // Scroll zoom
    mapContainer.addEventListener('wheel', onWheel, { passive: false });

    // Touch events
    mapContainer.addEventListener('touchstart', onTouchStart, { passive: false });
    mapContainer.addEventListener('touchmove',  onTouchMove,  { passive: false });
    mapContainer.addEventListener('touchend',   onTouchEnd);

    // Keyboard
    document.addEventListener('keydown', onKeyDown);

    // Prevent context menu from interfering with drag
    mapContainer.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
