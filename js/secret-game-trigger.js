(function () {
  function initSecretGameTrigger() {
    var box = document.getElementById('profile-secret-box');
    var slideLayer = document.getElementById('profile-slide-layer');
    var button = document.getElementById('secret-game-btn');
    if (!box || !slideLayer || !button) return;

    var dragging = false;
    var startY = 0;
    var currentOffset = 0;
    var maxReveal = 76;
    var revealThreshold = 52;

    function setOffset(offset, animate) {
      var next = Math.max(0, Math.min(maxReveal, offset));
      currentOffset = next;
      if (animate) {
        slideLayer.classList.remove('is-dragging');
      } else {
        slideLayer.classList.add('is-dragging');
      }
      slideLayer.style.transform = 'translateY(' + (-next) + 'px)';
      button.classList.toggle('is-revealed', next >= revealThreshold);
    }

    function onPointerDown(event) {
      event.preventDefault();
      dragging = true;
      startY = event.clientY;
      slideLayer.setPointerCapture(event.pointerId);
      slideLayer.classList.add('is-dragging');
    }

    function onPointerMove(event) {
      if (!dragging) return;
      event.preventDefault();
      var delta = startY - event.clientY;
      setOffset(delta, false);
    }

    function onPointerEnd(event) {
      if (!dragging) return;
      dragging = false;
      slideLayer.releasePointerCapture(event.pointerId);
      if (currentOffset >= revealThreshold) {
        setOffset(maxReveal, true);
      } else {
        setOffset(0, true);
      }
    }

    slideLayer.addEventListener('pointerdown', onPointerDown);
    slideLayer.addEventListener('pointermove', onPointerMove);
    slideLayer.addEventListener('pointerup', onPointerEnd);
    slideLayer.addEventListener('pointercancel', onPointerEnd);
    slideLayer.addEventListener('lostpointercapture', onPointerEnd);
    slideLayer.addEventListener('dragstart', function (event) {
      event.preventDefault();
    });

    button.addEventListener('click', function () {
      setOffset(0, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecretGameTrigger);
  } else {
    initSecretGameTrigger();
  }
})();
