/**
 * @file mock-tts-server.test.js
 * @description Unit & integration tests for the Mock TTS HTTP Server (bin/mock-tts-server.js)
 * @author Thomas Gauthier
 * @version 1.0.0
 * @date 2026-07-26
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';

describe('Mock TTS HTTP Server Unit Tests', () => {
  let serverProcess;
  const TEST_PORT = 8899;

  before(async () => {
    // Spawn server process with NODE_ENV=test
    serverProcess = spawn('node', ['bin/mock-tts-server.js'], {
      env: { ...process.env, PORT: TEST_PORT.toString(), NODE_ENV: 'test' }
    });

    // Wait 250ms for server socket listening
    await new Promise(resolve => setTimeout(resolve, 250));
  });

  after(() => {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  });

  test('POST /v1/audio/speech returns 200 OK with valid AIFF audio stream', async () => {
    const payload = JSON.stringify({
      model: 'mlx-kokoro',
      input: 'Unit test speech inference payload',
      voice: 'Thomas'
    });

    const responseBuffer = await new Promise((resolve, reject) => {
      const req = http.request(`http://127.0.0.1:${TEST_PORT}/v1/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, res => {
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['content-type'], 'audio/aiff');

        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    assert.ok(responseBuffer.length > 0, 'Audio response buffer must not be empty');
    assert.equal(responseBuffer.subarray(0, 4).toString(), 'FORM', 'AIFF header must start with FORM');
  });

  test('GET /v1/audio/speech returns 404 Not Found for non-POST requests', async () => {
    const statusCode = await new Promise((resolve, reject) => {
      const req = http.get(`http://127.0.0.1:${TEST_PORT}/v1/audio/speech`, res => {
        resolve(res.statusCode);
      });
      req.on('error', reject);
    });

    assert.equal(statusCode, 404);
  });
});
