// The version our one-line DeepSeek Harness installer hands the user and the
// versions the daemon stands behind live in two places that cannot import each
// other: `apps/landing-page/public/install-dsh.*` and the agent def in
// `apps/daemon`. They drifted once already — the installers were moved to
// `0.1.0-rc.8` while the def still named `0.1.0-rc.6` as the only supported
// version, so following our own instructions produced an "untested version"
// warning in Settings on a clean install.
//
// This guard pins the two together across the app boundary: bumping an
// installer without teaching the daemon to accept what it installs fails here.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

const INSTALL_SH = `${repoRoot}apps/landing-page/public/install-dsh.sh`;
const INSTALL_PS1 = `${repoRoot}apps/landing-page/public/install-dsh.ps1`;
const AGENT_DEF = `${repoRoot}apps/daemon/src/runtimes/defs/deepseek-harness.ts`;

function requireMatch(source: string, pattern: RegExp, what: string): string {
  const found = pattern.exec(source);
  const captured = found?.[1];
  if (!captured) throw new Error(`could not read ${what}`);
  return captured;
}

/** The exact versions the daemon declares it has exercised. */
function readSupportedVersions(source: string): string[] {
  const list = requireMatch(
    source,
    /supportedVersions:\s*\[([^\]]*)\]/u,
    'supportedVersions',
  );
  return [...list.matchAll(/'([^']+)'/gu)]
    .map((entry) => entry[1])
    .filter((entry): entry is string => typeof entry === 'string');
}

/**
 * The release line the daemon accepts beyond the exercised list, rebuilt from
 * the literal in source. Absent is a valid answer — it just means the def only
 * accepts exact matches.
 */
function readSupportedVersionPattern(source: string): RegExp | null {
  const found = /supportedVersionPattern:\s*\/(.+?)\/([a-z]*)\s*,/u.exec(source);
  const body = found?.[1];
  const flags = found?.[2];
  if (!body) return null;
  return new RegExp(body, flags ?? '');
}

function accepts(source: string, version: string): boolean {
  if (readSupportedVersions(source).includes(version)) return true;
  return readSupportedVersionPattern(source)?.test(version) ?? false;
}

describe('DeepSeek Harness installer and daemon version policy agree', () => {
  it('accepts the version both installers pin', async () => {
    const [sh, ps1, def] = await Promise.all([
      readFile(INSTALL_SH, 'utf8'),
      readFile(INSTALL_PS1, 'utf8'),
      readFile(AGENT_DEF, 'utf8'),
    ]);

    const shVersion = requireMatch(sh, /DSH_VERSION='([^']+)'/u, 'DSH_VERSION');
    const ps1Version = requireMatch(ps1, /\$DshVersion\s*=\s*'([^']+)'/u, '$DshVersion');

    expect(ps1Version).toBe(shVersion);
    expect(accepts(def, shVersion)).toBe(true);
  });

  // The point is to stop pinning one release candidate, not to stop checking.
  // A version off the line the def declares must still be reported as untested.
  it('still rejects a version off the declared release line', async () => {
    const def = await readFile(AGENT_DEF, 'utf8');

    expect(accepts(def, '0.0.9')).toBe(false);
    expect(accepts(def, 'not-a-version')).toBe(false);
  });
});
