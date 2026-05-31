<script lang="ts">
  import { _ } from 'svelte-i18n';
  let { data } = $props();
</script>

<div id="wrapper">
  <section class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('email_verification')}</h2>
      <p>{data.ok ? $_('success') : $_('failed')}</p>
      <ul class="actions">
        <li><a href="/" class="button_theme">{$_('home')}</a></li>
      </ul>
    </div>
  </section>
</div>
