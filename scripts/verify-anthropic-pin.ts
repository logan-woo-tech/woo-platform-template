import { readFileSync } from 'fs';
import { glob } from 'glob';

const packageFiles = glob.sync('**/package.json', {
  ignore: ['**/node_modules/**'],
});

let violations = 0;

for (const file of packageFiles) {
  const pkg = JSON.parse(readFileSync(file, 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  for (const [name, version] of Object.entries(deps)) {
    if (name === '@anthropic-ai/sdk') {
      if (typeof version === 'string' && (version.startsWith('^') || version.startsWith('~'))) {
        console.error(`❌ ${file}: Anthropic SDK must be exact-pinned. Found: ${version}`);
        violations++;
      }
    }
  }
}

if (violations > 0) {
  process.exit(1);
}

console.log('✅ Anthropic SDK exact-pinned everywhere');
