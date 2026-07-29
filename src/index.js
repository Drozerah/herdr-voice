/**
 * @file src/index.js
 * @description Main entry point for Herdr Voice TTS plugin with Short-Circuit Evaluation
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-29
 */

import { loadConfig } from './config.js'
import { logInfo } from './logger.js'

export const metadata = {
  name: 'herdr-voice',
  description: 'Real-time TTS Voice Plugin for Herdr agents'
}

/**
 * Activates the Herdr Voice plugin with Short-Circuit Evaluation
 * @param {Object} [context={}] Herdr runtime context
 * @returns {Promise<boolean>} True if activated, false if disabled or validation failed
 */
export async function activate (context = {}) {
  // 1. SHORT-CIRCUIT EVALUATION: Check enabled flag at the very entry door
  const { isValid, config } = loadConfig()

  if (!isValid || !config || config.plugin?.enabled !== true) {
    logInfo('Plugin is disabled in configuration (enabled = false). Short-circuiting resource allocation.')
    return false
  }

  // 2. Normal execution path when enabled === true
  logInfo('Herdr Voice Plugin activated successfully.')
  return true
}
