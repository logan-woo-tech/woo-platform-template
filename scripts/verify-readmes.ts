import { existsSync } from 'fs';
import { readdirSync } from 'fs';
import { join } from 'path';

const REQUIRED_README_DIRS = ['packages', 'apps'];

let violations = 0;

for (const dir of REQUIRED_README_DIRS) {
  const subdirs = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const subdir of subdirs) {
    const readmePath = join(dir, subdir, 'README.md');
    if (!existsSync(readmePath)) {
      console.error(`❌ Missing README: ${readmePath}`);
      violations++;
    }
  }
}

if (violations > 0) {
  process.exit(1);
}

console.log('✅ All packages and apps have README.md');
