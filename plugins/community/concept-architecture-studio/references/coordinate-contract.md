# Coordinate Contract

The building model is the only geometric source of truth. Plans, elevations,
sections, schedules, measurements, and 3D meshes must derive from it.

## Domain Space

- Use a right-handed local architectural coordinate system.
- `x` increases east/right on an unrotated plan.
- `y` increases north/up on an unrotated plan.
- `z` increases vertically from the project datum.
- Store every coordinate and length as an integer millimeter.
- Store true north as clockwise decimal degrees from positive `y`.
- Keep the project origin and site datum explicit in `project.coordinates`.

Do not encode page rotation, screen pixels, Three.js axes, SVG inversion, or
display-unit formatting in model coordinates.

## Renderer Adapters

Plan SVG maps domain `(x, y)` to sheet `(x, -y)` before fit/zoom transforms.
Elevations project domain points onto the selected view axis and map `z` to
negative sheet `y`. Three.js maps domain `(x, y, z)` to world `(x, z, -y)` in
meters by multiplying millimeters by `0.001`.

Every renderer must expose inverse transforms for pointer inspection and
coordinate readouts. A view may rotate or mirror its presentation, but entity
coordinates remain unchanged.

## Precision

- Geometry computations use integer millimeters where practical.
- Derived floating-point intersections round to the nearest millimeter before
  entering validation or exported coordinates.
- Default comparison tolerance is 3 mm.
- Feet/inches display rounds to the nearest configured fraction, defaulting to
  1/8 inch. Display strings are never used as inputs to geometry.
- Metric display defaults to millimeters below 10 m and meters above 10 m.

## Evidence

Each authored entity records an evidence object:

- `source`: `user`, `attachment`, `code-source`, `heuristic`, or `generated`.
- `confidence`: a value from 0 through 1.
- `status`: `accepted`, `needs-review`, or `rejected`.
- `note`: a short explanation of the origin or uncertainty.

Dimensions calibrated from an image must identify the trusted reference
dimension in the note. Satellite imagery may establish orientation and context,
but never legal boundaries or setbacks without survey evidence.
