import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import {
  DOCS_ROOT_ENV_VAR,
  detectDocsRoot,
  parseArgs,
  runSyncAssetsCli,
} from '../lib/sync-assets-cli.js';

function createStream() {
  return {
    output: '',
    isTTY: false,
    write(chunk) {
      this.output += chunk;
    },
  };
}

async function createTempDir() {
  return mkdtemp(resolve(tmpdir(), 'tanaab-theme-sync-assets-'));
}

async function createPackageRoot() {
  const packageRoot = await createTempDir();
  await mkdir(resolve(packageRoot, 'public/images'), { recursive: true });
  await writeFile(resolve(packageRoot, 'public/favicon.ico'), 'ico');
  await writeFile(resolve(packageRoot, 'public/images/tms.png'), 'png');

  return packageRoot;
}

describe('lib/sync-assets-cli', () => {
  it('should parse help, version, and docs root options', () => {
    assert.deepEqual(parseArgs(['--help']), {
      docsRoot: undefined,
      help: true,
      version: false,
    });
    assert.deepEqual(parseArgs(['-V']), {
      docsRoot: undefined,
      help: false,
      version: true,
    });
    assert.deepEqual(parseArgs(['--docs-root', 'docs']), {
      docsRoot: 'docs',
      help: false,
      version: false,
    });
    assert.deepEqual(parseArgs(['--docs-root=site']), {
      docsRoot: 'site',
      help: false,
      version: false,
    });
    assert.throws(() => parseArgs(['--unknown']), /Unknown option/);
  });

  it('should print forced-color help with dimmed usage and defaults', async () => {
    const stdout = createStream();
    const stderr = createStream();
    const exitCode = await runSyncAssetsCli({
      argv: ['--help'],
      cwd: process.cwd(),
      env: { FORCE_COLOR: '1', TERM: 'xterm-256color' },
      entrypoint: '/usr/local/bin/sync-assets',
      stdout,
      stderr,
    });

    assert.equal(exitCode, 0);
    assert.equal(stderr.output, '');
    assert.match(stdout.output, /Usage: /);
    assert.equal(stdout.output.includes('\u001B[2m['), true);
    assert.match(stdout.output, /--version/);
  });

  it('should print the version without running detection or copy behavior', async () => {
    const stdout = createStream();
    const stderr = createStream();
    const exitCode = await runSyncAssetsCli({
      argv: ['--version'],
      cwd: '/private/tmp/tanaab-theme-missing-version-cwd',
      stdout,
      stderr,
    });

    assert.equal(exitCode, 0);
    assert.match(stdout.output, /^sync-assets \d+\.\d+\.\d+/);
    assert.equal(stderr.output, '');
  });

  it('should report unknown options on stderr', async () => {
    const stdout = createStream();
    const stderr = createStream();
    const exitCode = await runSyncAssetsCli({
      argv: ['--unknown'],
      cwd: process.cwd(),
      env: { NO_COLOR: '1' },
      stdout,
      stderr,
    });

    assert.equal(exitCode, 1);
    assert.equal(stdout.output, '');
    assert.match(stderr.output, /sync-assets failed: Unknown option: --unknown/);
  });

  it('should reject syncing the package to itself', async () => {
    const packageRoot = await createPackageRoot();
    const stdout = createStream();
    const stderr = createStream();

    try {
      const exitCode = await runSyncAssetsCli({
        argv: [],
        cwd: packageRoot,
        packageRoot,
        stdout,
        stderr,
      });

      assert.equal(exitCode, 1);
      assert.match(stderr.output, /Cannot sync assets to @tanaabased\/theme itself/);
    } finally {
      await rm(packageRoot, { recursive: true, force: true });
    }
  });

  it('should auto-detect a VitePress docs root', async () => {
    const root = await createTempDir();

    try {
      await mkdir(resolve(root, 'docs/.vitepress'), { recursive: true });
      await writeFile(resolve(root, 'package.json'), '{}');

      assert.equal(await detectDocsRoot(root), resolve(root, 'docs'));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('should copy package public assets into the resolved docs public directory', async () => {
    const packageRoot = await createPackageRoot();
    const consumerRoot = await createTempDir();
    const stdout = createStream();
    const stderr = createStream();

    try {
      await mkdir(resolve(consumerRoot, 'docs/.vitepress'), { recursive: true });
      await writeFile(resolve(consumerRoot, 'package.json'), '{}');

      const exitCode = await runSyncAssetsCli({
        argv: [],
        cwd: consumerRoot,
        env: {
          [DOCS_ROOT_ENV_VAR]: 'docs',
        },
        packageRoot,
        stdout,
        stderr,
      });

      assert.equal(exitCode, 0);
      assert.equal(stderr.output, '');
      assert.match(stdout.output, /successfully assets synced/);
      assert.equal(await readFile(resolve(consumerRoot, 'docs/public/favicon.ico'), 'utf8'), 'ico');
      await stat(resolve(consumerRoot, 'docs/public/images/tms.png'));
    } finally {
      await rm(packageRoot, { recursive: true, force: true });
      await rm(consumerRoot, { recursive: true, force: true });
    }
  });
});
