// The Settings/onboarding "Test" smoke run is bounded by a shared 45s budget
// that assumes a fast-booting CLI. Adapters whose startup dominates the round
// trip declare their own ceiling so a healthy install cannot report `timeout`.

import { describe, expect, it } from 'vitest';
import { resolveAgentConnectionTestTimeoutMs } from '../../src/connectionTest.js';

const SHARED_AGENT_DEFAULT_MS = 45_000;

describe('per-agent connection test budget', () => {
  // Measured on Windows: 26-27s warm, 32.8s cold, for a prompt whose model
  // round trip is ~1.5s. The shared default sat inside that distribution, so
  // a working Copilot install intermittently failed its own Test button.
  it('gives Copilot a budget clear of its measured cold-start spread', () => {
    expect(resolveAgentConnectionTestTimeoutMs('copilot', {})).toBeGreaterThanOrEqual(90_000);
  });

  it('keeps the operator env override authoritative over the adapter budget', () => {
    expect(
      resolveAgentConnectionTestTimeoutMs('copilot', {
        OD_CONNECTION_TEST_AGENT_TIMEOUT_MS: '5000',
      }),
    ).toBe(5_000);
  });

  it('leaves adapters without their own budget on the shared default', () => {
    expect(resolveAgentConnectionTestTimeoutMs('claude', {})).toBe(SHARED_AGENT_DEFAULT_MS);
  });
});
