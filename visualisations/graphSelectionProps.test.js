import assert from 'node:assert/strict';
import test from 'node:test';

import { graphSelectionProps } from './graphSelectionProps.js';

test('graph selections expose their label, current state and keyboard focus target', () => {
  for (const selected of [ true, false ]) {
    const props = graphSelectionProps({ 'label': 'Inspect subject', 'onSelect': () => undefined, selected });

    assert.equal(props['aria-label'], 'Inspect subject');
    assert.equal(props['aria-pressed'], selected);
    assert.equal(props['data-active'], selected);
    assert.equal(props.role, 'button');
    assert.equal(props.tabIndex, 0);
  }
});

test('pointer, focus, Enter and Space select; other keys keep their browser behavior', () => {
  let selections = 0;
  const props = graphSelectionProps({ 'label': 'Inspect object', 'onSelect': () => selections++, 'selected': false });

  props.onClick();
  props.onFocus();
  assert.equal(selections, 2);

  for (const key of [ 'Enter', ' ' ]) {
    let prevented = false;
    const before = selections;

    props.onKeyDown({ key, 'preventDefault': () => {
      prevented = true;
    } });
    assert.equal(selections, before + 1);
    assert.equal(prevented, true);
  }

  for (const key of [ 'Tab', 'ArrowRight', 'Escape', 'a' ]) {
    const before = selections;

    props.onKeyDown({ key, 'preventDefault': () => assert.fail(`${key} should not be intercepted`) });
    assert.equal(selections, before);
  }
});
