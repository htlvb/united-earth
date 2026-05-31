<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';

  const AVAILABLE_LANGS = ['de', 'en', 'es', 'fr'];
  const curLang = $derived($locale ?? 'en');
  const displayLang = $derived(AVAILABLE_LANGS.includes(curLang) ? curLang : 'en');
</script>

<div id="wrapper">
  <section id="one" class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('privacy_policies')}</h2>

      <ul class="actions">
        {#each AVAILABLE_LANGS as lang}
          <li>
            <a
              href="/DSV_{lang}.pdf"
              target="_blank"
              class="button_theme {lang === displayLang ? 'primary' : ''}"
            >
              {lang.toUpperCase()}
            </a>
          </li>
        {/each}
      </ul>

      <ul class="actions">
        <li><a href="/" class="button_theme">{$_('home')}</a></li>
      </ul>
    </div>
  </section>
</div>
