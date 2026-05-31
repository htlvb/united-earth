<script lang="ts">
  import { _ } from 'svelte-i18n';
</script>

<div id="wrapper">
  <section id="one" class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('current_status_climate')}</h2>

      <ul class="actions">
        <li>
          <a href="/2_current_status_climate.pdf" target="_blank" class="button_theme primary">
            {$_('learn_more')}
          </a>
        </li>
        <li><a href="/" class="button_theme">{$_('home')}</a></li>
      </ul>
    </div>
  </section>
</div>
