# Archive notice: `omi` moved too

Date: 2026-11-17

## Problem / Motivation

The archive notice posted on 2026-11-16 said that the original `omi` repository stays in this organisation, that "everything here is kept as it was", and that the design "continues as `ddr4-udimm`" in a copy. That is not how things stand:

- `Pactolus-Microelectronics/ddr4-udimm` is now the original repository. It has the same repository ID (1120475430), the creation date 2025-12-21, the stars, forks, issues and the v1.1.0 release.
- `The-Open-Memory-Initiative-OMI/omi` is a fork of it, created 2026-11-16 at 20:31 UTC, with issues disabled and no releases.

A visitor following the notice would expect the issues and the release at the old address and find neither.

## What Changed

| File | Change |
|---|---|
| `profile/README.md` | "Everything here is kept as it was" now says that both projects moved with their history, issues and releases, and that forks stay here. The `omi` row links to `ddr4-udimm`, its release and its ERC report at the `v1.1.0` tag, and says the `omi` here is a fork, matching the `spdr` row. The correction sentence now links to the v1.1.0 erratum. |
| `docs/implementations/2026-11-16-archive-notice.md` | Appended a dated correction to the design decision that no longer holds. |
| `docs/implementations/2026-11-17-archive-notice-omi-fork.md` | New. This record. |

## Implementation Approach

The `omi` row is written the same way as the `spdr` row: the link points at the maintained repository, and the last sentence says the repository here is a fork. The ERC link points at `exports/erc.json` at the `v1.1.0` tag in `ddr4-udimm`, so it shows the file as it stood when this organisation became an archive. That file does not change when later work lands on `main`.

## Design Decisions

- **Link to the original, not to the fork.** The fork has no issues and no release, so it is the weaker record. It stays reachable at the old address for old links.
- **Correct the old record by appending.** As with the other corrections in this project, the 2026-11-16 record keeps its original text and gains a dated note.

## Verification

1. `gh api repos/Pactolus-Microelectronics/ddr4-udimm --jq '.id, .created_at'` prints `1120475430` and `2025-12-21T09:50:41Z`.
2. `gh api repos/The-Open-Memory-Initiative-OMI/omi --jq '.fork, .parent.full_name'` prints `true` and `Pactolus-Microelectronics/ddr4-udimm`.
3. Every link in `profile/README.md` resolves. That includes `ddr4-udimm/releases/tag/v1.1.0` and `ddr4-udimm/blob/v1.1.0/exports/erc.json`.
4. The page no longer says that everything here is kept as it was.

## Related Docs

- [2026-11-16 archive notice record](2026-11-16-archive-notice.md)
- The new home: https://github.com/Pactolus-Microelectronics
