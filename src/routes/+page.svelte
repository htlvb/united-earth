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
    <p style="text-align:center; margin-bottom:0;">
      By continuing you accept the
      <a href="/privacy_policies" target="_blank">{$_('privacy_policy_0')}</a>
      of United-Earth2026
    </p>
  </section>

  <!-- Welcome -->
  <section id="welcome" class="wrapper style1 fullscreen fade-up">
    <div class="inner">
      <div id="lang_selection">
        <LanguageSwitcher />
      </div>

      <div id="title-and-logo">
        <div id="version-large" class="title-and-logo">
          <img class="logo" src="/umweltabzeichen.png" alt="Logo" />
          <h1 id="title">United-Earth2026</h1>
          <img class="logo" src="/Logo.png" alt="Logo" />
        </div>
        <div id="version-small" class="title-and-logo">
          <h1 id="title">United-Earth2026</h1>
          <div id="logos">
            <img class="logo" src="/umweltabzeichen.png" alt="Logo" />
            <img class="logo" src="/Logo.png" alt="Logo" />
          </div>
        </div>

        <div id="united-earth-is-text">
          <p style="font-size:1em;">{$_('united_earth_is_1')}</p>
          <h2 style="margin-bottom:0">{$_('united_earth_is_2')}</h2>
          <p style="margin-bottom:0;font-size:1em;">{$_('united_earth_is_3')}</p>
          <p style="font-size:1em;">{$_('united_earth_is_4')}</p>
          <p style="font-size:1em;">{$_('united_earth_is_5')}</p>
          <h2 style="margin-bottom:0">{$_('united_earth_is_6')}</h2>
          <p style="margin-bottom:0;font-size:1em;">{$_('united_earth_is_7')}</p>
          <p style="font-size:1em;">{$_('united_earth_is_8')}</p>

          <div class="container">
            <a style="margin-bottom:10px;display:block;" class="button_theme half" href="#becomeAMember">
              {$_('get_involved_people')}
            </a>
            <a style="margin-bottom:10px;display:block;" class="button_theme half" href="#becomeAMember">
              {$_('get_involved_organizations')}
            </a>
          </div>

          <h3>Latest members</h3>
          <LatestMembers members={data.latest} />

          <MemberCounter counts={data.counts} />
        </div>
      </div>
    </div>
  </section>

  <!-- What do we stand for / What is necessary -->
  <section id="weSaveOurPlanet" class="wrapper style3 fade-up">
    <div class="inner">
      <section id="whatDoWeStandFor">
        <h2>{$_('tab2')}</h2>
        <p>{$_('about_us_2')}</p>
        <p>{$_('about_us_3')}</p>
        <p>{$_('about_us_4')}</p>
        <p>{$_('about_us_5')}</p>
      </section>

      <section id="whatIsNecessary">
        <h2>{$_('tab3')}</h2>
        <p>{$_('about_us_6')}</p>
        <p><strong>{$_('about_us_7')}</strong></p>
        <ul class="actions" style="margin-top:1em;">
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
        <div style="background:#5e42a6;color:white;padding:1em;border-radius:4px;margin-bottom:1em;">
          {$_('mes_email_sent')}
        </div>
      {/if}

      {#if data.error === 'invalid_token'}
        <div style="background:#c0392b;color:white;padding:1em;border-radius:4px;margin-bottom:1em;">
          Verification link is invalid or has expired.
        </div>
      {/if}

      <RegistrationForm />
    </div>
  </section>
</div>
