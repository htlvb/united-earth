<script lang="ts">
  import { _ } from 'svelte-i18n';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import MemberCounter from '$lib/components/MemberCounter.svelte';
  import LatestMembers from '$lib/components/LatestMembers.svelte';
  import RegistrationForm from '$lib/components/RegistrationForm.svelte';

  let { data } = $props();
</script>

<!-- Sidebar -->
<section id="sidebar">
  <div class="inner">
    <nav>
      <ul>
        <li><a href="#welcome">{$_('tab1')}</a></li>
        <li><a href="#whatDoWeStandFor">{$_('tab2')}</a></li>
        <li><a href="#whatIsNecessary">{$_('tab3')}</a></li>
        <li><a href="/2_current_status_climate.pdf" target="_blank">{$_('current_status_climate')}</a></li>
        <li><a href="#becomeAMember">{$_('tab4')}</a></li>
      </ul>
    </nav>
  </div>
</section>

<!-- Wrapper -->
<div id="wrapper">

  <!-- Privacy notice -->
  <section>
    <p class="text-center !mb-0">
      By continuing you accept the
      <a href="/privacy_policies" target="_blank">{$_('privacy_policy_0')}</a>
      of United-Earth2025
    </p>
  </section>

  <!-- Welcome -->
  <section id="welcome" class="wrapper style1 fullscreen fade-up">
    <div class="inner">
      <div id="lang_selection" class="mb-4">
        <LanguageSwitcher />
      </div>

      <!-- Large screen: logos left and right of title -->
      <div class="hidden lg:flex flex-row items-center my-5">
        <img class="flex-none max-h-20 object-contain mr-4" src="/htlvb.svg" alt="HTLVB" />
        <img class="flex-1 max-h-36 object-contain" src="/umweltabzeichen.png" alt="Logo" />
        <h1 class="grow-[5] text-center m-0">United-Earth2025</h1>
        <img class="flex-1 max-h-36 object-contain" src="/Logo.png" alt="Logo" />
      </div>

      <!-- Small screen: title on top, logos side by side below -->
      <div class="flex lg:hidden flex-col items-center my-5">
        <h1 class="text-center m-0">United-Earth2025</h1>
        <div class="flex flex-row justify-center items-center">
          <img class="w-[35%]" src="/htlvb.svg" alt="HTLVB" />
          <img class="w-[30%]" src="/umweltabzeichen.png" alt="Logo" />
          <img class="w-[30%]" src="/Logo.png" alt="Logo" />
        </div>
      </div>

      <p class="text-base">{$_('united_earth_is_1')}</p>
      <h2 class="mb-0">{$_('united_earth_is_2')}</h2>
      <p class="mb-0 text-base">{$_('united_earth_is_3')}</p>
      <p class="text-base">{$_('united_earth_is_4')}</p>
      <p class="text-base">{$_('united_earth_is_5')}</p>
      <h2 class="mb-0">{$_('united_earth_is_6')}</h2>
      <p class="mb-0 text-base">{$_('united_earth_is_7')}</p>
      <p class="text-base">{$_('united_earth_is_8')}</p>

      <div class="!my-2 !mb-6">
        <a class="button_theme fit" href="#becomeAMember">{$_('get_involved')}</a>
      </div>

      <h3>Latest members</h3>
      <LatestMembers members={data.latest} />

      <MemberCounter counts={data.counts} />
    </div>
  </section>

  <!-- What do we stand for / What is necessary -->
  <section id="weSaveOurPlanet" class="wrapper style3 fade-up">
    <div class="inner">
      <section id="whatDoWeStandFor">
        <h1>{$_('ws_page_title')}</h1>
        <h2>{$_('tab2')}</h2>

        <h4>{$_('ws_saving_earth_h')}</h4>
        <p>{$_('ws_saving_earth_text')}</p>

        <h4>{$_('ws_peace_h')}</h4>
        <p>{$_('ws_peace_text')}</p>

        <h4>{$_('ws_forests_h')}</h4>
        <p>{$_('ws_forests_text')}</p>

        <h4>{$_('ws_science_h')}</h4>
        <p>{$_('ws_science_text')}</p>
      </section>

      <section id="whatIsNecessary">
        <h2>{$_('tab3')}</h2>

        <h4>{$_('ws_greenhouse_h')}</h4>
        <p>{$_('ws_greenhouse_text')}<br/><a href={$_('ws_greenhouse_url')} target="_blank" rel="noopener">{$_('ws_greenhouse_url')}</a></p>

        <h4>{$_('ws_co2_h')}</h4>
        <p>{$_('ws_co2_text')}<br/><a href={$_('ws_co2_url')} target="_blank" rel="noopener">{$_('ws_co2_url')}</a></p>

        <h4>{$_('ws_animals_h')}</h4>
        <p>{$_('ws_animals_text')}<br/><a href={$_('ws_animals_url')} target="_blank" rel="noopener">{$_('ws_animals_url')}</a></p>

        <h4>{$_('ws_preparing_h')}</h4>
        <p>{$_('ws_preparing_text')}<br/><a href={$_('ws_preparing_url')} target="_blank" rel="noopener">{$_('ws_preparing_url')}</a></p>

        <h4>{$_('ws_awareness_h')}</h4>
        <p>{$_('ws_awareness_text')}<br/><a href={$_('ws_awareness_url')} target="_blank" rel="noopener">{$_('ws_awareness_url')}</a></p>

        <ul class="actions" style="margin-top:1.5em;">
          <li><a href="/2_current_status_climate.pdf" target="_blank" class="button_theme">{$_('current_status_climate')}</a></li>
        </ul>

        <div class="text-center mt-8">
          <h3>{$_('ws_lets_start')}</h3>
          <h3>{$_('ws_only_with_help')}</h3>
          <h3>{$_('ws_together')}</h3>
          <h3>{$_('ws_page_title')}</h3>
        </div>
      </section>
    </div>
  </section>

  <!-- Become a member -->
  <section id="becomeAMember" class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('become_a_member')}</h2>
      <p>{$_('save_the_earth')}</p>
      <p>{$_('error_free')}</p>

      <RegistrationForm />
    </div>
  </section>
</div>
