import assert from 'node:assert/strict';
import test from 'node:test';

import { gaudiBarRegions } from './GaudiBarLayout.data.js';

test('GaudiBarLayout preserves three clear regions while leaving the lower middle empty', () => {
  const topRegions = gaudiBarRegions.filter((region) => region.bar === 'top');
  const bottomRegions = gaudiBarRegions.filter((region) => region.bar === 'bottom');

  assert.deepEqual(topRegions.map((region) => region.label), [ 'Left region', 'Middle region', 'Right region' ]);
  assert.deepEqual(bottomRegions.map((region) => region.label), [ 'Left region', 'Middle region', 'Right region' ]);
  assert.equal(bottomRegions[1].widgets.length, 0);
  assert.equal(bottomRegions[2].widgets.length, 5);
});

test('GaudiBarLayout region and widget labels remain unique within their scope', () => {
  assert.equal(new Set(gaudiBarRegions.map((region) => region.id)).size, gaudiBarRegions.length);

  for (const region of gaudiBarRegions)
    assert.equal(new Set(region.widgets.map((widget) => widget.label)).size, region.widgets.length);
});
