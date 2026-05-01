import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, realpath } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, inspect } from 'node:util';

import { createColors } from 'colorette';

export let SCRIPT_VERSION;
SCRIPT_VERSION ??= '0.4.0';

export const PACKAGE_NAME = '@tanaabased/theme';
export const DOCS_ROOT_ENV_VAR = 'TANAAB_DOCS_ROOT';

const IGNORED_DIRS = new Set(['.git', 'node_modules']);
const DEFAULT_PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function isColorEnabled(env, argv, stream) {
  if (env.NO_COLOR !== undefined || argv.includes('--no-color')) return false;
  if (argv.includes('--color')) return true;
  if (env.FORCE_COLOR !== undefined) {
    return !['', '0', 'false', 'no', 'off'].includes(String(env.FORCE_COLOR).trim().toLowerCase());
  }
  if (stream?.isTTY && env.TERM && env.TERM !== 'dumb') return true;

  return false;
}

function createStyle(env, argv, stdout) {
  const colors = createColors({ useColor: isColorEnabled(env, argv, stdout) });

  return {
    ...colors,
    tp: colors.green,
    ts: colors.magenta,
  };
}

function writeLine(stream, message = '', ...args) {
  const output = typeof message === 'string' ? message : inspect(message);
  stream.write(`${format(output, ...args)}\n`);
}

function writeError(stream, message = '') {
  stream.write(`${message}\n`);
}

/**
 * Parses the public sync-assets CLI flags.
 *
 * @param {string[]} argv Argument vector without the executable and script name.
 * @returns {{ docsRoot: string | undefined, help: boolean, version: boolean }}
 * Parsed CLI intent.
 * @throws {Error} When the user supplies an unknown option, positional argument, or
 * a missing option value.
 */
export function parseArgs(argv) {
  let help = false;
  let version = false;
  let docsRoot;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      help = true;
      continue;
    }

    if (arg === '-V' || arg === '--version') {
      version = true;
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

  return { docsRoot, help, version };
}

/**
 * Builds the CLI help text with computed defaults and current color policy.
 */
export function formatUsage({ cliName = 'sync-assets', defaultDocsRoot, style }) {
  return `
Usage: ${style.bold(cliName)} ${style.dim(
    `[${DOCS_ROOT_ENV_VAR}=<path>] [--docs-root <path>] [--help] [--version]`,
  )}

Copies ${PACKAGE_NAME} public assets into <docs-root>/public.

${style.tp('Options')}:
  --docs-root        docs root path override ${style.dim(`[default: ${defaultDocsRoot}]`)}
  -h, --help         Show this help message
  -V, --version      Show this script version

${style.tp('Environment Variables')}:
  ${DOCS_ROOT_ENV_VAR}       docs root path override

`;
}

export function findSearchRoot(startDir) {
  let current = startDir;
  let reachedFilesystemRoot = false;

  while (!reachedFilesystemRoot) {
    if (existsSync(resolve(current, '.git')) || existsSync(resolve(current, 'package.json'))) {
      return current;
    }

    const parent = dirname(current);
    reachedFilesystemRoot = parent === current;
    current = parent;
  }

  return startDir;
}

export async function findVitepressDocsRoots(searchRoot) {
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

export async function detectDocsRoot(cwd) {
  const searchRoot = findSearchRoot(cwd);
  const docsRoots = await findVitepressDocsRoots(searchRoot);

  if (docsRoots.length === 0) {
    throw new Error(
      'Unable to auto-detect docs root (.vitepress not found). Use --docs-root <path>.',
    );
  }

  if (docsRoots.length > 1) {
    const found = docsRoots.map((docsRoot) => `  - ${docsRoot}`).join('\n');
    throw new Error(`Found multiple .vitepress directories. Use --docs-root <path>.\n${found}`);
  }

  return docsRoots[0];
}

export async function resolveDocsRoot(cwd, docsRootOverride) {
  if (docsRootOverride) return resolve(cwd, docsRootOverride);
  return detectDocsRoot(cwd);
}

export function getUsageDefault(cwd, detectedDocsRoot, docsRootError) {
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

/**
 * Runs the sync-assets CLI against injected process boundaries.
 *
 * @param {object} [options] Runtime boundaries used by tests and the bin wrapper.
 * @returns {Promise<number>} Process-style exit code.
 */
export async function runSyncAssetsCli(options = {}) {
  const argv = options.argv ?? process.argv.slice(2);
  const env = options.env ?? process.env;
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const entrypoint = options.entrypoint ?? process.argv[1];
  const style = createStyle(env, argv, stdout);

  try {
    const { docsRoot: cliDocsRoot, help, version } = parseArgs(argv);

    if (version) {
      writeLine(stdout, `sync-assets ${SCRIPT_VERSION}`);
      return 0;
    }

    const cwd = await realpath(options.cwd ?? process.cwd());
    const packageRoot = await realpath(options.packageRoot ?? DEFAULT_PACKAGE_ROOT);

    let detectedDocsRoot;
    let docsRootError;
    try {
      detectedDocsRoot = await detectDocsRoot(cwd);
    } catch (error) {
      docsRootError = error;
    }

    if (help) {
      const cliName = entrypoint ? entrypoint.split('/').pop() : 'sync-assets';
      writeLine(
        stdout,
        formatUsage({
          cliName,
          defaultDocsRoot: getUsageDefault(cwd, detectedDocsRoot, docsRootError),
          style,
        }).trimEnd(),
      );
      return 0;
    }

    if (cwd === packageRoot || cwd.startsWith(`${packageRoot}${sep}`)) {
      throw new Error(
        `Cannot sync assets to ${PACKAGE_NAME} itself. Run this from a consuming theme repo.`,
      );
    }

    const sourcePublicDir = resolve(packageRoot, 'public');
    if (!existsSync(sourcePublicDir)) {
      throw new Error(`Source assets directory not found: ${sourcePublicDir}`);
    }

    const docsRootDir = await resolveDocsRoot(cwd, cliDocsRoot ?? env[DOCS_ROOT_ENV_VAR]);
    const destinationPublicDir = resolve(docsRootDir, 'public');
    await copyDirectoryContents(sourcePublicDir, destinationPublicDir);

    writeLine(
      stdout,
      '%s assets synced from %s to %s',
      style.green('successfully'),
      style.ts(PACKAGE_NAME),
      style.ts(destinationPublicDir),
    );

    return 0;
  } catch (error) {
    writeError(stderr, `${style.red('sync-assets failed:')} ${error.message}`);
    return 1;
  }
}
