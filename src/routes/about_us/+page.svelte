<script lang="ts">
  import { _ } from 'svelte-i18n';
</script>

<div id="wrapper">
  <section id="one" class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('about_us')}</h2>

      <h3>{$_('about_us_1')}</h3>
      <p>{$_('about_us_2')}</p>
      <p>{$_('about_us_3')}</p>
      <p>{$_('about_us_4')}</p>
      <p>{$_('about_us_5')}</p>

      <blockquote>{$_('about_us_6')}</blockquote>
      <p><strong>{$_('about_us_7')}</strong></p>

      <hr />
      <p>{$_('about_us_8')}</p>
      <p>{$_('about_us_9')}</p>
      <p>{$_('about_us_10')}</p>
      <p>{$_('about_us_11')}</p>

      <ul class="actions">
        <li><a href="/" class="button_theme">{$_('home')}</a></li>
      </ul>
    </div>
  </section>
</div>
