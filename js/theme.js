(function () {
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
