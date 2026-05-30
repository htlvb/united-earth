<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';

  const AVAILABLE_LANGS = [
    'af','am','ar','az','be','bg','bs','ca','ceb','co','cs','cy','da','de',
    'el','en','eo','es','et','eu','fa','fi','fr','fy','ga','gl','gu','ha',
    'haw','he','hi','hmn','hr','ht','hu','hy','id','ig','is','it','ja','ka',
    'kk','km','kn','ko','ku','ky','la','lb','lo','lt','lv','mi','mk','ml',
    'mn','mr','ms','mt','my','ne','nl','no','ny','or','pa','pl','pt','ro',
    'ru','rw','sd','si','sk','sl','sm','so','sq','sr','st','su','sv','sw',
    'ta','te','tg','th','tk','tl','tr','ug','uk','ur','uz','vi','xh','yi',
    'yo','zh','zu',
  ];

  const curLang = $derived($locale ?? 'en');
  const hasCurrentLang = $derived(AVAILABLE_LANGS.includes(curLang));
</script>

<div id="wrapper">
  <section id="one" class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('current_status_climate')}</h2>

      {#if hasCurrentLang}
        <ul class="actions">
          <li>
            <a
              href="/pdfs/current_status_climate/2_current_status_climate_{curLang}.pdf"
              target="_blank"
              class="button_theme primary"
            >
              {$_('learn_more')} ({curLang})
            </a>
          </li>
        </ul>
      {/if}

      <ul>
        {#each AVAILABLE_LANGS as lang}
          <li>
            <a href="/pdfs/current_status_climate/2_current_status_climate_{lang}.pdf" target="_blank">
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
