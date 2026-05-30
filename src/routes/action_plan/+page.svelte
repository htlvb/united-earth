<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';

  const AVAILABLE_LANGS = [
    'af','ar','bg','bn','ca','cs','cy','da','de','el','en','es','et','fa',
    'fi','fj','fr','ga','gu','he','hi','hmn','hr','ht','hu','id','is','it',
    'ja','kn','ko','lt','lv','mg','mi','ml','mr','ms','mt','nl','no','pa',
    'pl','pt','ro','ru','sk','sl','sm','sr','sv','sw','ta','te','th','tl',
    'to','tr','uk','ur','vi','zh',
  ];

  const curLang = $derived($locale ?? 'en');
  const hasCurrentLang = $derived(AVAILABLE_LANGS.includes(curLang));
</script>

<div id="wrapper">
  <section id="one" class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('action_plan')}</h2>

      {#if hasCurrentLang}
        <ul class="actions">
          <li>
            <a href="/pdfs/action_plan/Massnahmenplan_{curLang}.pdf" target="_blank" class="button_theme primary">
              {$_('learn_more')} ({curLang})
            </a>
          </li>
        </ul>
      {/if}

      <ul>
        {#each AVAILABLE_LANGS as lang}
          <li>
            <a href="/pdfs/action_plan/Massnahmenplan_{lang}.pdf" target="_blank">
              {lang}
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
