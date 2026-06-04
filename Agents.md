# UnitedEarth2026 — Agent Context

Self-hosted SvelteKit clone of the United-Earth2022 climate activism supporter platform.
Replaces Firebase/Google APIs with PostgreSQL + Node.js. Branded as **United-Earth2025**.

## Stack

- **SvelteKit** (Svelte 5 runes mode) + Node.js adapter — frontend and API routes in one project
- **PostgreSQL** via `postgres.js` (no ORM) — `src/lib/server/db.ts`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — imported in `src/app.css`
- **svelte-i18n** — runtime language switching, 110 JSON locale files in `src/lib/i18n/locales/`
- **Azure MSAL** + **Nodemailer** — OAuth2 SMTP on `smtp.office365.com:587` (client credentials flow)
- **Docker Compose** — `app` container + `postgres:16-alpine` container

## Build & run

```sh
npm run build          # single build step
docker-compose up      # starts app (port 3000) + postgres; migrations auto-run
```

Dev: start postgres via VS Code task "Start Database", then `npm run dev`.

## Environment variables (`.env` / Docker env)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | `postgresql://ue:secret@db:5432/unitedearth` |
| `AZURE_CLIENT_ID` | yes | Azure App Registration |
| `AZURE_CLIENT_SECRET` | yes | |
| `AZURE_TENANT_ID` | yes | |
| `MAIL_FROM` | yes | Sending address, e.g. `united-earth2025@htlvb.at` |
| `MAIL_BCC` | no | Blind-copy all verification emails when set |
| `SITE_URL` | yes | Base URL for magic-link, e.g. `https://united-earth.example.com` |

See `.env.example`. Run `scripts/setup-azure.sh` (requires `az` CLI) to create the Azure app registration.

## File map

```
src/
  app.css                          Tailwind import + global html rules
  lib/
    types.ts                       RegistrationData, MemberCounts, LatestMember
    countries.ts                   COUNTRIES array {code, name}
    server/
      db.ts                        postgres.js pool (singleton)
      supporters.ts                all DB queries (getMemberCounts, getLatestMembers,
                                   createPendingRegistration, confirmRegistration,
                                   emailAlreadyRegistered, emailHasPendingRegistration)
      email.ts                     Azure MSAL token + Nodemailer sendVerificationEmail
    i18n/
      index.ts                     setupI18n(), RTL_LOCALES set
      locales/*.json               110 locale files; keys listed below
    components/
      RegistrationForm.svelte      person/org toggle, country combobox, honeypot field
      CountrySelector.svelte       combobox: type-to-filter, opens upward, z-[20000]
      MemberCounter.svelte         IntersectionObserver scroll trigger, count-up animation
      LatestMembers.svelte         latest 12 supporters with flag + truncated name
      LanguageSwitcher.svelte      absolute overlay grid, slide transition
      Footer.svelte
  routes/
    +layout.svelte                 i18n init, RTL dir, removes is-preload on mount
    +layout.server.ts              loads member counts for layout
    +page.svelte                   home: sidebar, welcome, weSaveOurPlanet, becomeAMember
    +page.server.ts                SSR: getMemberCounts + getLatestMembers
    verify/
      +page.server.ts              confirmRegistration(token) → {ok: boolean}
      +page.svelte                 shows success/failed
    api/
      register/+server.ts          POST: honeypot check → cooldown check → validate →
                                   createPending → sendVerificationEmail
      members/+server.ts           GET: counts + latest (JSON)
    about_us/+page.svelte
    current_status_climate/+page.svelte
    privacy_policies/+page.svelte
    sources/+page.svelte
migrations/
  001_initial.sql                  supporters + pending_registrations tables
static/
  flags/*.png                      country flag images (lowercase filenames)
  css/main.css                     Hyperspace theme CSS (unlayered — overrides Tailwind)
  2_current_status_climate.pdf
scripts/
  import-users.mjs                 converts Firebase Users.json → import-users.sql
  setup-azure.sh                   creates Azure app registration, prints .env values
  convert-webside-txt.mjs          converts original .txt lang files → ws_* JSON keys
.github/workflows/docker.yml       builds + pushes to GHCR on push to main
```

## Database schema

```sql
supporters (
  id UUID PK, type CHAR(1) CHECK('p','o'),
  first_name, last_name, organization, website,
  country CHAR(3), language VARCHAR(10),
  email VARCHAR(500) UNIQUE, newsletter BOOL,
  verified_at TIMESTAMPTZ DEFAULT NOW()
)
pending_registrations (
  token VARCHAR(64) PK, data JSONB,
  created_at TIMESTAMPTZ, expires_at TIMESTAMPTZ  -- 24h TTL
)
```

`country` is stored as a 3-char lowercase code. Use `TRIM(country)` in queries (CHAR(3) pads with spaces).

## Registration flow

1. `POST /api/register` — checks honeypot (`body.phone`), 1-hour cooldown per email, validates, inserts into `pending_registrations`, sends magic-link email
2. User clicks `/verify?token=xxx`
3. `verify/+page.server.ts` — looks up token, inserts into `supporters` (ON CONFLICT DO NOTHING), deletes pending row, returns `{ok: boolean}`

## Anti-spam measures

- **Honeypot**: hidden `<input name="phone">` in form (off-screen via CSS, not `display:none`). API silently returns `{ok:true}` if non-empty.
- **Cooldown**: if `pending_registrations` already has a row for the same email created within the last hour, skip sending and return `{ok:true}`.

## i18n

- `svelte-i18n` with JSON locale files; use `$_('key')` in components
- RTL locales (`ar`, `fa`, `he`, `ur`, `yi`) handled via `dir` attribute in layout
- `ws_*` keys come from original `webside_txt` files (converted by `scripts/convert-webside-txt.mjs`)
- When adding a new UI string: add the key to **all 110 locale files** (copy the English value for langs that weren't translated yet)

## CSS notes

- `static/css/main.css` is the Hyperspace theme — it is **unlayered**, so it beats Tailwind's `@layer utilities`. Use the `!` prefix (e.g. `!my-2`) to force Tailwind overrides.
- `static/css/main.css` contains `.input-height { height: 2.75em }` — apply this class to keep all form inputs the same height.
- Svelte 5: `class:bg-white/25` is invalid (slash in directive name) — use a ternary in the `class=""` string instead.
- Svelte 5: avoid naming variables `type` — conflicts with the parser. Use e.g. `accountType`.

## Svelte 5 patterns used

- `$state()`, `$derived()`, `$props()`, `$bindable()` runes
- Event handlers as properties: `onclick={...}`, `onblur={...}`, `onerror={(e) => ...}`
- `class:` directive does not accept `/` in class names
