<script lang="ts">
  import { slide } from 'svelte/transition';
  import { locale } from 'svelte-i18n';
  import { setLocale } from '$lib/i18n';
  import { _ } from 'svelte-i18n';

  const LANGS = [
    { code: 'af', name: 'Afrikaans' }, { code: 'am', name: 'አማርኛ' },
    { code: 'ar', name: 'العربية' }, { code: 'az', name: 'azərbaycan' },
    { code: 'be', name: 'беларуская' }, { code: 'bg', name: 'български' },
    { code: 'bn', name: 'বাংলা' }, { code: 'bs', name: 'bosanski' },
    { code: 'ca', name: 'català' }, { code: 'cs', name: 'čeština' },
    { code: 'cy', name: 'Cymraeg' }, { code: 'da', name: 'dansk' },
    { code: 'de', name: 'Deutsch' }, { code: 'el', name: 'ελληνικά' },
    { code: 'en', name: 'English' }, { code: 'eo', name: 'Esperanto' },
    { code: 'es', name: 'Español' }, { code: 'et', name: 'eesti' },
    { code: 'eu', name: 'euskara' }, { code: 'fa', name: 'فارسی' },
    { code: 'fi', name: 'suomi' }, { code: 'fr', name: 'français' },
    { code: 'fy', name: 'Frysk' }, { code: 'ga', name: 'Gaeilge' },
    { code: 'gl', name: 'Galego' }, { code: 'gu', name: 'ગુજરાતી' },
    { code: 'ha', name: 'هَوُسَ' }, { code: 'he', name: 'עברית' },
    { code: 'hi', name: 'हिन्दी' }, { code: 'hr', name: 'hrvatski' },
    { code: 'ht', name: 'Kreyòl' }, { code: 'hu', name: 'magyar' },
    { code: 'hy', name: 'Հայերեն' }, { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'ig', name: 'Igbo' }, { code: 'is', name: 'Íslenska' },
    { code: 'it', name: 'Italiano' }, { code: 'ja', name: '日本語' },
    { code: 'ka', name: 'ქართული' }, { code: 'kk', name: 'қазақ' },
    { code: 'km', name: 'ខ្មែរ' }, { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ko', name: '한국어' }, { code: 'ku', name: 'Kurdî' },
    { code: 'ky', name: 'Кыргызча' }, { code: 'la', name: 'latine' },
    { code: 'lb', name: 'Lëtzebuergesch' }, { code: 'lo', name: 'ພາສາລາວ' },
    { code: 'lt', name: 'lietuvių' }, { code: 'lv', name: 'latviešu' },
    { code: 'mg', name: 'Malagasy' }, { code: 'mi', name: 'Māori' },
    { code: 'mk', name: 'македонски' }, { code: 'ml', name: 'മലയാളം' },
    { code: 'mn', name: 'Монгол' }, { code: 'mr', name: 'मराठी' },
    { code: 'ms', name: 'Bahasa Melayu' }, { code: 'mt', name: 'Malti' },
    { code: 'my', name: 'ဗမာ' }, { code: 'ne', name: 'नेपाली' },
    { code: 'nl', name: 'Nederlands' }, { code: 'no', name: 'Norsk' },
    { code: 'pl', name: 'polski' }, { code: 'pt', name: 'Português' },
    { code: 'ro', name: 'Română' }, { code: 'ru', name: 'русский' },
    { code: 'si', name: 'සිංහල' }, { code: 'sk', name: 'Slovenčina' },
    { code: 'sl', name: 'Slovenščina' }, { code: 'sm', name: 'Samoa' },
    { code: 'sq', name: 'Shqip' }, { code: 'sr', name: 'српски' },
    { code: 'sv', name: 'Svenska' }, { code: 'sw', name: 'Kiswahili' },
    { code: 'ta', name: 'தமிழ்' }, { code: 'te', name: 'తెలుగు' },
    { code: 'th', name: 'ไทย' }, { code: 'tl', name: 'Tagalog' },
    { code: 'tr', name: 'Türkçe' }, { code: 'uk', name: 'Українська' },
    { code: 'ur', name: 'اردو' }, { code: 'uz', name: "O'zbek" },
    { code: 'vi', name: 'Tiếng Việt' }, { code: 'xh', name: 'isiXhosa' },
    { code: 'yi', name: 'ייִדיש' }, { code: 'yo', name: 'Yorùbá' },
    { code: 'zh', name: '中文' }, { code: 'zu', name: 'isiZulu' },
  ];

  let open = $state(false);

  const current = $derived(LANGS.find(l => l.code === ($locale ?? 'en')) ?? LANGS.find(l => l.code === 'en')!);

  function select(code: string) {
    setLocale(code);
    open = false;
  }
</script>

<div class="relative block">
  <button
    class="flex w-full items-center gap-1.5 cursor-pointer rounded border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-inherit hover:bg-white/20"
    onclick={() => open = !open}
    aria-expanded={open}
  >
    <span class="flex-1 text-left">{current.name}</span>
    <span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">▾</span>
  </button>

  {#if open}
    <div
      class="absolute top-full left-0 right-0 z-50 mt-0 grid gap-0.5 rounded border border-white/20 bg-[#1a1a2e] p-1.5 shadow-xl"
      style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));"
      transition:slide={{ duration: 250 }}
    >
      {#each LANGS as lang}
        <button
          class="cursor-pointer rounded border-none bg-transparent px-2 py-1 text-left text-xs whitespace-nowrap text-white/80 hover:bg-white/10 hover:text-white {lang.code === $locale ? 'bg-white/15 font-semibold text-white' : ''}"
          onclick={() => select(lang.code)}
        >
          {lang.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
