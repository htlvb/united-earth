<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';
  import CountrySelector from '$lib/components/CountrySelector.svelte';

  let accountType: 'p' | 'o' = $state('p');
  let firstName = $state('');
  let lastName = $state('');
  let organization = $state('');
  let website = $state('');
  let country = $state('');
  let email = $state('');
  let honeypot = $state('');
  let privacyAccepted = $state(false);
  let oldEnough = $state(false);

  let formError = $state('');
  let success = $state(false);
  let loading = $state(false);

  async function submit() {
    formError = '';

    if (!privacyAccepted) { formError = $_('err_privacy_policy'); return; }
    if (!oldEnough) { formError = $_('err_not_old_enough'); return; }
    if (accountType === 'p') {
      if (!firstName.trim()) { formError = $_('err_first_name_empty'); return; }
      if (!lastName.trim()) { formError = $_('err_last_name_empty'); return; }
    } else {
      if (!organization.trim()) { formError = $_('err_company_organization_name_empty'); return; }
    }
    if (!country) { formError = $_('err_country_empty'); return; }
    if (!email.trim()) { formError = $_('err_email_empty'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { formError = $_('err_email_invalid'); return; }

    loading = true;
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: accountType,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          organization: organization.trim() || undefined,
          website: website.trim() || undefined,
          country,
          language: $locale ?? 'en',
          email: email.trim(),
          phone: honeypot,
        }),
      });

      if (res.ok) {
        success = true;
      } else {
        const body = await res.json().catch(() => ({}));
        formError = body.message ?? $_('err_unknown');
      }
    } catch {
      formError = $_('err_timeout');
    } finally {
      loading = false;
    }
  }
</script>

{#if success}
  <div class="rounded bg-[#5e42a6] px-6 py-4 my-4 text-white">
    <p>{$_('mes_email_sent')}</p>
  </div>
{:else}
  <form onsubmit={(e) => { e.preventDefault(); submit(); }}>

    <!-- Person / Organization toggle -->
    <div id="segemented-controll-people-organization">
      <input id="rad1" type="radio" name="radioBtn" bind:group={accountType} value="p" />
      <label class="labels {accountType === 'p' ? 'bg-white/25' : ''}" for="rad1">{$_('all_people')}</label>
      <input id="rad2" type="radio" name="radioBtn" bind:group={accountType} value="o" />
      <label class="labels {accountType === 'o' ? 'bg-white/25' : ''}" for="rad2">{$_('all_organizations')}</label>
    </div>


    {#if accountType === 'o'}
      <p class="text-sm mb-2">{$_('included_organizations')}</p>
    {/if}

    <div class="fields">
      {#if accountType === 'p'}
        <div class="field half">
          <label for="firstName">{$_('first_name')}</label>
          <input id="firstName" type="text" bind:value={firstName} />
        </div>
        <div class="field half">
          <label for="lastName">{$_('last_name')}</label>
          <input id="lastName" type="text" bind:value={lastName} />
        </div>
      {:else}
        <div class="field half">
          <label for="organization">{$_('company_organization_name')}</label>
          <input id="organization" type="text" bind:value={organization} />
        </div>
        <div class="field half">
          <label for="website">{$_('website')}</label>
          <input id="website" type="url" bind:value={website} placeholder="https://" />
        </div>
      {/if}

      <div class="field half">
        <label for="country">{$_('country')}</label>
        <CountrySelector bind:value={country} />
      </div>

      <div class="field half">
        <label for="email">{$_('email')}</label>
        <input id="email" type="email" bind:value={email} />
      </div>
    </div>

    <div class="field">
      <input id="old_enough" type="checkbox" bind:checked={oldEnough} />
      <label for="old_enough">{$_('old_enough')}</label>
    </div>

    <div class="field">
      <input id="privacy_policy" type="checkbox" bind:checked={privacyAccepted} />
      <label for="privacy_policy">
        {$_('privacy_policy_1')}
        <a href="/privacy_policies" target="_blank">{$_('privacy_policy_0')}</a>
      </label>
    </div>

    <div class="hp-field" aria-hidden="true">
      <input type="text" name="phone" bind:value={honeypot} tabindex="-1" autocomplete="off" />
    </div>

    {#if formError}
      <p class="my-2 text-red-400">{formError}</p>
    {/if}

    <ul class="actions">
      <li>
        <button type="submit" class="button_theme primary" disabled={loading}>
          {loading ? $_('loading') : $_('get_involved')}
        </button>
      </li>
    </ul>
  </form>
{/if}

<style>
  /* Honeypot — visually hidden but not display:none (some bots skip those) */
  .hp-field {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  /* Segmented control — CSS sibling selector logic can't be expressed in Tailwind */
  #segemented-controll-people-organization {
    position: relative;
    display: flex;
    background-color: #b74e91;
    z-index: 5;
    width: 100%;
    border-radius: 5px;
    margin-bottom: 5px;
  }
  input[type="radio"] { display: none; }
  .labels {
    width: 50%;
    text-align: center;
    padding: 10px 0;
    margin-bottom: 0;
    z-index: 2;
    cursor: pointer;
    border-radius: 5px;
  }
  .labels { transition: background-color 0.2s ease; }
</style>
