<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { MemberCounts } from '$lib/types';
  import { COUNTRIES } from '$lib/countries';

  const countryName = (code: string) =>
    COUNTRIES.find(c => c.code === code.trim().toLowerCase())?.name ?? code.toUpperCase();

  let { counts }: { counts: MemberCounts } = $props();

  const sorted = $derived(
    Object.entries(counts.byCountry).sort(([, a], [, b]) => b - a)
  );

  // Cumulative threshold at which each flag should appear, plus the previous threshold
  const thresholds = $derived((() => {
    let running = 0;
    return sorted.map(([code, count]) => {
      const prev = running;
      running += count;
      return { code, count, threshold: running, prev };
    });
  })());

  let displayedCount = $state(0);
  let visibleFlags = $state(1);
  let container: HTMLDivElement;

  onMount(() => {
    const duration = 3000;
    const target = counts.total;

    function start() {
      const t0 = performance.now();
      function tick(now: number) {
        const elapsed = now - t0;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        displayedCount = Math.round(eased * target);
        visibleFlags = Math.max(1, thresholds.filter(t => displayedCount >= t.threshold).length);
        if (progress < 1) requestAnimationFrame(tick);
        else visibleFlags = thresholds.length;
      }
      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div bind:this={container} class="overflow-hidden border border-blue-500 rounded my-2.5">
  <p class="ml-1.5 inline">{$_('members')}</p>
  <p class="inline">{displayedCount}</p>
  <div class="flex flex-wrap gap-3 p-2">
    {#each thresholds.slice(0, visibleFlags) as { code, count, prev }}
      <div class="flex flex-col items-center gap-0.5">
        <img
          src="/flags/{code.trim().toLowerCase()}.png"
          alt={code}
          title="{countryName(code)}: {count}"
          class="h-8"
          onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <span class="text-xs">{Math.min(Math.max(displayedCount - prev, 0), count)}</span>
      </div>
    {/each}
  </div>
</div>
