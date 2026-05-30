import { browser } from '$app/environment';
import { init, register, locale, getLocaleFromNavigator } from 'svelte-i18n';

const SUPPORTED_LOCALES = [
  'af','am','ar','az','be','bg','bn','bs','ca','ceb','co','cs','cy','da',
  'de','el','en','eo','es','et','eu','fa','fi','fr','fy','ga','gd','gl',
  'gu','ha','haw','he','hi','hmn','hr','ht','hu','hy','id','ig','is','it',
  'ja','jv','jw','ka','kk','km','kn','ko','ku','ky','la','lb','lo','lt',
  'lv','ma','mg','mi','mk','ml','mn','mr','ms','mt','my','ne','nl','no',
  'ny','or','pa','pl','ps','pt','ro','ru','rw','sd','si','sk','sl','sm',
  'sn','so','sq','sr','st','su','sv','sw','ta','te','tg','th','tk','tl',
  'tr','tt','ug','uk','ur','uz','vi','xh','yi','yo','zh','zu',
];

export const RTL_LOCALES = new Set(['ar', 'fa', 'he', 'ur', 'yi']);

export function isSupported(lang: string): boolean {
  return SUPPORTED_LOCALES.includes(lang);
}

for (const lang of SUPPORTED_LOCALES) {
  register(lang, () => import(`./locales/${lang}.json`));
}

export function setupI18n(initialLocale?: string) {
  const detected = initialLocale
    ?? (browser ? localStorage.getItem('lang') : null)
    ?? getLocaleFromNavigator()
    ?? 'en';

  const resolved = isSupported(detected) ? detected : 'en';

  return init({
    fallbackLocale: 'en',
    initialLocale: resolved,
  });
}

export function setLocale(lang: string) {
  if (!isSupported(lang)) return;
  locale.set(lang);
  if (browser) localStorage.setItem('lang', lang);
}

export { locale };
