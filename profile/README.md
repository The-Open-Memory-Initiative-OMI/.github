<!-- OMI - Open Memory Initiative -->

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/The-Open-Memory-Initiative-OMI/.github/main/assets/omi-banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/The-Open-Memory-Initiative-OMI/.github/main/assets/omi-banner-light.svg">
  <img alt="Open Memory Initiative" src="https://raw.githubusercontent.com/The-Open-Memory-Initiative-OMI/.github/main/assets/omi-banner-dark.svg" width="100%">
</picture>

<br><br>

**Open-source, build-in-the-open reference designs and tooling for computer memory.**

<br>

Making memory hardware explainable, reviewable, and reproducible - from public sources, with the reasoning written down.

<br>

[![Start Here](https://img.shields.io/badge/Start_Here-24292f?style=for-the-badge&logo=github&logoColor=white&labelColor=8250df)](https://github.com/The-Open-Memory-Initiative-OMI/omi/blob/main/START_HERE.md)
&nbsp;
[![Discussions](https://img.shields.io/badge/Discussions-24292f?style=for-the-badge&logo=github&logoColor=white&labelColor=57606a)](https://github.com/orgs/The-Open-Memory-Initiative-OMI/discussions)

</div>

<br>

> **No black boxes.** If it can't be inspected, it can't be trusted.

> Independent learning/reference initiative - **not affiliated with, or the same as, the industry "Open Memory Interface (OMI)"** serial-memory standard (the OpenCAPI/IBM interface).

---

## What this is

A place to take memory hardware apart and rebuild it **in the open** - the kind of end-to-end reference work usually locked behind paywalled JEDEC raw cards and vendor NDAs. Every design decision is documented, every artifact is reproducible, and **claims match reality**: work is described at exactly the stage it has reached (schematic, validated, …), never more.

It's a **single-maintainer** effort [Mert Efe Şensoy](https://github.com/mertefesensoy) not a consortium. Governance is intentionally lightweight; contributions are welcome (see below).

**OMI is**
- An open, auditable way to document and design memory systems, with explicit assumptions and repeatable validation.
- A project where decisions are written down and reviewable.

**OMI is not**
- A place for NDA / proprietary vendor material, leaked docs, or anything that crosses IP boundaries.
- A "trust me" spec dump - evidence, references, and stated assumptions come first.

---

## Projects

### [`omi`](https://github.com/The-Open-Memory-Initiative-OMI/omi) - DDR4 UDIMM reference design (v1)
A **schematic-stage** reference design for an 8 GB 1Rx8 non-ECC **DDR4 UDIMM**, derived entirely from public sources with full decision rationale.
**Status: schematic complete** - real 288-pin edge connector, **ERC-clean (0 violations)**, footprint-complete, with a generated netlist + BOM + schematic PDF. PCB layout, fabrication, signal-integrity simulation, and a bench-tested board are **future work - not yet done**, and are marked as such throughout. → start at [`START_HERE.md`](https://github.com/The-Open-Memory-Initiative-OMI/omi/blob/main/START_HERE.md).

### DDR5 SPD decoder + linter - *next*
A read-only, open-source **DDR5 SPD** tool: a clean JESD400-5 content decoder, plus a semantic linter that validates SPD timing ranges, internal consistency, and JEDEC compliance (beyond CRC). *Planned / in progress — a link will appear here once the repo is public.*

---

## Contributing

Open an issue or PR on the relevant repo. Most useful right now:

- **Corrections & design review** - errors or ambiguities in the schematic, the 288-pin pin-map, the validation framework, or the docs. Accuracy is what this project values most.
- **Hardware bring-up** - anyone with PCB-layout, fabrication, or lab capability who wants to take `omi` v1 to a physical prototype (layout → fab → assembly → bench). See [omi#2](https://github.com/The-Open-Memory-Initiative-OMI/omi/issues/2). An honest "I can do X but not Y" beats a blanket offer.

**Standards:** reproducibility over cleverness · explicit assumptions over hidden context · evidence and traceability over "it seems right." If something's ambiguous, open an issue or Discussion first.

---

## License

Hardware **CERN-OHL-S-2.0** · code/tooling **Apache-2.0** · docs **CC-BY-SA-4.0** (per repo). First principle: **honesty over polish** - if it isn't built or measured, the docs don't say it is.
