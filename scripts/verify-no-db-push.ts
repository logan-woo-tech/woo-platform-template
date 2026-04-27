import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const FORBIDDEN_PATTERNS = ['db:push', 'drizzle-kit push'];

const files = execSync('git ls-files --cached', { encoding: 'utf-8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => f.endsWith('.json') || f.endsWith('.ts') || f.endsWith('.js'));

let violations = 0;

for (const file of files) {
  if (file.includes('node_modules') || file.includes('scripts/verify-')) continue;

  const content = readFileSync(file, 'utf-8');
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (content.includes(pattern)) {
      console.error(`❌ ${file} contains forbidden pattern: ${pattern}`);
      violations++;
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} violation(s) found. db:push is FORBIDDEN.`);
  process.exit(1);
}

console.log('✅ No db:push violations found');
