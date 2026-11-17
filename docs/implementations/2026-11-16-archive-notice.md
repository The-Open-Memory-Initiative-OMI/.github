# Archive notice on the organisation profile

Date: 2026-11-16

## Problem / Motivation

The work that began here as the Open Memory Initiative continues in a new organisation, Pactolus Microelectronics. This organisation stays as the archive, so that existing links to it keep working.

The profile page did not say so, and it made two claims that were no longer true:

1. It described the DDR4 schematic as "schematic complete". The schematic passes its electrical rule check, but decoupling, termination and the SPD device are open items, and there is no layout or board.
2. It listed `spdr` as "next" and "in progress". `spdr` has been released since June 2026.

A visitor arriving from an old link saw those claims and no pointer to where the work continues.

## What Changed

| File | Change |
|---|---|
| `profile/README.md` | Rewritten as an archive notice: states that this organisation is an archive, points to the new home, corrects the two status claims, and removes the buttons and the call for contributors that now belong to the new home. |
| `docs/implementations/2026-11-16-archive-notice.md` | New. This record. |

## Implementation Approach

The page keeps the existing banner and the disclaimer about the unrelated "Open Memory Interface" standard. It replaces the rest with a short notice and one table of what was built here and where each project stood.

The correction to the record is stated on the page itself, in its own sentence, so that the earlier wording is acknowledged and not silently replaced.

## Design Decisions

- **A notice, not a redirect.** The organisation is kept, not renamed, so that links to it keep showing the work. The page therefore has to stand on its own as a truthful record.
- **`omi` stays here; `spdr` moved.** The DDR4 design was copied to the new organisation as `ddr4-udimm`, with its full history, and the original remains here. `spdr` was transferred, so its link in the table points at its new address. A fork of it was then created in this organisation at the old address, so that address shows the fork and no longer redirects.
- **No repository is marked read-only by this change.** That is a separate decision.

## Verification

1. Open https://github.com/The-Open-Memory-Initiative-OMI and confirm the page shows the archive notice and the banner.
2. Follow the link to https://github.com/Pactolus-Microelectronics and confirm it resolves.
3. Follow the links in the table: `omi`, its `exports/erc.json` (0 violations), `ddr4-udimm`, `spdr` and its crates.io page.
4. Confirm the page no longer says "schematic complete" as a status and no longer lists `spdr` as upcoming.

## Related Docs

- The new home: https://github.com/Pactolus-Microelectronics
- `omi`: https://github.com/The-Open-Memory-Initiative-OMI/omi

## Correction (2026-11-17)

The design decision "`omi` stays here; `spdr` moved" did not stay true. On 2026-11-16 the original `omi` repository moved to the new organisation as `Pactolus-Microelectronics/ddr4-udimm`, keeping its repository ID, history, stars, issues and the v1.1.0 release. A fork of it was then created here at the old address, as had already happened with `spdr`. The page was corrected to match on 2026-11-17; see [2026-11-17-archive-notice-omi-fork.md](2026-11-17-archive-notice-omi-fork.md).
