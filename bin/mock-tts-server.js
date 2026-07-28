/**
 * @file mock-tts-server.js
 * @description Local HTTP Mock TTS Inference Server with os.tmpdir() portability and NODE_ENV environment awareness
 * @author Thomas Gauthier
 * @date 2026-07-26
 */

import 'dotenv/config'
import http from 'node:http'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const PORT = process.env.PORT || 8888
const AUDIO_FILE = path.join(os.tmpdir(), 'herdr_mock_speech.aiff')
const NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * Creates a minimal valid AIFF audio header buffer for headless CI/CD & test runners
 * @returns {Buffer} Binary audio buffer
 */
function createDummyAudioBuffer () {
  return Buffer.from([
    0x46, 0x4F, 0x52, 0x4D, 0x00, 0x00, 0x00, 0x2E,
    0x41, 0x49, 0x46, 0x46, 0x43, 0x4F, 0x4D, 0x4D,
    0x00, 0x00, 0x00, 0x12, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x64, 0x00, 0x10, 0x40, 0x0E, 0xAC, 0x44,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ])
}

/**
 * Timestamped console logger
 * @param {string} message - Log message to display
 */
function logInfo (message) {
  const timestamp = new Date().toISOString().substring(11, 19)
  console.log(`[${timestamp}] 🎙️  [MOCK-TTS] [${NODE_ENV.toUpperCase()}] ${message}`)
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/v1/audio/speech') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}')
        const text = payload.input || 'Hello Thomas. Mock TTS inference test.'
        const voice = payload.voice || process.env.HERDR_TTS_VOICE || 'Thomas'

        logInfo(`Inference request received: "${text.substring(0, 45)}..." (Voice: ${voice})`)

        let audioBuffer
        const isHeadless = NODE_ENV === 'test' || process.env.CI === 'true' || process.platform !== 'darwin'

        if (!isHeadless) {
          // Development mode on macOS: generate real audio via say
          execFileSync('say', ['-v', voice, '-o', AUDIO_FILE, text])
          audioBuffer = fs.readFileSync(AUDIO_FILE)
          logInfo(`Generated local macOS audio via 'say' (${audioBuffer.length} bytes).`)
        } else {
          // Test or CI/CD mode: generate dummy audio buffer
          audioBuffer = createDummyAudioBuffer()
          fs.writeFileSync(AUDIO_FILE, audioBuffer)
          logInfo(`Headless mode (${NODE_ENV}). Generated dummy AIFF buffer (${audioBuffer.length} bytes).`)
        }

        res.writeHead(200, {
          'Content-Type': 'audio/aiff',
          'Content-Length': audioBuffer.length
        })
        res.end(audioBuffer)

        logInfo(`Inference completed successfully (${audioBuffer.length} bytes transmitted).`)
      } catch (err) {
        logInfo(`Processing error: ${err.message}`)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Endpoint not found' }))
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n==================================================')
  logInfo(`Mock TTS Server listening on http://127.0.0.1:${PORT}`)
  logInfo(`Active endpoint: POST http://127.0.0.1:${PORT}/v1/audio/speech`)
  logInfo(`Execution Environment (NODE_ENV): ${NODE_ENV}`)
  console.log('==================================================\n')
})
