<script lang="ts">
  import type { LatestMember } from '$lib/types';

  let { members }: { members: LatestMember[] } = $props();
</script>

<div id="latest_members">
  {#each members as member}
    <div class="latest-member">
      <img
        src="/flags/{member.country.toUpperCase()}.png"
        alt={member.country}
        style="width:20px; height:13px; vertical-align:middle; margin-right:6px;"
        onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <span>{member.designation}</span>
    </div>
  {/each}
</div>

<style>
  .latest-member {
    display: flex;
    align-items: center;
    margin: 4px 0;
  }
</style>
