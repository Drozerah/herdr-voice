/**
 * @file src/logger.js
 * @description Centralized logging service with ISO timestamped console traces & Herdr Toast UI notifications
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-29
 */

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
  if (typeof globalThis.herdr?.ui?.toast === 'function') {
    globalThis.herdr.ui.toast(message, type)
  }
}

/**
 * Log informational trace to system console & optional Toast UI
 * @param {string} message - Message text to log
 * @param {boolean} [notifyToast=false] - Whether to also emit a Toast UI notification
 */
export function logInfo (message, notifyToast = false) {
  const formatted = `[${getTimestamp()}] 🔊 [HERDR-VOICE] [INFO] ${message}`
  console.log(formatted)
  if (notifyToast) {
    showToast(message, 'info')
  }
}

/**
 * Log warning message to system console & optional Toast UI
 * @param {string} message - Warning message text
 * @param {boolean} [notifyToast=true] - Whether to also emit a Toast UI warning
 */
export function logWarn (message, notifyToast = true) {
  const formatted = `[${getTimestamp()}] ⚠️ [HERDR-VOICE] [WARN] ${message}`
  console.warn(formatted)
  if (notifyToast) {
    showToast(message, 'warn')
  }
}

/**
 * Log error message to system console & Herdr Toast UI
 * @param {string} message - Error message text
 * @param {boolean} [notifyToast=true] - Whether to also emit a Toast UI error
 */
export function logError (message, notifyToast = true) {
  const formatted = `[${getTimestamp()}] ❌ [HERDR-VOICE] [ERROR] ${message}`
  console.error(formatted)
  if (notifyToast) {
    showToast(message, 'error')
  }
}
