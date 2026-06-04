<script lang="ts">
  import { slide } from 'svelte/transition';
  import { locale } from 'svelte-i18n';
  import { setLocale } from '$lib/i18n';
  import { _ } from 'svelte-i18n';

  const LANGS = [
    { code: 'ar', name: 'العربية' },
    { code: 'bg', name: 'български' },
    { code: 'bs', name: 'bosanski' },
    { code: 'cs', name: 'čeština' },
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fa', name: 'فارسی' },
    { code: 'fr', name: 'français' },
    { code: 'hr', name: 'hrvatski' },
    { code: 'hu', name: 'magyar' },
    { code: 'it', name: 'Italiano' },
    { code: 'no', name: 'Norsk' },
    { code: 'pl', name: 'polski' },
    { code: 'ro', name: 'Română' },
    { code: 'ru', name: 'русский' },
    { code: 'sq', name: 'Shqip' },
    { code: 'sv', name: 'Svenska' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'zh', name: '中文' },
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
