# Changelog - Herdr Voice Plugin

All notable changes to the `herdr-voice` project will be documented in this file.

The format is based on [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning v2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-alpha.1] - 2026-07-27

### Added
- Core engineering & governance foundation for Pure JavaScript Herdr Voice Plugin.
- Local Mock TTS HTTP Server (`bin/mock-tts-server.js`) supporting `POST /v1/audio/speech` inference requests.
- Native unit test suite (`bin/mock-tts-server.test.js`) executing in 80 ms via `node:test`.
- Deterministic event-driven server readiness detection (`stdout` Ready Event) and cross-platform `os.tmpdir()` portability.
- Automated version synchronization unit test suite (`bin/version-sync.test.js`).
- GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`) validating Node.js Active LTS `20.x` & `22.x`.
- Comprehensive Architecture Decision Records collection in Google Cloud OKF v0.2 specification (`docs/adr/001_ADR.md` -> `docs/adr/010_ADR.md`).
