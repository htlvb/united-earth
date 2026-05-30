<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';
  import { COUNTRIES } from '$lib/countries';

  let accountType: 'p' | 'o' = $state('p');
  let designation = $state('');
  let firstName = $state('');
  let lastName = $state('');
  let organization = $state('');
  let website = $state('');
  let country = $state('');
  let email = $state('');
  let newsletter = $state(true);
  let privacyAccepted = $state(false);
  let oldEnough = $state(false);

  let formError = $state('');
  let success = $state(false);
  let loading = $state(false);

  async function submit() {
    formError = '';

    if (!privacyAccepted) { formError = $_('err_privacy_policy'); return; }
    if (!oldEnough) { formError = $_('err_not_old_enough'); return; }
    if (!designation.trim()) { formError = 'Please enter your designation'; return; }
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
          designation: designation.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          organization: organization.trim() || undefined,
          website: website.trim() || undefined,
          country,
          language: $locale ?? 'en',
          email: email.trim(),
          newsletter,
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
  <div class="success-box">
    <p>{$_('mes_email_sent')}</p>
  </div>
{:else}
  <form onsubmit={(e) => { e.preventDefault(); submit(); }}>
    <!-- Person / Organization toggle -->
    <div id="segemented-controll-people-organization">
      <input id="rad1" type="radio" name="radioBtn" bind:group={accountType} value="p" />
      <label class="labels" for="rad1">{$_('all_people')}</label>
      <input id="rad2" type="radio" name="radioBtn" bind:group={accountType} value="o" />
      <label class="labels" for="rad2">{$_('all_organizations')}</label>
    </div>

    <p id="account-type-label">
      {accountType === 'p' ? $_('person') : $_('organization')}
    </p>

    {#if accountType === 'o'}
      <p style="font-size:0.85em;">{$_('included_organizations')}</p>
    {/if}

    <div class="fields">
      <!-- Designation -->
      <div class="field half">
        <label for="designation">Designation</label>
        <input id="designation" type="text" bind:value={designation} placeholder="e.g. Climate activist" />
      </div>

      {#if accountType === 'p'}
        <!-- First / Last name -->
        <div class="field half">
          <label for="firstName">{$_('first_name')}</label>
          <input id="firstName" type="text" bind:value={firstName} />
        </div>
        <div class="field half">
          <label for="lastName">{$_('last_name')}</label>
          <input id="lastName" type="text" bind:value={lastName} />
        </div>
      {:else}
        <!-- Organization name + website -->
        <div class="field half">
          <label for="organization">{$_('company_organization_name')}</label>
          <input id="organization" type="text" bind:value={organization} />
        </div>
        <div class="field half">
          <label for="website">{$_('website')}</label>
          <input id="website" type="url" bind:value={website} placeholder="https://" />
        </div>
      {/if}

      <!-- Country -->
      <div class="field half">
        <label for="country">{$_('country')}</label>
        <select id="country" bind:value={country}>
          <option value="" disabled selected>{$_('select_country')}</option>
          {#each COUNTRIES as c}
            <option value={c.code}>{c.name}</option>
          {/each}
        </select>
      </div>

      <!-- Email -->
      <div class="field half">
        <label for="email">{$_('email')}</label>
        <input id="email" type="email" bind:value={email} />
      </div>
    </div>

    <!-- Newsletter -->
    <div class="field">
      <input id="email_newsletter" type="checkbox" bind:checked={newsletter} />
      <label for="email_newsletter">{$_('email_newsletter')}</label>
    </div>

    <!-- Age consent -->
    <div class="field">
      <input id="old_enough" type="checkbox" bind:checked={oldEnough} />
      <label for="old_enough">{$_('old_enough')}</label>
    </div>

    <!-- Privacy policy -->
    <div class="field">
      <input id="privacy_policy" type="checkbox" bind:checked={privacyAccepted} />
      <label for="privacy_policy">
        {$_('privacy_policy_1')}
        <a href="/privacy_policies" target="_blank">{$_('privacy_policy_0')}</a>
      </label>
    </div>

    {#if formError}
      <p class="form-error">{formError}</p>
    {/if}

    <ul class="actions">
      <li>
        <button type="submit" class="button_theme primary" disabled={loading}>
          {loading ? $_('loading') : $_('create_account')}
        </button>
      </li>
    </ul>
  </form>
{/if}

<style>
  .success-box {
    background: #5e42a6;
    color: white;
    padding: 1em 1.5em;
    border-radius: 4px;
    margin: 1em 0;
  }
  .form-error {
    color: #c0392b;
    margin: 0.5em 0;
  }
</style>
