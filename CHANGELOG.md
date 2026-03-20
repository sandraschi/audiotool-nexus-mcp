# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Vitest integration tests** (`npm run test`): when `AUDIOTOOL_PAT` and `AUDIOTOOL_TEST_PROJECT_URL` are set in `.env`, asserts **online** Nexus session (not offline fallback). Skips when env is absent.
- **docs/AUDIOTOOL_AND_NEXUS.md:** What beta.audiotool.com + NEXUS are; PAT note; marketplace caveat.

### Changed
- **`.env` loading:** MCP entrypoint and Vitest setup load `.env` from the **repository root by path** (not only `process.cwd()`), so PAT is read when the process is started from another working directory.

### Documentation
- **README:** Removed sci-fi marketing (“Hyper-Vibecoding”, “Cyber-Orchestration”, etc.). Clarified that mixer/mastering/sampler views are **dashboard UI** with **placeholder/random** metering visuals—not measurement-grade tools. SDK remains open beta; MCP/webapp split unchanged.
- **README / docs / `.env.example`:** Step-by-step **PAT required for MCP**, how to create a token, and how to create a project and copy its URL.
- **README + `docs/AUDIOTOOL_AND_NEXUS.md`:** **Connection (NEXUS)** — stack + offline vs online; dropped redundant “not arbitrary DAW” disclaimers.

## [0.1.0] - 2026-03-16

### Added
- **Specialized DAW Views**: Implemented `MixerView`, `SamplerView`, and `MasteringView` for professional agentic monitoring.
- **Mixer Board**: High-res peak meters (color-graded) and vertical channel strips for all project devices.
- **Sampler**: Real-time waveform visualization and ADSR parameter controls.
- **Mastering**: FFT spectral analysis and RMS/Peak precision gauges.
- **Connection Handshake**: Implemented secure session establishment flow in the webapp.
- **FLEET_INDEX Registration readiness**: Prepared documentation for MCP Central Docs integration.

### Fixed
- **Session Navigation Lock**: Fixed a bug where sidebar navigation was locked to the Connect page.
- **Store Integrity**: Resolved `SyncedDocument` type errors regarding generic parameters in the SDK.
- **Ticks Import**: Fixed `SyntaxError` by correcting the import path for musical tick constants to `@audiotool/nexus/utils`.

### Changed
- **Styling**: Upgraded dashboard aesthetics to SOTA standards (zinc-950/amber-500) with glassmorphism and motion transitions.
