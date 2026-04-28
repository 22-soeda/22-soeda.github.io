(function () {
  function initVisitorCounterSrc(retroMode) {
    var img = document.getElementById('visitor-counter-img');
    if (!img) return;
    if (img.getAttribute('src')) return;
    var base = img.getAttribute('data-counter-url');
    if (!base) return;
    var theme = retroMode ? img.dataset.themeRetro : img.dataset.themeModern;
    if (!theme) return;
    img.src = base + '?theme=' + encodeURIComponent(theme);
  }

  function initPortfolioTheme() {
    var body = document.body;
    var toggleBtn = document.getElementById('theme-toggle-btn');
    var btnIcon = document.getElementById('btn-icon');
    var btnText = document.getElementById('btn-text');
    var isRetro;

    function updateToggleLabel(retroMode) {
      if (btnIcon) btnIcon.textContent = retroMode ? '✨' : '🎮';
      if (btnText) btnText.textContent = retroMode ? 'モダンモード' : 'レトロモード';
    }

    isRetro = localStorage.getItem('portfolioTheme') === 'retro';
    body.classList.toggle('theme-retro', isRetro);
    updateToggleLabel(isRetro);
    initVisitorCounterSrc(isRetro);

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      body.classList.toggle('theme-retro');
      isRetro = body.classList.contains('theme-retro');

      updateToggleLabel(isRetro);
      localStorage.setItem('portfolioTheme', isRetro ? 'retro' : 'modern');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioTheme);
  } else {
    initPortfolioTheme();
  }
})();
