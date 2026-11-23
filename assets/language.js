(() => {
  const script = document.currentScript;
  const { lang, dataset } = document.documentElement;
  const siteRoot = new URL('../', script.src);
  const languages = ['en', 'ru', 'zh-CN'];
  const cookieName = 'open_defender_language';
  const explicitEnglish = new URLSearchParams(location.search).get('lang') === 'en';
  const hasCookies = siteRoot.protocol !== 'file:';
  const saved = hasCookies ? document.cookie.split('; ')
    .find(cookie => cookie.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1) : undefined;

  if (lang === 'en' && !explicitEnglish && languages.includes(saved) && saved !== 'en') {
    const folder = saved === 'zh-CN' ? 'zh-cn' : saved;
    const page = dataset.page === 'docs' ? 'docs.html' : 'index.html';
    const destination = new URL(`${folder}/${page}`, siteRoot);
    destination.hash = location.hash;
    location.replace(destination);
    return;
  }

  if (languages.includes(lang) && saved !== lang && hasCookies) {
    const secure = siteRoot.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cookieName}=${lang}; Path=${siteRoot.pathname}; Max-Age=31536000; SameSite=Lax${secure}`;
  }

  if (dataset.page === 'docs') {
    document.addEventListener('DOMContentLoaded', () => {
      const links = document.querySelectorAll('.language-nav a');
      const keepSection = () => links.forEach(link => { link.hash = location.hash; });
      keepSection();
      window.addEventListener('hashchange', keepSection);
    });
  }
})();
