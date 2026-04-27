#!/usr/bin/env tsx
/**
 * Template instantiation script.
 *
 * Usage: pnpm tsx scripts/setup.ts
 *
 * Interactive CLI that customizes the template for a new project:
 * - Renames package scope (@template -> @your-org)
 * - Updates README, CLAUDE.md
 * - Sets brand colors (optional)
 * - Generates .env.local skeleton
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = createInterface({ input, output });

interface SetupConfig {
  scope: string;
  projectName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const PLACEHOLDERS = {
  SCOPE: '@template',
  PROJECT_NAME: 'woo-platform-template',
  PRIMARY_COLOR: '#FFDD00',
  SECONDARY_COLOR: '#1E3A8A',
  ACCENT_COLOR: '#F2B84C',
};

const SKIP_PATHS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  '.turbo',
  'pnpm-lock.yaml',
  'scripts/setup.ts',
];

async function prompt(question: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  const answer = await rl.question(`${question}${suffix}: `);
  return answer.trim() || defaultValue || '';
}

async function gatherConfig(): Promise<SetupConfig> {
  console.log('\n=== Template Setup ===\n');
  console.log('This will customize the template for your new project.');
  console.log('All values can be changed manually later.\n');

  const scope = await prompt('Package scope (e.g., @your-org)', '@my-org');
  const projectName = await prompt('Project name (kebab-case)', 'my-project');
  const description = await prompt('Short description', 'My new platform');

  console.log('\n--- Brand colors (hex with #) ---');
  const primaryColor = await prompt('Primary color', PLACEHOLDERS.PRIMARY_COLOR);
  const secondaryColor = await prompt('Secondary color', PLACEHOLDERS.SECONDARY_COLOR);
  const accentColor = await prompt('Accent color', PLACEHOLDERS.ACCENT_COLOR);

  return { scope, projectName, description, primaryColor, secondaryColor, accentColor };
}

function shouldSkip(path: string): boolean {
  return SKIP_PATHS.some((skip) => path.includes(skip));
}

function walkFiles(dir: string, callback: (path: string) => void): void {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (shouldSkip(fullPath)) continue;

    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkFiles(fullPath, callback);
    } else if (stat.isFile()) {
      callback(fullPath);
    }
  }
}

function replaceInFile(path: string, replacements: Array<[string | RegExp, string]>): boolean {
  const content = readFileSync(path, 'utf-8');
  let updated = content;

  for (const [pattern, replacement] of replacements) {
    if (typeof pattern === 'string') {
      updated = updated.split(pattern).join(replacement);
    } else {
      updated = updated.replace(pattern, replacement);
    }
  }

  if (updated !== content) {
    writeFileSync(path, updated);
    return true;
  }
  return false;
}

async function applyConfig(config: SetupConfig): Promise<void> {
  console.log('\n--- Applying configuration ---\n');

  const replacements: Array<[string | RegExp, string]> = [
    [PLACEHOLDERS.SCOPE, config.scope],
    [PLACEHOLDERS.PROJECT_NAME, config.projectName],
    [PLACEHOLDERS.PRIMARY_COLOR, config.primaryColor],
    [PLACEHOLDERS.SECONDARY_COLOR, config.secondaryColor],
    [PLACEHOLDERS.ACCENT_COLOR, config.accentColor],
  ];

  let modifiedCount = 0;

  walkFiles('.', (path) => {
    const ext = path.split('.').pop()?.toLowerCase();
    const allowedExts = ['ts', 'tsx', 'json', 'md', 'yml', 'yaml', 'css', 'mjs', 'cjs'];
    if (!ext || !allowedExts.includes(ext)) return;

    try {
      if (replaceInFile(path, replacements)) {
        modifiedCount++;
      }
    } catch (error) {
      console.warn(`Could not process ${path}:`, error instanceof Error ? error.message : error);
    }
  });

  console.log(`✅ Modified ${modifiedCount} files\n`);
}

async function generateEnvSkeleton(): Promise<void> {
  if (existsSync('.env.local')) {
    console.log('⚠️  .env.local already exists, skipping generation\n');
    return;
  }

  if (!existsSync('.env.example')) {
    console.log('⚠️  .env.example not found, skipping skeleton generation\n');
    return;
  }

  const example = readFileSync('.env.example', 'utf-8');
  writeFileSync('.env.local', example);
  console.log('✅ Created .env.local from .env.example\n');
  console.log('   Fill in your credentials before running pnpm dev\n');
}

async function symlinkEnvLocal(): Promise<void> {
  const target = 'apps/web/.env.local';
  if (existsSync(target)) {
    console.log('⚠️  apps/web/.env.local already exists, skipping symlink\n');
    return;
  }

  try {
    const { symlinkSync } = await import('fs');
    symlinkSync('../../.env.local', target);
    console.log('✅ Created apps/web/.env.local symlink\n');
  } catch (error) {
    console.warn(`Could not create symlink:`, error instanceof Error ? error.message : error);
  }
}

async function main(): Promise<void> {
  try {
    const config = await gatherConfig();

    console.log('\n--- Configuration ---');
    console.log(`Scope: ${config.scope}`);
    console.log(`Project: ${config.projectName}`);
    console.log(`Description: ${config.description}`);
    console.log(
      `Colors: ${config.primaryColor} / ${config.secondaryColor} / ${config.accentColor}`,
    );

    const confirm = await prompt('\nProceed? (y/n)', 'y');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Cancelled.');
      process.exit(0);
    }

    await applyConfig(config);
    await generateEnvSkeleton();
    await symlinkEnvLocal();

    console.log('\n=== Setup complete ===\n');
    console.log('Next steps:');
    console.log('1. Fill in .env.local with your credentials');
    console.log('2. Run: pnpm install');
    console.log('3. Run: pnpm verify:all');
    console.log('4. Run: pnpm dev');
    console.log('5. Open: http://localhost:3000\n');
  } finally {
    rl.close();
  }
}

main();
