<script lang="ts">
  import type { LatestMember } from '$lib/types';

  let { members }: { members: LatestMember[] } = $props();
</script>

<div id="latest_members" class="flex flex-wrap gap-2.5 mb-2.5">
  {#each members as member}
    <div class="flex items-center gap-1.5">
      <img
        src="/flags/{member.country.toUpperCase()}.png"
        alt={member.country}
        class="h-4"
        onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <span>{member.designation}</span>
    </div>
  {/each}
</div>
