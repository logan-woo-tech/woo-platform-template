import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface MessagesObject {
  [key: string]: string | MessagesObject;
}

function getKeys(obj: MessagesObject, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getKeys(value, path);
    }
    return [path];
  });
}

const MESSAGES_DIR = 'apps/web/messages';
const REQUIRED_LOCALES = ['vi', 'en'];

if (!existsSync(MESSAGES_DIR)) {
  console.log(`✅ Locale verification skipped (${MESSAGES_DIR} does not exist yet)`);
  process.exit(0);
}

const localesData: Record<string, MessagesObject> = {};

for (const locale of REQUIRED_LOCALES) {
  const path = join(MESSAGES_DIR, `${locale}.json`);
  if (!existsSync(path)) {
    console.error(`❌ Missing locale file: ${path}`);
    process.exit(1);
  }
  try {
    localesData[locale] = JSON.parse(readFileSync(path, 'utf-8')) as MessagesObject;
  } catch (error) {
    console.error(`❌ Failed to parse ${path}:`, error);
    process.exit(1);
  }
}

const allKeys: Record<string, Set<string>> = {};
for (const [locale, data] of Object.entries(localesData)) {
  allKeys[locale] = new Set(getKeys(data));
}

const referenceLocale = REQUIRED_LOCALES[0];
if (!referenceLocale) {
  console.error('❌ No reference locale defined');
  process.exit(1);
}

const referenceKeys = allKeys[referenceLocale];
if (!referenceKeys) {
  console.error(`❌ Reference locale ${referenceLocale} has no keys`);
  process.exit(1);
}

let violations = 0;

for (const locale of REQUIRED_LOCALES.slice(1)) {
  const localeKeys = allKeys[locale];
  if (!localeKeys) continue;

  const missingInLocale = [...referenceKeys].filter((k) => !localeKeys.has(k));
  const extraInLocale = [...localeKeys].filter((k) => !referenceKeys.has(k));

  if (missingInLocale.length > 0) {
    console.error(`❌ ${locale}.json missing keys present in ${referenceLocale}.json:`);
    missingInLocale.forEach((k) => console.error(`   - ${k}`));
    violations += missingInLocale.length;
  }

  if (extraInLocale.length > 0) {
    console.error(`❌ ${locale}.json has extra keys not in ${referenceLocale}.json:`);
    extraInLocale.forEach((k) => console.error(`   - ${k}`));
    violations += extraInLocale.length;
  }
}

if (violations > 0) {
  console.error(`\n${violations} violation(s) found. Locale files must have matching keys.`);
  process.exit(1);
}

console.log(`✅ All locales (${REQUIRED_LOCALES.join(', ')}) have matching keys`);
