/**
 * Converts webside_txt files (positional lines) into named keys
 * and merges them into the existing locale JSON files.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SRC  = '/home/jegger/workspace/UnitedEarth/United-Earth2022/hosting/html_src/webside_txt';
const DEST = '/home/jegger/workspace/UnitedEarth/UnitedEarth2026/src/lib/i18n/locales';

// Maps line index → key name (null = skip)
const LINE_KEYS = [
  'ws_page_title',          // 0
  null,                      // 1  "What do we stand for?" (nav duplicate)
  null,                      // 2  nav heading
  null,                      // 3  nav heading
  null,                      // 4  nav heading
  null,                      // 5  nav heading
  null,                      // 6  "What is necessary?" (nav duplicate)
  null,                      // 7  nav heading
  null,                      // 8  nav heading
  null,                      // 9  nav heading
  null,                      // 10 nav heading
  null,                      // 11 nav heading
  null,                      // 12 nav heading
  null,                      // 13 nav heading
  null,                      // 14 "What do we stand for?" (duplicate)
  'ws_saving_earth_h',       // 15
  'ws_saving_earth_text',    // 16
  'ws_peace_h',              // 17
  'ws_peace_text',           // 18
  'ws_forests_h',            // 19
  'ws_forests_text',         // 20
  'ws_science_h',            // 21
  'ws_science_text',         // 22
  null,                      // 23 "What is necessary?" (duplicate)
  'ws_greenhouse_h',         // 24
  'ws_greenhouse_text',      // 25
  'ws_greenhouse_url',       // 26
  'ws_co2_h',                // 27
  'ws_co2_text',             // 28
  'ws_co2_url',              // 29
  'ws_animals_h',            // 30
  'ws_animals_text',         // 31
  'ws_animals_url',          // 32
  'ws_preparing_h',          // 33
  'ws_preparing_text',       // 34
  'ws_preparing_url',        // 35
  'ws_awareness_h',          // 36
  'ws_awareness_text',       // 37
  'ws_awareness_url',        // 38
  null,                      // 39 "Current status Climate" (duplicate)
  null,                      // 40 url (handled separately)
  null,                      // 41 "What can everyone do?" (duplicate)
  null,                      // 42 url (handled separately)
  'ws_lets_start',           // 43
  'ws_only_with_help',       // 44
  'ws_together',             // 45
];

const files = readdirSync(SRC).filter(f => f.match(/^Inhalte_Website_(.+)\.txt$/));
let converted = 0;

for (const file of files) {
  const lang = file.match(/^Inhalte_Website_(.+)\.txt$/)[1];
  const destFile = join(DEST, `${lang}.json`);

  let existing = {};
  try { existing = JSON.parse(readFileSync(destFile, 'utf-8')); } catch {}

  // Remove BOM and split lines
  const lines = readFileSync(join(SRC, file), 'utf-8')
    .replace(/^﻿/, '')
    .split('\n')
    .map(l => l.trim());

  for (let i = 0; i < LINE_KEYS.length; i++) {
    const key = LINE_KEYS[i];
    if (!key) continue;
    const value = lines[i] ?? '';
    if (value) existing[key] = value;
  }

  writeFileSync(destFile, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  converted++;
}

console.log(`Merged webside_txt content into ${converted} locale files.`);
