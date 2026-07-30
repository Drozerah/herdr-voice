/**
 * @file src/security.test.js
 * @description Unit tests for src/security.js (Credential Redaction & Log Sanitization)
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-30
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeLogMessage, checkEndpointSecurity } from './security.js'

test('src/security.js - sanitizeLogMessage redacts api_key assignments', () => {
  const input = 'Configuration error at api_key = "sk-proj-secret1234567890"'
  const sanitized = sanitizeLogMessage(input)
  assert.equal(sanitized, 'Configuration error at api_key = "[REDACTED]"')
})

test('src/security.js - sanitizeLogMessage redacts Bearer authorization tokens', () => {
  const input = 'Request headers: authorization: Bearer my-secret-jwt-token-xyz'
  const sanitized = sanitizeLogMessage(input)
  assert.equal(sanitized, 'Request headers: authorization: Bearer [REDACTED]')
})

test('src/security.js - sanitizeLogMessage redacts standalone OpenAI-style sk- keys', () => {
  const input = 'Failed to connect using key sk-1234567890abcdefghijklmn'
  const sanitized = sanitizeLogMessage(input)
  assert.equal(sanitized, 'Failed to connect using key [REDACTED]')
})

test('src/security.js - sanitizeLogMessage preserves normal non-sensitive messages', () => {
  const input = 'Configuration loaded successfully (enabled=true).'
  const sanitized = sanitizeLogMessage(input)
  assert.equal(sanitized, 'Configuration loaded successfully (enabled=true).')
})

test('src/security.js - sanitizeLogMessage handles non-string inputs gracefully', () => {
  assert.equal(sanitizeLogMessage(null), null)
  assert.equal(sanitizeLogMessage(undefined), undefined)
  assert.equal(sanitizeLogMessage(123), 123)
})

test('src/security.js - checkEndpointSecurity returns warning for unencrypted private LAN IP HTTP endpoints', () => {
  const lanWarning = checkEndpointSecurity('http://192.168.1.50:8888/v1/audio/speech')
  assert.ok(lanWarning !== null)
  assert.ok(lanWarning.includes('Unencrypted HTTP endpoint configured on private LAN IP'))

  const lanWarning10 = checkEndpointSecurity('http://10.0.0.5:8888/v1/audio/speech')
  assert.ok(lanWarning10 !== null)

  const lanWarning172 = checkEndpointSecurity('http://172.20.0.1:8888/v1/audio/speech')
  assert.ok(lanWarning172 !== null)
})

test('src/security.js - checkEndpointSecurity returns null for loopback IP, HTTPS endpoints, and invalid URLs', () => {
  assert.equal(checkEndpointSecurity('http://127.0.0.1:8888/v1/audio/speech'), null)
  assert.equal(checkEndpointSecurity('http://localhost:8888/v1/audio/speech'), null)
  assert.equal(checkEndpointSecurity('https://api.openai.com/v1/audio/speech'), null)
  assert.equal(checkEndpointSecurity('not-a-valid-url'), null)
  assert.equal(checkEndpointSecurity(null), null)
})
