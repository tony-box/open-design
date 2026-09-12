import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const pluginRoot = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(pluginRoot, 'assets', 'studio-template.html'), 'utf8');
const fixture = JSON.parse(fs.readFileSync(path.join(pluginRoot, 'examples', 'lakeside-barn-residence', 'building.json'), 'utf8'));
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

if (!script) throw new Error('studio-template.html does not contain an inline script');

function loadStudio() {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) {
      elements.set(selector, {
        innerHTML: '',
        setAttribute() {},
        querySelectorAll() { return []; }
      });
    }
    return elements.get(selector);
  };
  let api;
  const context = vm.createContext({
    console,
    structuredClone,
    document: {
      querySelector: element,
      querySelectorAll() { return []; }
    },
    __OD_STUDIO_TEST__(value) { api = value; }
  });
  vm.runInContext(script, context);
  if (!api) throw new Error('Studio test API was not exposed');
  return { api, elements };
}

function cloneFixture() {
  return structuredClone(fixture);
}

function errorCodes(api, model) {
  api.state.model = model;
  return api.validateModel(model).filter(finding => finding.severity === 'error').map(finding => finding.code);
}

test('fixture is renderable while invalid and unsupported geometry is blocked', () => {
  const { api } = loadStudio();
  assert.equal(errorCodes(api, cloneFixture()).length, 0);

  const selfIntersecting = cloneFixture();
  selfIntersecting.spaces[0].boundary = [{ x: 0, y: 0 }, { x: 2000, y: 2000 }, { x: 0, y: 2000 }, { x: 2000, y: 0 }];
  assert.ok(errorCodes(api, selfIntersecting).includes('polygon.geometry'));

  const duplicateElevation = cloneFixture();
  duplicateElevation.levels[1].elevationMm = 0;
  duplicateElevation.stairs = [];
  assert.ok(errorCodes(api, duplicateElevation).includes('level.duplicate-elevation'));

  const invalidOpening = cloneFixture();
  invalidOpening.openings[0].widthMm = -100;
  assert.ok(errorCodes(api, invalidOpening).includes('opening.geometry'));

  const unknownRoofLevel = cloneFixture();
  unknownRoofLevel.roofs[0].levelId = 'missing-level';
  assert.ok(errorCodes(api, unknownRoofLevel).includes('reference.level'));

  const unsupportedSlab = cloneFixture();
  unsupportedSlab.slabs[0].boundary = [{ x: 0, y: 0 }, { x: 9600, y: 0 }, { x: 9600, y: 6000 }, { x: 4800, y: 6000 }, { x: 4800, y: 13200 }, { x: 0, y: 13200 }];
  assert.ok(errorCodes(api, unsupportedSlab).includes('renderer.unsupported-slab'));
});

test('system plans are level-specific and reject disconnected paths', () => {
  const { api } = loadStudio();
  const model = cloneFixture();
  api.state.model = model;
  api.state.levelId = 'level-ground';
  const ground = api.planSvg(true);
  api.state.levelId = 'level-upper';
  const upper = api.planSvg(true);
  assert.notEqual(ground, upper);
  assert.match(ground, /plumbing-edge-entry-stack/);
  assert.doesNotMatch(ground, /plumbing-edge-kitchen/);
  assert.match(upper, /plumbing-edge-kitchen/);

  model.systems[0].edges[0].path[0] = { x: 999999, y: 999999, z: 999999 };
  assert.ok(errorCodes(api, model).includes('system.endpoint'));
});

test('elevations use project directions and wall base offsets', () => {
  const { api } = loadStudio();
  const model = cloneFixture();
  api.state.model = model;
  api.state.levelId = 'level-ground';
  api.state.elevation = 'north';
  assert.doesNotMatch(api.elevationSvg(), /opening-overhead-west/);
  api.state.elevation = 'south';
  const baseline = api.elevationSvg();
  assert.match(baseline, /opening-overhead-west/);
  model.walls.find(wall => wall.id === 'wall-g-north').baseOffsetMm = 500;
  assert.notEqual(api.elevationSvg(), baseline);
});

test('3D prisms face outward and stairs affect scene geometry', () => {
  const { api } = loadStudio();
  const prism = [];
  api.pushPrism(prism, 0, 0, 0, 2, 2, 2, 0, [1, 1, 1]);
  for (let index = 0; index < prism.length; index += 18) {
    const a = prism.slice(index, index + 3), b = prism.slice(index + 6, index + 9), c = prism.slice(index + 12, index + 15);
    const u = b.map((value, axis) => value - a[axis]), v = c.map((value, axis) => value - a[axis]);
    const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const center = a.map((value, axis) => (value + b[axis] + c[axis]) / 3);
    assert.ok(normal.reduce((sum, value, axis) => sum + value * center[axis], 0) > 0);
  }

  const scene = { triangles: [], lines: [] };
  api.state.model = cloneFixture();
  api.buildScene(scene);
  const withStair = scene.triangles.length;
  api.state.model.stairs = [];
  api.buildScene(scene);
  assert.ok(withStair > scene.triangles.length);
});

test('plans render authored stairs and dimensions', () => {
  const { api } = loadStudio();
  api.state.model = cloneFixture();
  api.state.levelId = 'level-ground';
  const plan = api.planSvg(false);
  assert.match(plan, /data-entity="stair-main"/);
  assert.match(plan, /data-entity="dimension-width"/);
  assert.match(plan, /data-entity="dimension-depth"/);
});

test('code view renders a valid staged report and distinguishes invalid reports', () => {
  const { api, elements } = loadStudio();
  api.state.model = cloneFixture();
  api.state.codeReport = {
    status: 'loaded',
    data: {
      findings: [{
        topic: 'egress',
        status: 'needs-review',
        summary: 'Verify the bedroom opening.',
        authority: 'Example Township',
        sourceTitle: 'Adopted code notice',
        sourceRef: 'https://example.invalid/code',
        accessedDate: '2026-09-12',
        affectedEntityIds: ['opening-bedroom-window']
      }],
      coverage: { checked: [], potentialConflicts: [], unresolved: ['Bedroom egress'], outOfScope: [] }
    }
  };
  api.renderDocument('code');
  assert.match(elements.get('#content').innerHTML, /Verify the bedroom opening/);
  assert.match(elements.get('#content').innerHTML, /Adopted code notice/);

  api.state.codeReport = { status: 'invalid', message: 'The report belongs to another project.' };
  api.renderDocument('code');
  assert.match(elements.get('#content').innerHTML, /belongs to another project/);
});
