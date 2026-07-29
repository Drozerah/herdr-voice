/**
 * @file src/config.js
 * @description Pure IETF JSON Schema (Draft 2020-12) loader & Ajv validator for herdr-plugin.toml without magic hardcoded strings
 * @author Thomas Gauthier & Antigravity (Google DeepMind Team)
 * @date 2026-07-29
 */

import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'smol-toml'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { logInfo, logWarn, logError } from './logger.js'

let validateFn = null

/**
 * Compiles the Ajv validator using schemas/herdr-plugin.schema.json
 * @param {string} [schemaPath] - Custom path to schema file
 * @returns {Function} Ajv validation function
 */
function getValidator (schemaPath) {
  if (validateFn) return validateFn

  const resolvedPath = schemaPath || path.resolve(process.cwd(), 'schemas/herdr-plugin.schema.json')
  const schemaContent = fs.readFileSync(resolvedPath, 'utf-8')
  const schemaObj = JSON.parse(schemaContent)

  const ajv = new Ajv2020({ allErrors: true, useDefaults: true })
  addFormats(ajv)

  validateFn = ajv.compile(schemaObj)
  return validateFn
}

/**
 * Validates a parsed configuration object against the IETF JSON Schema
 * @param {Object} rawConfig - Parsed TOML object
 * @param {string} [schemaPath] - Path to JSON schema
 * @returns {{ isValid: boolean, errors: string[], config: Object }} Validation result
 */
export function validateConfig (rawConfig, schemaPath) {
  if (!rawConfig || typeof rawConfig !== 'object') {
    return {
      isValid: false,
      errors: ['Configuration object is null, undefined, or not an object.'],
      config: null
    }
  }

  const validate = getValidator(schemaPath)
  const isValid = validate(rawConfig)

  if (!isValid) {
    const errorMessages = validate.errors.map(err => {
      const fieldPath = err.instancePath ? `[${err.instancePath.substring(1).replace(/\//g, '.')}]` : 'root'
      return `Configuration error at ${fieldPath}: ${err.message}`
    })
    return { isValid: false, errors: errorMessages, config: rawConfig }
  }

  return { isValid: true, errors: [], config: rawConfig }
}

/**
 * Load, parse, apply environment overrides, and validate herdr-plugin.toml
 * @param {string} [customConfigPath] - Optional custom path to herdr-plugin.toml
 * @param {string} [customSchemaPath] - Optional custom path to JSON schema
 * @returns {{ isValid: boolean, errors: string[], config: Object|null }} Loaded configuration result
 */
export function loadConfig (customConfigPath, customSchemaPath) {
  const configPath = customConfigPath || path.resolve(process.cwd(), 'herdr-plugin.toml')

  if (!fs.existsSync(configPath)) {
    const msg = `Configuration file missing at '${configPath}'.`
    logWarn(msg, true)
    return { isValid: false, errors: [msg], config: null }
  }

  try {
    const fileContent = fs.readFileSync(configPath, 'utf-8')
    const parsedToml = parse(fileContent)

    // Environment variable overrides
    if (process.env.HERDR_VOICE_ENABLED !== undefined) {
      parsedToml.plugin = parsedToml.plugin || {}
      parsedToml.plugin.enabled = process.env.HERDR_VOICE_ENABLED === 'true' || process.env.HERDR_VOICE_ENABLED === '1'
    }
    if (process.env.HERDR_TTS_ENDPOINT) {
      parsedToml.server = parsedToml.server || {}
      parsedToml.server.endpoint = process.env.HERDR_TTS_ENDPOINT
    }
    if (process.env.HERDR_TTS_API_KEY !== undefined) {
      parsedToml.server = parsedToml.server || {}
      parsedToml.server.api_key = process.env.HERDR_TTS_API_KEY
    }
    if (process.env.HERDR_TTS_VOICE) {
      parsedToml.server = parsedToml.server || {}
      parsedToml.server.voice = process.env.HERDR_TTS_VOICE
    }

    const result = validateConfig(parsedToml, customSchemaPath)

    if (!result.isValid) {
      for (const errMsg of result.errors) {
        logError(errMsg, true)
      }
      return result
    }

    logInfo(`Configuration loaded and validated successfully against IETF JSON Schema (enabled=${result.config.plugin.enabled}).`)
    return result
  } catch (err) {
    const parseErrMsg = `Failed to parse 'herdr-plugin.toml': ${err.message}`
    logError(parseErrMsg, true)
    return { isValid: false, errors: [parseErrMsg], config: null }
  }
}
