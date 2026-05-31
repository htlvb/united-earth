<script lang="ts">
  import { slide } from 'svelte/transition';
  import { COUNTRIES } from '$lib/countries';
  import { _ } from 'svelte-i18n';

  let { value = $bindable('') }: { value: string } = $props();

  let open = $state(false);

  const current = $derived(COUNTRIES.find(c => c.code === value));

  function select(code: string) {
    value = code;
    open = false;
  }
</script>

<div class="relative block">
  <button
    type="button"
    class="input-height flex w-full items-center gap-2 cursor-pointer rounded border border-white/30 bg-white/10 px-3 text-inherit hover:bg-white/20"
    onclick={() => open = !open}
    aria-expanded={open}
  >
    {#if current}
      <img
        src="/flags/{current.code}.png"
        alt={current.code}
        class="h-4"
        onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <span class="flex-1 text-left">{current.name}</span>
    {:else}
      <span class="flex-1 text-left text-white/50">{$_('select_country')}</span>
    {/if}
    <span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">▾</span>
  </button>

  {#if open}
    <div
      class="absolute top-full left-0 right-0 z-50 grid gap-0.5 rounded border border-white/20 bg-[#1a1a2e] p-1.5 shadow-xl"
      style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));"
      transition:slide={{ duration: 250 }}
    >
      {#each COUNTRIES as c}
        <button
          type="button"
          class="flex items-center gap-2 cursor-pointer rounded border-none bg-transparent px-2 py-1 text-left text-xs text-white/80 hover:bg-white/10 hover:text-white {c.code === value ? 'bg-white/15 font-semibold text-white' : ''}"
          onclick={() => select(c.code)}
        >
          <img
            src="/flags/{c.code}.png"
            alt={c.code}
            class="h-3.5 shrink-0"
            onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          {c.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
