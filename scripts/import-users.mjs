import postgres from 'postgres';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://ue:secret@localhost:5432/unitedearth';
const FILE = process.env.FILE ?? '/home/jegger/workspace/UnitedEarth/data/Users.json';

const sql = postgres(DATABASE_URL);

const raw = JSON.parse(readFileSync(FILE, 'utf-8'));
const entries = Object.entries(raw);

let imported = 0;
let skipped = 0;

for (const [id, u] of entries) {
  // Normalise both formats into a common shape
  const isNewFmt = 'fN' in u || 'lN' in u || 'type' in u;

  if (isNewFmt && u.v === false) {
    console.log(`skip unverified: ${id}`);
    skipped++;
    continue;
  }

  const email     = (u.email ?? u.e ?? '').trim().toLowerCase();
  const firstName = (u.firstName ?? u.fN ?? '').trim() || null;
  const lastName  = (u.lastName  ?? u.lN ?? '').trim() || null;
  const country   = (u.country   ?? u.c  ?? '').trim().toLowerCase();
  const language  = (u.lang      ?? u.l  ?? 'en').trim();
  const nlRaw     = u.emailNewsLetter ?? u.nL ?? 0;
  const newsletter = nlRaw > 0;

  // verified_at: prefer explicit creation date, fall back to newsletter timestamp, then now
  let verifiedAt;
  if (isNewFmt && u.cd?._seconds) {
    verifiedAt = new Date(u.cd._seconds * 1000);
  } else if (nlRaw > 0) {
    verifiedAt = new Date(nlRaw);
  } else {
    verifiedAt = new Date('2020-05-23'); // project start — no timestamp available
  }

  if (!email) { console.log(`skip no-email: ${id}`); skipped++; continue; }

  try {
    await sql`
      INSERT INTO supporters (type, first_name, last_name, country, language, email, newsletter, verified_at)
      VALUES ('p', ${firstName}, ${lastName}, ${country}, ${language}, ${email}, ${newsletter}, ${verifiedAt})
      ON CONFLICT (email) DO NOTHING
    `;
    imported++;
  } catch (err) {
    console.error(`error on ${id} (${email}):`, err.message);
    skipped++;
  }
}

console.log(`\nDone — imported: ${imported}, skipped: ${skipped}`);
await sql.end();
