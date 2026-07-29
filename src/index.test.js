/**
 * @file index.test.js
 * @description Unit tests for the main entry point with Short-Circuit Evaluation
 * @author Thomas Gauthier
 * @date 2026-07-28
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { metadata, activate } from './index.js'

test('index.js - metadata validation', () => {
  assert.equal(metadata.name, 'herdr-voice')
  assert.ok(metadata.description.length > 0)
})

test('index.js - activate() returns true when plugin is enabled', async () => {
  delete process.env.HERDR_VOICE_ENABLED
  const result = await activate({})
  assert.equal(result, true)
})

test('index.js - activate() short-circuits and returns false when enabled is false', async () => {
  process.env.HERDR_VOICE_ENABLED = 'false'
  const result = await activate({})
  assert.equal(result, false)
  delete process.env.HERDR_VOICE_ENABLED
})
