# Concept Architecture Acceptance Checklist

## P0 — Required Before Handoff

- [ ] `models/building.json` parses and all stable IDs/references resolve.
- [ ] No `error` findings remain in studio diagnostics.
- [ ] Every plan, elevation, section, schedule, and 3D object derives from the
      active model; no renderer contains a competing geometry constant table.
- [ ] Opening offsets, widths, sill heights, and head heights agree in plan,
      visible elevations, sections, and 3D.
- [ ] Level, floor-to-floor, stair, eave, and ridge datums agree in every view.
- [ ] Every displayed dimension is computed from coordinates.
- [ ] Each fixture/equipment connection resolves to a system node.
- [ ] Each system edge connects nodes in its own discipline.
- [ ] System paths appear at matching coordinates in 2D and 3D.
- [ ] Plumbing, electrical, and mechanical layers can be isolated.
- [ ] Code findings cite sources or explicitly report research as unavailable.
- [ ] Diagnostics, Code, Assumptions, and Handoff surfaces all state that the
      work is conceptual and requires professional verification.

## P1 — Interaction and Legibility

- [ ] Plan and system layers remain legible at laptop and mobile widths.
- [ ] Rooms, openings, fixtures, equipment, routes, and diagnostics are
      inspectable by stable entity ID.
- [ ] Elevations include level datums and a clear view direction.
- [ ] Orbit and walk modes render a nonblank model without WebGL errors.
- [ ] Variant selection, when present, swaps the complete model in every view.
- [ ] Labels may move for legibility, but leaders retain the true model anchor.

## Professional Handoff

- [ ] `ASSUMPTIONS.md` separates user facts, calibrated attachments,
      heuristics, code sources, and generated choices.
- [ ] `HANDOFF.md` identifies the selected concept, rejected alternatives,
      unresolved decisions, code coverage, and questions by discipline.
- [ ] Survey, zoning/site, structural, envelope/energy, fire/life safety,
      accessibility, plumbing, electrical, and mechanical follow-up is explicit.
- [ ] The package never describes itself as permit ready, engineered,
      construction ready, or code compliant.
