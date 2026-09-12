---
name: concept-architecture-studio
description: Use this plugin to brainstorm close-to-accurate concept architecture with dimensioned plans, elevations, sections, conceptual MEP layouts, advisory local-code research, and an interactive 3D walkthrough.
license: MIT
metadata:
  author: OpenDesign Community
  version: "0.1.0"
---

# Concept Architecture Studio

Use this plugin when the user wants to explore a building concept before
handing it to a licensed architect or engineer. Produce internally consistent,
real-unit geometry and make every drawing and 3D view derive from one canonical
building model.

This workflow creates concept documents, not construction documents. Never
claim that an output is code compliant, permit ready, structurally adequate,
survey accurate, or professionally engineered.

## Workflow

1. Gather the project location, use, approximate size, levels, site constraints,
   room program, preferred units, and source materials. If a sketch or image is
   dimensional evidence, require at least one trusted calibration dimension.
2. Read `references/coordinate-contract.md`,
   `references/building.schema.json`, and `references/model-validation.md`
   before authoring geometry.
3. Write one active model to `models/building.json`. Store complete alternative
   concepts under `models/variants/`; do not maintain separate plan, elevation,
   or 3D geometry sources.
4. Validate model references, polygons, hosted openings, vertical datums,
   stairs, and system connectivity. Resolve every error before handoff. Preserve
   warnings and advisories in the diagnostics and assumptions outputs.
5. Research adopted building codes and local amendments from official sources
   when network access is available. Otherwise inspect user-provided source
   documents. Record citations and uncertainty; never invent a code finding.
6. Stabilize the architectural envelope, then place and route conceptual
   plumbing, electrical, and mechanical systems according to
   `references/mep-concept-rules.md`.
7. Copy `assets/studio-template.html` to `index.html` and generate derived SVG
   plans, elevations, and sections from the same model coordinates.
8. Run the cross-view checklist in `references/checklist.md`, then write
   `ASSUMPTIONS.md` and `HANDOFF.md` for the architect and engineering team.

## Output Contract

```text
index.html
models/building.json
models/variants/*.json            # optional complete alternatives
exports/plans/*.svg
exports/elevations/*.svg
exports/sections/*.svg
reviews/code-findings.json
reviews/code-review.md
ASSUMPTIONS.md
HANDOFF.md
```

The handoff must distinguish measured, user-supplied, inferred, researched,
and generated facts. It must list unresolved code questions and all MEP,
structural, site, and survey decisions that require professional verification.
