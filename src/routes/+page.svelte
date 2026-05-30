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
        <li><a href="/current_status_climate">{$_('current_status_climate')}</a></li>
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
      of United-Earth2026
    </p>
  </section>

  <!-- Welcome -->
  <section id="welcome" class="wrapper style1 fullscreen fade-up">
    <div class="inner">
      <div id="lang_selection" class="mb-4">
        <LanguageSwitcher />
      </div>

      <!-- Large screen: logos left and right of title -->
      <div class="hidden md:flex flex-row items-center my-5">
        <img class="flex-1 max-h-36 object-contain" src="/umweltabzeichen.png" alt="Logo" />
        <h1 class="grow-[5] text-center m-0">United-Earth2026</h1>
        <img class="flex-1 max-h-36 object-contain" src="/Logo.png" alt="Logo" />
      </div>

      <!-- Small screen: title on top, logos side by side below -->
      <div class="flex md:hidden flex-col items-center my-5">
        <h1 class="text-center m-0">United-Earth2026</h1>
        <div class="flex flex-row justify-center items-center">
          <img class="w-[55%]" src="/umweltabzeichen.png" alt="Logo" />
          <img class="w-[35%]" src="/Logo.png" alt="Logo" />
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

      <div class="flex flex-wrap gap-2 my-2">
        <a class="button_theme half flex-1 block mb-2" href="#becomeAMember">{$_('get_involved_people')}</a>
        <a class="button_theme half flex-1 block mb-2" href="#becomeAMember">{$_('get_involved_organizations')}</a>
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
        <h2 class="ml-[2%] mt-[35px]">{$_('tab2')}</h2>
        <p class="ml-[8%] mb-0">{$_('about_us_2')}</p>
        <p class="ml-[8%] mb-0">{$_('about_us_3')}</p>
        <p class="ml-[8%] mb-0">{$_('about_us_4')}</p>
        <p class="ml-[8%] mb-0">{$_('about_us_5')}</p>
      </section>

      <section id="whatIsNecessary">
        <h2 class="ml-[2%] mt-[35px]">{$_('tab3')}</h2>
        <p class="ml-[8%] mb-0">{$_('about_us_6')}</p>
        <p class="ml-[8%] mb-0"><strong>{$_('about_us_7')}</strong></p>
        <ul class="actions mt-4">
          <li><a href="/current_status_climate" class="button_theme">{$_('current_status_climate')}</a></li>
          <li><a href="/action_plan" class="button_theme">{$_('action_plan')}</a></li>
        </ul>
      </section>
    </div>
  </section>

  <!-- Become a member -->
  <section id="becomeAMember" class="wrapper style1 fade-up">
    <div class="inner">
      <h2>{$_('become_a_member')}</h2>
      <p>{$_('save_the_earth')}</p>
      <p>{$_('error_free')}</p>

      {#if data.success}
        <div class="rounded bg-[#5e42a6] px-4 py-3 mb-4 text-white">
          {$_('mes_email_sent')}
        </div>
      {/if}

      {#if data.error === 'invalid_token'}
        <div class="rounded bg-red-700 px-4 py-3 mb-4 text-white">
          Verification link is invalid or has expired.
        </div>
      {/if}

      <RegistrationForm />
    </div>
  </section>
</div>
