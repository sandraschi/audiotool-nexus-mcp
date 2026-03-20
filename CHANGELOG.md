# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
