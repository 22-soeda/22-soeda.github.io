(function () {
  function initPortfolioTheme() {
    var body = document.body;
    var toggleBtn = document.getElementById('theme-toggle-btn');
    var btnIcon = document.getElementById('btn-icon');
    var btnText = document.getElementById('btn-text');

    if (localStorage.getItem('portfolioTheme') === 'retro') {
      body.classList.add('theme-retro');
      if (btnIcon) btnIcon.textContent = '✨';
      if (btnText) btnText.textContent = 'モダンモード';
    }

    if (!toggleBtn || !btnIcon || !btnText) return;

    toggleBtn.addEventListener('click', function () {
      body.classList.toggle('theme-retro');

      if (body.classList.contains('theme-retro')) {
        btnIcon.textContent = '✨';
        btnText.textContent = 'モダンモード';
        localStorage.setItem('portfolioTheme', 'retro');
      } else {
        btnIcon.textContent = '🎮';
        btnText.textContent = 'レトロモード';
        localStorage.setItem('portfolioTheme', 'modern');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioTheme);
  } else {
    initPortfolioTheme();
  }
})();
