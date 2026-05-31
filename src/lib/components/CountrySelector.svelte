<script lang="ts">
  import { slide } from 'svelte/transition';
  import { COUNTRIES } from '$lib/countries';
  import { _ } from 'svelte-i18n';

  let { value = $bindable('') }: { value: string } = $props();

  let query = $state(COUNTRIES.find(c => c.code === value)?.name ?? '');
  let open = $state(false);
  let inputEl: HTMLInputElement;

  const suggestions = $derived(
    query.trim().length === 0
      ? COUNTRIES
      : COUNTRIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
  );

  function select(code: string, name: string) {
    value = code;
    query = name;
    open = false;
  }

  function onBlur() {
    // If the typed text doesn't match the selected country, revert
    setTimeout(() => {
      const match = COUNTRIES.find(c => c.name.toLowerCase() === query.trim().toLowerCase());
      if (match) {
        select(match.code, match.name);
      } else {
        query = COUNTRIES.find(c => c.code === value)?.name ?? '';
      }
      open = false;
    }, 150); // delay so click on suggestion fires first
  }
</script>

<div class="relative block">
  <input
    bind:this={inputEl}
    type="text"
    bind:value={query}
    placeholder={$_('select_country')}
    class="input-height w-full"
    onfocus={() => open = true}
    onblur={onBlur}
    oninput={() => { open = true; value = ''; }}
    autocomplete="off"
  />

  {#if open && suggestions.length > 0}
    <div
      class="absolute bottom-full left-0 right-0 z-[20000] max-h-60 overflow-y-auto rounded border border-white/20 bg-[#1a1a2e] shadow-xl mb-1"
      transition:slide={{ duration: 150 }}
    >
      {#each suggestions as c}
        <button
          type="button"
          class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white {c.code === value ? 'bg-white/15 text-white' : ''}"
          onmousedown={() => select(c.code, c.name)}
        >
          <img
            src="/flags/{c.code}.png"
            alt={c.code}
            class="h-4 shrink-0"
            onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          {c.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
