<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { MemberCounts } from '$lib/types';

  let { counts }: { counts: MemberCounts } = $props();

  const sorted = $derived(
    Object.entries(counts.byCountry).sort(([, a], [, b]) => b - a)
  );
</script>

<div id="flagsBorder" class="overflow-hidden border border-blue-500 rounded my-2.5">
  <p class="ml-1.5 inline">{$_('members')}</p>
  <p class="inline" id="counter">{counts.total}</p>
  <div id="flags" class="flex h-48 overflow-y-scroll flex-wrap">
    {#each sorted as [code, count]}
      <span title="{code.toUpperCase()}: {count}">
        <img
          src="/flags/{code.toUpperCase()}.png"
          alt={code}
          class="h-12 m-2"
          onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </span>
    {/each}
  </div>
</div>
