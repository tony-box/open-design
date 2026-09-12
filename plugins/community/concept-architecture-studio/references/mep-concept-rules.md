# Concept MEP Rules

MEP content coordinates space and exposes tradeoffs. It does not calculate
loads, select final equipment, size systems, design penetrations, or replace
licensed engineering.

## Sequence

1. Stabilize levels, walls, openings, stairs, shafts, wet spaces, equipment
   zones, and likely service entries.
2. Place fixtures and equipment with stable IDs and service-clearance zones.
3. Establish vertical risers and primary distribution paths.
4. Connect every fixture/equipment port to a system node.
5. Route branches, then check connectivity, elevation changes, access, and
   collisions.
6. Revise the architecture or route rather than hiding a conflict.

## Plumbing

- Cluster wet rooms where it improves stack alignment and serviceability.
- Prefer short, inspectable supply, waste, and vent paths.
- Identify water entry, waste exit, stacks, vents, cleanouts, shutoffs,
  equipment, and fixture connection nodes.
- Waste paths must not rise toward discharge. Record slope and nominal size as
  `unverified` until supported by a cited rule and professional design.
- Show vertical stack alignment across levels and flag offsets above 25 mm.
- Keep drainage, venting, backflow, freeze protection, well/septic design, and
  oil/grease handling as explicit review topics when applicable.

## Electrical

- Identify utility/service assumptions, meter, service disconnect, panels,
  major equipment, devices, and conceptual circuit groups.
- Keep panels and disconnects visible and serviceable; record working-clearance
  checks as unresolved until tied to an applicable source.
- Group devices by space and use, but do not infer conductor size, breaker size,
  fault current, grounding, bonding, load calculation, or utility requirements.
- Flag wet, exterior, garage/workshop, sleeping, and egress-related locations
  for specialized protection and alarm review.
- Routes are coordination centerlines, not conduit or cable installation paths.

## Mechanical

- Define zones before placing equipment and terminals.
- Identify outdoor/indoor equipment, supply, return, intake, exhaust,
  combustion, refrigerant/line-set, and condensate nodes as applicable.
- Reserve continuous paths rather than drawing disconnected terminal symbols.
- Keep equipment access, filter replacement, drain service, snow exposure,
  noise, and outdoor-air assumptions visible.
- Do not infer heating/cooling loads, airflow, duct size, pressure, equipment
  capacity, energy compliance, or controls sequences.

## Coordination Checks

Flag route or service-zone intersections with:

- doors, windows, stairs, landings, and required circulation;
- primary structural references and unresolved penetration zones;
- another discipline’s route where elevation separation is unknown;
- ceiling, roof, or floor zones without sufficient modeled depth;
- inaccessible cavities and equipment service areas;
- fire, smoke, acoustic, thermal, or waterproofing assemblies.

Every warning names affected entity IDs so an architect or engineer can locate
the issue in plan and 3D.
