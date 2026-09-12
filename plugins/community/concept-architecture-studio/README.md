# Concept Architecture Studio

Concept Architecture Studio is a portable OpenDesign plugin for exploring
dimensionally consistent building ideas before professional design begins. One
structured coordinate model drives plans, project-axis elevations, conceptual
plumbing/electrical/mechanical systems, and an interactive 3D view.

## Scope

The plugin is intended for programming, option studies, spatial coordination,
and professional handoff. It is not a substitute for a survey, licensed
architect, structural engineer, MEP engineer, energy professional, or authority
having jurisdiction.

“Close to accurate” means that model coordinates are real units and that every
derived view agrees within the declared tolerance. It does not imply structural
adequacy, engineered system sizing, permit readiness, or construction accuracy.

## Install and Apply

From the OpenDesign repository:

```bash
corepack pnpm exec od plugin validate ./plugins/community/concept-architecture-studio --no-daemon
corepack pnpm exec od plugin install ./plugins/community/concept-architecture-studio
corepack pnpm exec od plugin apply concept-architecture-studio \
  --input project_name="Workshop residence" \
  --input jurisdiction="Town, County, State, US" \
  --input building_program="Workshop below, two-bedroom residence above" \
  --input levels=2 \
  --input display_units=feet-inches
```

The plugin requests file read/write and network capabilities. File access lets
the agent stage the studio, model schema, and generated outputs. Network access
is used only to research current official jurisdiction sources. A trusted local
installation receives the requested capabilities; other install sources remain
restricted until the user reviews and grants them.

## Canonical Outputs

```text
index.html
models/building.json
models/variants/*.json
exports/plans/*.svg
exports/elevations/*.svg
reviews/code-findings.json
reviews/code-review.md
ASSUMPTIONS.md
HANDOFF.md
```

Open `index.html` through OpenDesign to inspect the model. WebGL content uses
the existing powered-preview path. The studio also accepts a development model
override:

```text
assets/studio-template.html?model=../examples/lakeside-barn-residence/building.json
```

## Included Fixture

`examples/lakeside-barn-residence/building.json` is synthetic. It exercises a
two-level workshop/residence, hosted openings, stairs, roof geometry, all three
MEP disciplines, evidence metadata, and handoff assumptions. It contains no
private address, satellite imagery, photographs, or construction documents.

## Development Validation

```bash
node --experimental-strip-types --test plugins/community/concept-architecture-studio/tests/studio-template.test.ts
corepack pnpm exec od plugin validate ./plugins/community/concept-architecture-studio --no-daemon
corepack pnpm guard
corepack pnpm --filter @open-design/plugin-runtime typecheck
```

Visual acceptance must confirm that plan, elevation, systems, and 3D views all
use the same openings, levels, stair, roof, and system coordinates.

Version 0.1 accepts section definitions for professional handoff but does not
render or export section drawings. Slabs must be axis-aligned rectangles, and
the active model may contain one axis-aligned rectangular gable roof. The
studio blocks unsupported or invalid geometry instead of approximating it.
