/**
 * @file index.js
 * @description Main entry point for the Herdr Voice TTS plugin
 * @author Thomas Gauthier
 * @date 2026-07-28
 */

export const metadata = {
  name: 'herdr-voice',
  description: 'Real-time TTS Voice Plugin for Herdr agents'
}

/**
 * Activates the Herdr Voice plugin
 * @param {Object} context Herdr runtime context
 * @returns {Promise<boolean>} Success status
 */
export async function activate (context) {
  return true
}
