type Theme = 'light' | 'dark' | 'system';

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme: Theme) => {
  // 1. Calculate how the website should actually render
  const resolvedMode = theme === 'system' ? getSystemTheme() : theme;

  // 2. Set the document theme for CSS/Tailwind rules
  document.documentElement.setAttribute('data-mode', resolvedMode);

  // 3. Keep the button state strictly matched to the storage token (shows the proper icon!)
  const toggles = document.querySelectorAll('[data-nb-theme-toggle]');
  toggles.forEach((toggle) => {
    toggle.setAttribute('data-nb-state', theme);
  });
};

const initThemeToggle = () => {
  const currentTheme = (localStorage.getItem('theme') as Theme) || 'system';
  applyTheme(currentTheme);

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('[data-nb-theme-toggle]');

    if (!button) return;

    const storedTheme = (localStorage.getItem('theme') as Theme) || 'system';

    // Cycle strictly: system -> light -> dark -> back to system
    let nextTheme: Theme = 'light';
    if (storedTheme === 'light') nextTheme = 'dark';
    else if (storedTheme === 'dark') nextTheme = 'system';

    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });
};

// Layout Init & View Transitions support
initThemeToggle();
document.addEventListener('astro:after-swap', () => {
  const saved = (localStorage.getItem('theme') as Theme) || 'system';
  applyTheme(saved);
});

// React live if system changes while user is on 'system' mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const currentTheme = localStorage.getItem('theme') as Theme;
  if (!currentTheme || currentTheme === 'system') {
    applyTheme('system');
  }
});
