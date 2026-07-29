# Herdr Voice Plugin

[![CI](https://github.com/Drozerah/herdr-voice/actions/workflows/ci.yml/badge.svg)](https://github.com/Drozerah/herdr-voice/actions/workflows/ci.yml)
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

## ⚠️ Disclaimer & API Usage Responsibility

- **API Costs & Quotas:** `herdr-voice` interacts with local or cloud-based Text-to-Speech (TTS) inference endpoints. Users are solely responsible for managing their API credentials, rate limits, and third-party cloud service costs (e.g., OpenAI API, ElevenLabs, Azure Speech).
- **Built-in Safety Guardrails:** To protect users against runaway AI agents or infinite loops, the plugin enforces configurable safety guardrails in `herdr-plugin.toml`:
  - `max_input_length`: Automatically truncates oversized text payloads (default: 1000 characters).
  - `max_requests_per_minute`: Automatic circuit breaker suspending inference if request limits are exceeded (default: 10 req/min).
- **AS IS Warranty:** This software is provided under the MIT License "AS IS", without warranty of any kind. Authors and contributors accept no liability for third-party inference charges or agent behavior.

