# Herdr Voice Plugin

[![CI](https://github.com/Drozerah/herdr-voice/actions/workflows/ci.yml/badge.svg)](https://github.com/Drozerah/herdr-voice/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](#)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Real-time Text-to-Speech (TTS) Voice Synthesis Plugin for the [Herdr](https://github.com/ogulcancelik/herdr) Terminal Multiplexer.

---

## ⚠️ Work in Progress (WIP)

This project is currently under active early-stage development (`v1.0.0-alpha.1`).

Features, public interfaces, and architecture choices are subject to change before the first official release.

---

## 📌 Project Overview

`herdr-voice` aims to bring real-time audio feedback to AI coding agents operating within Herdr panes.

---

## 🛡️ Security & Guardrails

`herdr-voice` implements a multi-layered security and cost-protection architecture to ensure zero credential leakage and protect developers against financial inflation (*Financial Denial of Wallet*):

1. **🔒 Zero-Leak Credential Redaction ([016_ADR](docs/adr/016_ADR.md)):**
   - Automated sanitization service (`src/security.js`) intercepting and redacting sensitive API keys (`api_key`), Bearer tokens, and OpenAI/ElevenLabs keys (`sk-...`) before any log emission to system console or Herdr Toast UI alerts (`[REDACTED]`).
2. **🤫 Zero-Disk Audio Persistence & In-Memory Streaming:**
   - Audio payloads are processed strictly in RAM and streamed directly to `@audio/speaker`. Zero audio files (MP3, WAV, AIFF) are persisted to disk or temporary cache folders (`tmp/`), ensuring total confidentiality of synthesized agent communications.
3. **⚡ RAM/CPU Resource Capping & Short-Circuit Evaluation ([014_ADR](docs/adr/014_ADR.md)):**
   - Backpressure-managed RAM buffer capped at 16 KB (`high_water_mark` = 16384).
   - Immediate zero-resource return at entry point (`src/index.js`) when disabled (`enabled = false`), guaranteeing 0% RAM allocation and zero background network requests.
4. **🛑 Rate Limiting & Financial Guardrails:**
   - **Payload Truncation (`max_input_length` = 1000):** Automatic input clipping with trailing ellipses (`...`) to prevent token over-consumption on long agent outputs.
   - **Circuit Breaker (`max_requests_per_minute` = 10):** Automatic rate limiter suspending audio inference if an AI agent enters a runaway loop.
5. **🌐 Local Network Security & Unencrypted LAN Warnings:**
   - Automated detection of unencrypted HTTP endpoints on private local network IPs (`192.168.x.x`, `10.x.x.x`, `172.16.x.x`). Emits visual Herdr Toast UI and console security warnings (`[WARN]`) advising users to enforce HTTPS/TLS or verify local Wi-Fi/LAN trust.

---

## ⚠️ Disclaimer & API Usage Responsibility

- **API Costs & Quotas:** `herdr-voice` interacts with local or cloud-based Text-to-Speech (TTS) inference endpoints. Users are solely responsible for managing their API credentials, rate limits, and third-party cloud service costs (e.g., OpenAI API, ElevenLabs, Azure Speech).
- **Built-in Safety Guardrails:** To protect users against runaway AI agents or infinite loops, the plugin enforces configurable safety guardrails in `herdr-plugin.toml`:
  - `max_input_length`: Automatically truncates oversized text payloads (default: 1000 characters).
  - `max_requests_per_minute`: Automatic circuit breaker suspending inference if request limits are exceeded (default: 10 req/min).
- **AS IS Warranty:** This software is provided under the MIT License "AS IS", without warranty of any kind. Authors and contributors accept no liability for third-party inference charges or agent behavior.

