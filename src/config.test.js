/**
 * @file src/config.test.js
 * @description Unit tests for src/config.js using static test fixtures from test/fixtures/
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-30
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import os from 'node:os'
import { loadConfig, validateConfig } from './config.js'

const FIXTURES_DIR = path.resolve(process.cwd(), 'test/fixtures')

test('src/config.js - Valid configuration passes JSON Schema validation', () => {
  const validTomlObj = {
    plugin: { name: 'herdr-voice', version: '1.0.0-alpha.1', enabled: true },
    server: {
      endpoint: 'http://127.0.0.1:8888/v1/audio/speech',
      api_key: '',
      model: 'mlx-kokoro',
      voice: 'Thomas',
      speed: 1.0,
      response_format: 'aiff',
      max_input_length: 1000,
      max_requests_per_minute: 10
    },
    audio: { sample_rate: 24000, channels: 1, high_water_mark: 16384 },
    extra_headers: { 'X-Custom-Header': 'test-val' },
    extra_body: { stability: 0.75 }
  }

  const result = validateConfig(validTomlObj)
  assert.equal(result.isValid, true)
  assert.equal(result.errors.length, 0)
  assert.equal(result.config.server.voice, 'Thomas')
})

test('src/config.js - Schema validation rejects invalid endpoint URL and negative speed', () => {
  const invalidObj = {
    plugin: { name: 'herdr-voice', version: '1.0.0-alpha.1', enabled: true },
    server: {
      endpoint: 'invalid-url-string',
      api_key: '',
      model: 'mlx-kokoro',
      voice: 'Thomas',
      speed: -5.0,
      response_format: 'aiff',
      max_input_length: 1000,
      max_requests_per_minute: 10
    },
    audio: { sample_rate: 24000, channels: 1, high_water_mark: 16384 }
  }

  const result = validateConfig(invalidObj)
  assert.equal(result.isValid, false)
  assert.ok(result.errors.length > 0)
})

test('src/config.js - loadConfig explicitly reports missing configuration file error', () => {
  const tempMissingPath = path.join(os.tmpdir(), 'non_existent_herdr_config.toml')
  const result = loadConfig(tempMissingPath)
  assert.equal(result.isValid, false)
  assert.equal(result.config, null)
  assert.ok(result.errors[0].includes('Configuration file missing'))
})

test('src/config.js - loadConfig parses valid static TOML fixture and applies env overrides', () => {
  const validFixturePath = path.join(FIXTURES_DIR, 'valid_config.toml')

  process.env.HERDR_TTS_VOICE = 'Alice'
  process.env.HERDR_TTS_ENDPOINT = 'http://127.0.0.1:9999/v1/audio/speech'
  process.env.HERDR_TTS_API_KEY = 'secret-env-key'
  process.env.HERDR_VOICE_ENABLED = 'true'

  const result = loadConfig(validFixturePath)

  assert.equal(result.isValid, true)
  assert.equal(result.config.server.voice, 'Alice')
  assert.equal(result.config.server.endpoint, 'http://127.0.0.1:9999/v1/audio/speech')
  assert.equal(result.config.server.api_key, 'secret-env-key')

  delete process.env.HERDR_TTS_VOICE
  delete process.env.HERDR_TTS_ENDPOINT
  delete process.env.HERDR_TTS_API_KEY
  delete process.env.HERDR_VOICE_ENABLED
})

test('src/config.js - loadConfig catches corrupted TOML syntax fixture gracefully', () => {
  const corruptedFixturePath = path.join(FIXTURES_DIR, 'corrupted_syntax.toml')
  const result = loadConfig(corruptedFixturePath)

  assert.equal(result.isValid, false)
  assert.equal(result.config, null)
  assert.ok(result.errors[0].includes('Failed to parse'))
})

test('src/config.js - loadConfig rejects invalid schema TOML fixture', () => {
  const invalidSchemaFixturePath = path.join(FIXTURES_DIR, 'invalid_schema.toml')
  const result = loadConfig(invalidSchemaFixturePath)

  assert.equal(result.isValid, false)
  assert.ok(result.errors.length > 0)
})

test('src/config.js - loadConfig detects unencrypted LAN IP endpoint fixture and issues security warning', () => {
  const lanFixturePath = path.join(FIXTURES_DIR, 'lan_http_config.toml')
  const result = loadConfig(lanFixturePath)

  assert.equal(result.isValid, true)
  assert.equal(result.config.server.endpoint, 'http://192.168.1.50:8888/v1/audio/speech')
})

test('src/config.js - validateConfig handles non-object primitives and null rawConfig gracefully', () => {
  const resultNull = validateConfig(null)
  assert.equal(resultNull.isValid, false)
  assert.equal(resultNull.errors[0], 'Configuration object is null, undefined, or not an object.')

  const resultString = validateConfig('not-an-object')
  assert.equal(resultString.isValid, false)
  assert.equal(resultString.errors[0], 'Configuration object is null, undefined, or not an object.')

  const resultNumber = validateConfig(12345)
  assert.equal(resultNumber.isValid, false)
})

test('src/config.js - loadConfig handles env var overrides on partial TOML missing plugin and server sections', () => {
  process.env.HERDR_VOICE_ENABLED = 'true'
  process.env.HERDR_TTS_ENDPOINT = 'http://127.0.0.1:8998/v1/audio/speech'

  const partialFixturePath = path.join(FIXTURES_DIR, 'partial_config.toml')
  const result = loadConfig(partialFixturePath)

  assert.equal(result.isValid, false)
  assert.ok(result.config.plugin.enabled)
  assert.equal(result.config.server.endpoint, 'http://127.0.0.1:8998/v1/audio/speech')

  delete process.env.HERDR_VOICE_ENABLED
  delete process.env.HERDR_TTS_ENDPOINT
})

test('src/config.js - loadConfig handles HERDR_TTS_API_KEY, HERDR_TTS_VOICE, and HERDR_SUPPRESS_LAN_WARNING fallbacks when server section is missing', () => {
  const partialFixturePath = path.join(FIXTURES_DIR, 'partial_config.toml')

  process.env.HERDR_TTS_API_KEY = 'isolated-key'
  const res1 = loadConfig(partialFixturePath)
  assert.equal(res1.config.server.api_key, 'isolated-key')
  delete process.env.HERDR_TTS_API_KEY

  process.env.HERDR_TTS_VOICE = 'isolated-voice'
  const res2 = loadConfig(partialFixturePath)
  assert.equal(res2.config.server.voice, 'isolated-voice')
  delete process.env.HERDR_TTS_VOICE

  process.env.HERDR_SUPPRESS_LAN_WARNING = 'true'
  const res3 = loadConfig(partialFixturePath)
  assert.equal(res3.config.server.suppress_lan_warning, true)
  delete process.env.HERDR_SUPPRESS_LAN_WARNING
})

test('src/config.js - loadConfig parses suppress_lan_warning_config.toml fixture and respects env override', () => {
  const fixturePath = path.join(FIXTURES_DIR, 'suppress_lan_warning_config.toml')
  const result = loadConfig(fixturePath)

  assert.equal(result.isValid, true)
  assert.equal(result.config.server.suppress_lan_warning, true)

  process.env.HERDR_SUPPRESS_LAN_WARNING = '1'
  const resultEnv = loadConfig(fixturePath)
  assert.equal(resultEnv.config.server.suppress_lan_warning, true)
  delete process.env.HERDR_SUPPRESS_LAN_WARNING
})
