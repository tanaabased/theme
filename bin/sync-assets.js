#!/usr/bin/env bun

import { runSyncAssetsCli } from '../lib/sync-assets-cli.js';

const exitCode = await runSyncAssetsCli();

if (exitCode !== 0) {
  process.exit(exitCode);
}
