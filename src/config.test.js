/**
 * @file src/config.test.js
 * @description Unit tests for src/config.js (Pure IETF JSON Schema Validation & TOML Loading without magic strings)
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-29
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { loadConfig, validateConfig } from './config.js'

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

test('src/config.js - loadConfig parses valid TOML file and applies env overrides', () => {
  const tempTomlPath = path.join(os.tmpdir(), 'test_herdr_plugin.toml')
  const tomlContent = `
[plugin]
name = "herdr-voice"
version = "1.0.0-alpha.1"
enabled = true

[server]
endpoint = "http://127.0.0.1:8888/v1/audio/speech"
api_key = ""
model = "mlx-kokoro"
voice = "Thomas"
speed = 1.2
response_format = "aiff"
max_input_length = 1000
max_requests_per_minute = 10

[audio]
sample_rate = 24000
channels = 1
high_water_mark = 16384

[extra_headers]
"X-Test-Key" = "test-value"

[extra_body]
custom_opt = 123
  `
  fs.writeFileSync(tempTomlPath, tomlContent)

  process.env.HERDR_TTS_VOICE = 'Alice'
  process.env.HERDR_VOICE_ENABLED = 'true'

  const schemaPath = path.resolve(process.cwd(), 'schemas/herdr-plugin.schema.json')
  const result = loadConfig(tempTomlPath, schemaPath)

  assert.equal(result.isValid, true)
  assert.equal(result.config.server.voice, 'Alice')
  assert.equal(result.config.server.speed, 1.2)
  assert.equal(result.config.extra_headers['X-Test-Key'], 'test-value')
  assert.equal(result.config.extra_body.custom_opt, 123)

  delete process.env.HERDR_TTS_VOICE
  delete process.env.HERDR_VOICE_ENABLED
  fs.unlinkSync(tempTomlPath)
})
