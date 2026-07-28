# Changelog - Herdr Voice Plugin

All notable changes to the `herdr-voice` project will be documented in this file.

The format is based on [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning v2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Core engineering & governance foundation for Pure JavaScript Herdr Voice Plugin.
- Local Mock TTS HTTP Server (`bin/mock-tts-server.js`) supporting `POST /v1/audio/speech` inference requests.
- Native unit test suite (`bin/mock-tts-server.test.js`) executing in 80 ms via `node:test`.
- Deterministic event-driven server readiness detection (`stdout` Ready Event) and cross-platform `os.tmpdir()` portability.
- Automated version synchronization unit test suite (`bin/version-sync.test.js`).
- Minimal entry point (`src/index.js`) with JSDoc headers and co-located unit test (`src/index.test.js`).
- StandardJS linter & formatter integration (`standard`) with automated `npm run lint` precommit enforcement.
- Normalized project badges (GitHub Actions CI, StandardJS, MIT License) in `README.md`.
- GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`) validating Node.js Active LTS `20.x` & `22.x`.
- Official MIT License file (`LICENSE`) and Architecture Decision Record (`docs/adr/011_ADR.md`).
- Comprehensive Architecture Decision Records collection in Google Cloud OKF v0.2 specification (`docs/adr/001_ADR.md` -> `docs/adr/013_ADR.md`).

### Fixed
- Explicit IPv4 host binding (`127.0.0.1`) and extended CI startup timeout for Linux runners in mock TTS server.
