# Advisory Code Research

Code research informs concept decisions. It never certifies compliance and must
not substitute for the authority having jurisdiction or licensed professionals.

## Required Context

Before research, establish as much of the following as the user can provide:

- country, state/region, county, municipality, and site address when relevant;
- adopted-code edition and amendment date, if known;
- new work, addition, alteration, conversion, or change of occupancy;
- proposed uses, occupants, sleeping areas, mixed uses, and construction type;
- site, flood, wildfire, coastal, historic, accessibility, energy, well/septic,
  utility, and zoning constraints;
- source documents supplied by the user.

Unknown context remains an assumption. Do not silently choose the most
convenient occupancy, edition, or jurisdiction.

## Source Priority

1. Official municipality or county adoption pages and amendments.
2. Official state code, adoption, and amendment pages.
3. Official fire, accessibility, health, environmental, utility, zoning, or
   other agency guidance applicable to the project.
4. Official model-code publisher references that can lawfully be accessed.
5. Secondary explanations, clearly labeled and never used alone for a claimed
   machine-testable requirement.

Prefer current official HTML or accessible documents. Do not reproduce
substantial copyrighted code text. Summarize only what is needed for the design
decision and link to the source.

## Finding Record

Each finding records:

- stable ID and topic;
- issuing authority and source title;
- edition/adoption date and access date;
- URL or user-provided document reference;
- concise rule summary, applicability conditions, and exclusions;
- affected model entity IDs;
- confidence and `verified`, `needs-review`, or `unavailable` status;
- an optional numeric check only when the source states an explicit parameter.

Use `references/code-findings.schema.json` for the output shape.

## Applying Findings

Only explicit, cited, and machine-testable parameters may become geometry
checks, such as a minimum width, maximum rise, minimum headroom, opening area,
fixture clearance, equipment working space, or setback. Interpretive and
conditional provisions remain review notes.

The coverage report uses four buckets:

- **Checked:** an explicit cited parameter was evaluated against model data.
- **Potential conflict:** the model may not satisfy a cited requirement.
- **Unresolved:** applicability or interpretation requires professional/AHJ
  review.
- **Out of scope:** structural, engineered MEP, survey, energy modeling, fire
  protection, or another discipline not represented by the concept checks.

Never use “code compliant.” Prefer “no conflict found for the checked parameter”
and state exactly what was not checked.

## Unavailable Research

If network research is unavailable, inspect user-attached official documents.
If neither is available:

1. Set `codeReviewStatus` to `unavailable`.
2. Do not create numeric code checks from memory.
3. List jurisdiction, occupancy, adoption, and amendment questions for the
   architect or code official.
4. Keep every code-sensitive model finding advisory.
