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
- Meta-ADR `000_ADR.md` establishing ADR lifecycle governance policy, OKF v0.2 metadata spec, and AI agent proactive status guidance.
- Rule D6 in `000_ADR.md` establishing universal relative repository paths for OKF v0.2 metadata resources.
- Comprehensive Architecture Decision Records collection in Google Cloud OKF v0.2 specification (`docs/adr/000_ADR.md` -> `docs/adr/014_ADR.md`).
- IETF JSON Schema Draft 2020-12 specification (`schemas/herdr-plugin.schema.json`) for `herdr-plugin.toml` validation and IDE auto-completion.
- Industrial configuration loader (`src/config.js`) powered by `smol-toml` and Ajv schema validation (`ajv/dist/2020`).
- Co-located native unit test suite (`src/config.test.js`) validating configuration schemas, fallback mechanisms, and environment overrides.
- Dual-target centralized logger service (`src/logger.js`) for ISO console traces and Herdr Toast UI visual alerts.
- Short-Circuit Evaluation in plugin entry point (`src/index.js`) for zero resource consumption when disabled (`enabled = false`).
- V8-native code coverage engine integration (`c8`) reaching 97.2% test coverage (`npm run coverage`).
- Interactive Istanbul HTML code coverage report generation in `./coverage/index.html`.
- Dedicated static test fixtures directory (`test/fixtures/`) for readable and isolated TOML test cases.
- Architecture Decision Record `docs/adr/015_ADR.md` establishing code coverage measurement, static fixtures, and Release Workflow.
- Certified 97.2% code coverage badge in `README.md`.

### Fixed
- Explicit IPv4 host binding (`127.0.0.1`) and extended CI startup timeout for Linux runners in mock TTS server.
- Explicit test file paths in `package.json` for cross-version Node.js (18/20/22) test runner compatibility.
- Broken repository link for parent Herdr project in `README.md` and `011_ADR.md`.
- Converted all hardcoded local `file:///` resource paths in ADRs (`000_ADR.md` -> `013_ADR.md`) to relative repository paths for universal documentation portability.
