/**
 * @file src/security.js
 * @description Centralized security module for sanitizing sensitive credentials and redacting API keys
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-30
 */

/**
 * Sanitizes and redacts sensitive credentials (API keys, Bearer tokens) from log messages
 * @param {string} message - Original log or error message string
 * @returns {string} Sanitized string with redacted credentials
 */
export function sanitizeLogMessage (message) {
  if (typeof message !== 'string') {
    return message
  }

  return message
    .replace(/(api_key\s*[:=]\s*["']?)([^"'\s,]+)(["']?)/gi, '$1[REDACTED]$3')
    .replace(/(authorization\s*[:=]\s*["']?bearer\s+)([^"'\s,]+)(["']?)/gi, '$1[REDACTED]$3')
    .replace(/\b(sk-[a-zA-Z0-9_-]{10,})\b/g, '[REDACTED]')
}

/**
 * Checks endpoint URL for unencrypted HTTP on private LAN IP ranges
 * @param {string} endpointUrl - Endpoint URL to check
 * @returns {string|null} Security warning string if unencrypted LAN IP detected, null otherwise
 */
export function checkEndpointSecurity (endpointUrl) {
  if (typeof endpointUrl !== 'string') {
    return null
  }

  try {
    const parsed = new URL(endpointUrl)
    const protocol = parsed.protocol.toLowerCase()
    const hostname = parsed.hostname.toLowerCase()

    if (protocol === 'http:') {
      if (hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '::1') {
        return null
      }

      const isPrivateLanIp =
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)

      if (isPrivateLanIp) {
        return `Unencrypted HTTP endpoint configured on private LAN IP (${endpointUrl}). Ensure your local network is trusted or enable HTTPS/TLS.`
      }
    }
  } catch (_err) {
    // URL parsing errors handled by Ajv schema validation
  }

  return null
}
