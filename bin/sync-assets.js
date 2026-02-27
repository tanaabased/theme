#!/usr/bin/env bun

import { cp, mkdir, readdir, realpath } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, inspect } from 'node:util';
import { bold, dim, green, magenta, red } from 'colorette';

const PACKAGE_NAME = '@tanaabased/theme';
const DOCS_ROOT_ENV_VAR = 'TANAAB_DOCS_ROOT';
const IGNORED_DIRS = new Set(['.git', 'node_modules']);

const log = (message = '', ...args) => {
  const output = typeof message === 'string' ? message : inspect(message);
  process.stdout.write(format(output, ...args) + '\n');
};

function printUsage(defaultDocsRoot) {
  log(`
Usage: ${dim(`[${DOCS_ROOT_ENV_VAR}=<path>]`)} ${bold(`${process.argv[1] ? process.argv[1].split('/').pop() : 'sync-assets'} [--docs-root <path>] [--help]`)}

Copies ${PACKAGE_NAME} public assets into <docs-root>/public.

${green('Options')}:
  --docs-root        docs root path override ${dim(`[default: ${defaultDocsRoot}]`)}
  -h, --help                 Show this help message

${green('Environment Variables')}:
  ${DOCS_ROOT_ENV_VAR}       docs root path override

`);
}

function parseArgs(argv) {
  let help = false;
  let docsRoot;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      help = true;
      continue;
    }

    if (arg === '--docs-root') {
      const next = argv[i + 1];
      if (!next) throw new Error('Missing value for --docs-root');
      docsRoot = next;
      i++;
      continue;
    }

    if (arg.startsWith('--docs-root=')) {
      docsRoot = arg.split('=', 2)[1] || '';
      if (!docsRoot) throw new Error('Missing value for --docs-root');
      continue;
    }

    if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    throw new Error(`Positional arguments are not supported: "${arg}". Use --docs-root <path>.`);
  }

  return { docsRoot, help };
}

function findSearchRoot(startDir) {
  let current = startDir;
  let reachedFilesystemRoot = false;

  while (!reachedFilesystemRoot) {
    if (existsSync(resolve(current, '.git')) || existsSync(resolve(current, 'package.json'))) return current;
    const parent = dirname(current);
    reachedFilesystemRoot = parent === current;
    current = parent;
  }

  return startDir;
}

async function findVitepressDocsRoots(searchRoot) {
  const roots = new Set();

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (IGNORED_DIRS.has(entry.name)) continue;

      const fullPath = resolve(dir, entry.name);
      if (entry.name === '.vitepress') {
        roots.add(dir);
        continue;
      }

      await walk(fullPath);
    }
  }

  await walk(searchRoot);
  return [...roots];
}

async function detectDocsRoot(cwd) {
  const searchRoot = findSearchRoot(cwd);
  const docsRoots = await findVitepressDocsRoots(searchRoot);

  if (docsRoots.length === 0) throw new Error('Unable to auto-detect docs root (.vitepress not found). Use --docs-root <path>.');
  if (docsRoots.length > 1) {
    const found = docsRoots.map((docsRoot) => `  - ${docsRoot}`).join('\n');
    throw new Error(`Found multiple .vitepress directories. Use --docs-root <path>.\n${found}`);
  }

  return docsRoots[0];
}

async function resolveDocsRoot(cwd, docsRootOverride) {
  if (docsRootOverride) return resolve(cwd, docsRootOverride);
  return detectDocsRoot(cwd);
}

function getUsageDefault(cwd, detectedDocsRoot, docsRootError) {
  if (detectedDocsRoot) return relative(cwd, detectedDocsRoot) || '.';
  if (docsRootError) return `auto-detect failed (${docsRootError.message})`;
  return 'auto-detect failed';
}

async function copyDirectoryContents(sourceDir, destinationDir) {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  await mkdir(destinationDir, { recursive: true });

  for (const entry of entries) {
    const src = resolve(sourceDir, entry.name);
    const dest = resolve(destinationDir, entry.name);
    await cp(src, dest, { recursive: true, force: true });
  }
}

async function main() {
  const { docsRoot: cliDocsRoot, help } = parseArgs(process.argv.slice(2));
  const cwd = await realpath(process.cwd());
  const packageRoot = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
  const envDocsRoot = process.env[DOCS_ROOT_ENV_VAR];

  let detectedDocsRoot;
  let docsRootError;
  try {
    detectedDocsRoot = await detectDocsRoot(cwd);
  } catch (error) {
    docsRootError = error;
  }

  if (help) {
    printUsage(getUsageDefault(cwd, detectedDocsRoot, docsRootError));
    return;
  }

  if (cwd === packageRoot || cwd.startsWith(`${packageRoot}${sep}`)) {
    throw new Error(`Cannot sync assets to ${PACKAGE_NAME} itself. Run this from a consuming theme repo.`);
  }

  const sourcePublicDir = resolve(packageRoot, 'public');
  if (!existsSync(sourcePublicDir)) {
    throw new Error(`Source assets directory not found: ${sourcePublicDir}`);
  }

  const docsRootDir = await resolveDocsRoot(cwd, cliDocsRoot ?? envDocsRoot);
  const destinationPublicDir = resolve(docsRootDir, 'public');
  await copyDirectoryContents(sourcePublicDir, destinationPublicDir);

  log('%s assets synced from %s to %s', green('successfully'), magenta(PACKAGE_NAME), magenta(destinationPublicDir));
}

main().catch((error) => {
  process.stderr.write(`${red('sync-assets failed:')} ${error.message}\n`);
  process.exit(1);
});
