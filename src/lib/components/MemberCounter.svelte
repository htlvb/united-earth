<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { MemberCounts } from '$lib/types';

  let { counts }: { counts: MemberCounts } = $props();

  const sorted = $derived(
    Object.entries(counts.byCountry).sort(([, a], [, b]) => b - a)
  );
</script>

<div id="flagsBorder">
  <p style="margin-left:5px; display:inline;">{$_('members')}</p>
  <p style="display:inline;" id="counter">{counts.total}</p>
  <div id="flags">
    {#each sorted as [code, count]}
      <span title="{code.toUpperCase()}: {count}">
        <img
          src="/flags/{code.toUpperCase()}.png"
          alt={code}
          style="width:24px; height:16px; margin:2px;"
          onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </span>
    {/each}
  </div>
</div>
