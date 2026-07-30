/**
 * @file src/logger.js
 * @description Centralized logging service with ISO timestamped console traces & Herdr Toast UI notifications
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-29
 */

import { sanitizeLogMessage } from './security.js'

/**
 * Format ISO timestamp string (HH:MM:SS)
 * @returns {string} Timestamp string
 */
function getTimestamp () {
  return new Date().toISOString().substring(11, 19)
}

/**
 * Triggers a visual Toast UI notification in the Herdr interface
 * @param {string} message - Notification text to display
 * @param {'info'|'warn'|'error'|'success'} [type='info'] - Notification alert level
 */
export function showToast (message, type = 'info') {
  const cleanMessage = sanitizeLogMessage(message)
  if (typeof globalThis.herdr?.ui?.toast === 'function') {
    globalThis.herdr.ui.toast(cleanMessage, type)
  }
}

/**
 * Log informational trace to system console & optional Toast UI
 * @param {string} message - Message text to log
 * @param {boolean} [notifyToast=false] - Whether to also emit a Toast UI notification
 */
export function logInfo (message, notifyToast = false) {
  const cleanMessage = sanitizeLogMessage(message)
  const formatted = `[${getTimestamp()}] 🔊 [HERDR-VOICE] [INFO] ${cleanMessage}`
  console.log(formatted)
  if (notifyToast) {
    showToast(cleanMessage, 'info')
  }
}

/**
 * Log warning message to system console & optional Toast UI
 * @param {string} message - Warning message text
 * @param {boolean} [notifyToast=true] - Whether to also emit a Toast UI warning
 */
export function logWarn (message, notifyToast = true) {
  const cleanMessage = sanitizeLogMessage(message)
  const formatted = `[${getTimestamp()}] ⚠️ [HERDR-VOICE] [WARN] ${cleanMessage}`
  console.warn(formatted)
  if (notifyToast) {
    showToast(cleanMessage, 'warn')
  }
}

/**
 * Log error message to system console & Herdr Toast UI
 * @param {string} message - Error message text
 * @param {boolean} [notifyToast=true] - Whether to also emit a Toast UI error
 */
export function logError (message, notifyToast = true) {
  const cleanMessage = sanitizeLogMessage(message)
  const formatted = `[${getTimestamp()}] ❌ [HERDR-VOICE] [ERROR] ${cleanMessage}`
  console.error(formatted)
  if (notifyToast) {
    showToast(cleanMessage, 'error')
  }
}
