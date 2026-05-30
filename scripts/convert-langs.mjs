/**
 * Converts original .txt lang files to JSON for svelte-i18n.
 * Keys not relevant to the 2026 simplified version are dropped.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const SRC = '/home/jegger/workspace/UnitedEarth/United-Earth2022/hosting/html_src/Lang strings';
const DEST = '/home/jegger/workspace/UnitedEarth/UnitedEarth2026/src/lib/i18n/locales';

const KEEP_KEYS = new Set([
  'tab1', 'tab2', 'tab3', 'tab4',
  'home', 'learn_more', 'ok',
  'action_plan', 'current_status_climate', 'about_us', 'privacy_policies', 'sources',
  'change_lang', 'lang', 'select_country',
  'members',
  'become_a_member', 'save_the_earth', 'error_free',
  'first_name', 'last_name', 'country', 'email',
  'designation',
  'old_enough', 'accept_tokens',
  'newsletter', 'newsletter_yes', 'newsletter_no', 'email_newsletter',
  'get_involved', 'get_involved_people', 'get_involved_organizations',
  'all_people', 'all_organizations', 'person', 'organization',
  'included_organizations',
  'company_organization_name', 'website',
  'create_account', 'search',
  'err_email_empty', 'err_email_invalid', 'err_country_empty',
  'err_first_name_empty', 'err_last_name_empty',
  'err_company_organization_name_empty', 'err_website_empty',
  'err_not_old_enough', 'err_privacy_policy', 'err_newsletter_not_checked',
  'err_unknown', 'err_sending_verification_mail', 'err_timeout',
  'mes_email_sent', 'success', 'failed', 'loading',
  'privacy_policy_0', 'privacy_policy_1', 'privacy_policy_2',
  'email_verification', 'email_verification_1', 'verify_email',
  'united_earth_is_1', 'united_earth_is_2', 'united_earth_is_3',
  'united_earth_is_4', 'united_earth_is_5', 'united_earth_is_6',
  'united_earth_is_7', 'united_earth_is_8',
  'about_us_1', 'about_us_2', 'about_us_3', 'about_us_4',
  'about_us_5', 'about_us_6', 'about_us_7', 'about_us_8',
  'about_us_9', 'about_us_10', 'about_us_11',
  'donation_1', 'donation_2', 'bibliography',
  'no_results',
]);

function parseTxt(text) {
  const result = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (KEEP_KEYS.has(key)) {
      result[key] = value;
    }
  }
  return result;
}

const files = readdirSync(SRC).filter(f => f.endsWith('.txt') && !f.includes('/'));
let converted = 0;

for (const file of files) {
  const lang = basename(file, '.txt');
  const text = readFileSync(join(SRC, file), 'utf-8');
  const json = parseTxt(text);

  // Fall back to English for any missing keys
  writeFileSync(join(DEST, `${lang}.json`), JSON.stringify(json, null, 2) + '\n', 'utf-8');
  converted++;
}

console.log(`Converted ${converted} language files.`);
