(function () {
  var defaultSheet = document.getElementById('theme-default');
  var librarySheet = document.getElementById('theme-library');
  var btn = document.getElementById('themeToggle');

  if (!defaultSheet || !librarySheet || !btn) return;

  function applyTheme(theme) {
    if (theme === 'library') {
      defaultSheet.disabled = true;
      librarySheet.disabled = false;
      btn.textContent = '🏠 Modern';
      btn.setAttribute('aria-pressed', 'true');
    } else {
      defaultSheet.disabled = false;
      librarySheet.disabled = true;
      btn.textContent = '📚 Bibliotheek';
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  btn.addEventListener('click', function () {
    var current = localStorage.getItem('theme') || 'default';
    var next = current === 'library' ? 'default' : 'library';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  // Apply saved theme on load (stylesheet state already set by inline head script)
  applyTheme(localStorage.getItem('theme') || 'default');
}());
