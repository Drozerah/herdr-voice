/**
 * @file src/logger.test.js
 * @description Unit tests for src/logger.js (Console traces & Herdr Toast UI integration)
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-29
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { logInfo, logWarn, logError, showToast } from './logger.js'

test('src/logger.js - showToast handles standalone environment gracefully when herdr UI is undefined', () => {
  delete globalThis.herdr
  assert.doesNotThrow(() => {
    showToast('Standalone test message', 'info')
  })
})

test('src/logger.test.js - showToast triggers globalThis.herdr.ui.toast when available', () => {
  let toastCalled = false
  let toastMessage = ''
  let toastType = ''

  globalThis.herdr = {
    ui: {
      toast (msg, type) {
        toastCalled = true
        toastMessage = msg
        toastType = type
      }
    }
  }

  showToast('Test Toast Notification', 'warn')

  assert.equal(toastCalled, true)
  assert.equal(toastMessage, 'Test Toast Notification')
  assert.equal(toastType, 'warn')

  delete globalThis.herdr
})

test('src/logger.js - logInfo, logWarn, and logError format messages and optionally emit Toast UI', () => {
  let toastCount = 0

  globalThis.herdr = {
    ui: {
      toast () {
        toastCount++
      }
    }
  }

  logInfo('Info trace without toast', false)
  assert.equal(toastCount, 0)

  logInfo('Info trace with toast', true)
  assert.equal(toastCount, 1)

  logWarn('Warning trace', true)
  assert.equal(toastCount, 2)

  logError('Error trace', true)
  assert.equal(toastCount, 3)

  delete globalThis.herdr
})
