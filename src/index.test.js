/**
 * @file index.test.js
 * @description Unit tests for the main entry point
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

test('index.js - activate() returns true', async () => {
  const result = await activate({})
  assert.equal(result, true)
})
