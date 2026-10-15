// All records are fictional teaching examples, not observations from real teams.
export const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

export const rollingMean = (values, window = 5) => values.map((value, index) => {
  if (index < window - 1) return null;

  return mean(values.slice(index - window + 1, index + 1));
});

export const remainingWork = (scope, completed) => scope.map((value, index) => value - completed[index]);

export const burndownRows = (scenario) => scenario.values.map((remaining, day) => {
  return {
    'completed': scenario.completed[day],
    day,
    remaining,
    'removed': 50 - remaining - scenario.completed[day]
  };
});

export const cumulativeBoundaries = (states) => {
  return {
    'active': states.done.map((count, index) => count + states.active[index]),
    'done': states.done,
    'queued': states.done.map((count, index) => count + states.active[index] + states.queued[index])
  };
};

const note = (id, label, observation, explanations, check) => {
  return { check, explanations, id, label, observation };
};
const SAME_BURNDOWN = [ 50, 44, 36, 29, 22, 15, 8, 2, 0, 0, 0 ];
const COMPLETED_RELEASE = [ 0, 20, 42, 67, 92, 118, 145, 170 ];
const COMPLETION_DAYS = [ 1, 3, 4, 5, 8, 10, 11, 14, 16, 18, 20, 22 ];
const dots = (durations) => durations.map((days, index) => {
  return { 'completedOn': COMPLETION_DAYS[index], days };
});
const bars = (planned, completed) => planned.map((value, index) => {
  return { 'completed': completed[index], 'planned': value, 'sprint': index + 1 };
});

export const charts = {
  'burndown': {
    'description': 'The remaining-work line stays identical. Change the log to see why zero can mean different things.',
    'scenarios': [
      {
        'annotations': [
          note('zero', 'Zero before the end', 'The recorded remaining estimate is zero on days 8–10.', 'All selected work might be done, or the selection might have changed. The line alone cannot distinguish those cases.', 'Open the work log, then inspect the Sprint Goal and the usable result.'),
          note('reference', 'A reference, not a quota', 'The actual line falls faster than the straight reference.', 'The reference assumes an even reduction. Real completion, estimation, and scope changes need not follow it.', 'Compare item history with the original forecast; avoid inferring effort from the distance between lines.')
        ], 'completed': [ 0, 6, 14, 21, 28, 35, 42, 48, 50, 50, 50 ], 'context': 'The fictional item history records all original work meeting the Definition of Done by day 8. The final two days remain available for inspecting the result and deciding what is useful next.',
        'id': 'completed',
        'label': 'Log A',
        'meaning': 'Original work completed',
        'summary': 'Remaining work reaches zero on day 8. This log records 50 points completed and none removed.',
        'values': SAME_BURNDOWN
      },
      {
        'annotations': [
          note('scope', 'A drop can be a scope decision', 'Seven points disappear on day 3 without a recorded completion.', 'The log attributes this drop to removed scope. Without that log, completion and estimate changes would also be possible explanations.', 'Read the decision behind the scope change and check its effect on the Sprint Goal.'),
          note('zero', 'The same zero, less completed', 'The final remaining estimate is zero, but 36 of the original 50 points completed.', 'Removing work can be sensible learning or a poor trade-off. Its amount does not establish which.', 'Inspect the usable result and the reason for the decision; do not rank the team from this line.')
        ], 'completed': [ 0, 6, 14, 14, 21, 21, 28, 34, 36, 36, 36 ], 'context': 'In this fictional log, the team and Product Owner remove 7 estimated points on day 3 and 7 on day 5 after inspecting the work. Whether the revised selection still serves the Sprint Goal must be checked separately.',
        'id': 'rescoped',
        'label': 'Log B',
        'meaning': 'Scope revised during the sprint',
        'summary': 'The same line reaches zero on day 8. This log records 36 points completed and 14 removed.',
        'values': SAME_BURNDOWN
      }
    ],
    'title': 'One burndown, two work logs',
    'unit': 'Remaining estimated points, recorded at the end of each fictional day.'
  },
  'control': {
    'description': 'Each dot is one finished item. The line uses the latest five completions; reveal active ages to see another part of the system.',
    'scenarios': [
      {
        'annotations': [
          note('sample', 'This is a completed sample', 'The visible dots all fall between 5 and 7 days.', 'That describes finished items only. Older unfinished items cannot appear here yet.', 'Reveal unfinished work and inspect its waiting time and blockers.'),
          note('mean', 'The mean is calculated', 'The line averages each item and the four completions before it.', 'It smooths this particular sample; it is neither a deadline nor a statistical control limit.', 'Use the underlying distribution and relevant work context for forecasting.')
        ], 'dots': dots([ 5, 6, 7, 5, 6, 6, 7, 5, 6, 7, 5, 6 ]), 'id': 'narrow',
        'label': 'Narrow completion band',
        'meaning': 'An unfinished item is older',
        'summary': 'All 12 completed items took 5–7 days. Reveal unfinished work to inspect what this history leaves out.',
        'unfinished': [{ 'age': 2, 'id': 'A' }, { 'age': 7, 'id': 'B' }, { 'age': 18, 'id': 'C' }]
      },
      {
        'annotations': [
          note('rise', 'Later durations are longer', 'Recent dots and their five-item mean sit above the earlier sample.', 'Waiting, work mix, dependencies, and changed start or finish boundaries could contribute.', 'Trace recent items through their histories and compare active ages.'),
          note('lag', 'Completed data arrives late', 'An item appears only when it finishes.', 'A current delay may not affect this chart until the delayed work completes.', 'Inspect active work now rather than waiting for a retrospective or a new dot.')
        ], 'dots': dots([ 5, 6, 4, 7, 5, 6, 8, 9, 8, 10, 11, 12 ]), 'id': 'rising',
        'label': 'Longer recent completions',
        'meaning': 'Check what changed',
        'summary': 'Later completions took longer in this sample. Three unfinished items are 3, 9, and 17 days old.',
        'unfinished': [{ 'age': 3, 'id': 'D' }, { 'age': 9, 'id': 'E' }, { 'age': 17, 'id': 'F' }]
      },
      {
        'annotations': [
          note('spread', 'A wide range is information', 'The completed durations vary substantially.', 'Different work types, dependencies, or waiting patterns may be mixed together.', 'Inspect comparable work groups and the whole distribution; variation does not make all forecasting impossible.'),
          note('long', 'Investigate the long item', 'One completed item took 19 days.', 'That may reveal an important delay even though it is only one observation.', 'Read its history with the people involved before deciding whether a broader change is warranted.')
        ], 'dots': dots([ 2, 14, 5, 18, 8, 1, 16, 6, 12, 3, 19, 7 ]), 'id': 'wide',
        'label': 'Wider spread',
        'meaning': 'The average hides variation',
        'summary': 'Completed durations range from 1 to 19 days. An unfinished item is already 20 days old.',
        'unfinished': [{ 'age': 4, 'id': 'G' }, { 'age': 10, 'id': 'H' }, { 'age': 20, 'id': 'I' }]
      }
    ],
    'title': 'Cycle-time scatterplot: finished items only',
    'unit': 'Elapsed calendar days from started to finished, by completion day. Trailing mean: 5 completed items; no line before item 5.'
  },
  'epic': {
    'description': 'These releases complete the same amount of estimated work. Switch the scope history, then compare burnup and burndown.',
    'scenarios': [
      {
        'annotations': [
          note('gap', 'The remaining gap', 'Completed work rises to 170 while scope stays at 180.', 'This history is compatible with stable scope; it says nothing about whether that scope still solves the right problem.', 'Check the result with users and revisit the assumptions behind the next forecast.'),
          note('forecast', 'A forecast needs assumptions', 'The most recent snapshots show continuing completion.', 'The next interval may have a different work mix, capacity, or dependency.', 'Use relevant history and a range of scenarios rather than extending one slope as a promised date.')
        ], 'completed': COMPLETED_RELEASE, 'id': 'fixed',
        'label': 'Fixed scope', 'meaning': '180 points throughout',
        'scope': [ 180, 180, 180, 180, 180, 180, 180, 180 ],
        'summary': '170 points completed against 180 points of scope; 10 remain at snapshot 8.'
      },
      {
        'annotations': [
          note('scope', 'Completion and scope both grow', 'Scope rises by 40 points while completed work follows the same path as the fixed-scope case.', 'Useful discovery, new requirements, and rework can each add scope. Growth is not automatically good or bad.', 'Inspect the added items and their rationale; update the forecast assumptions.'),
          note('gap', 'A larger remaining gap', 'Fifty points remain, despite 170 having completed.', 'The larger gap comes from the recorded scope changes, not lower recorded completion.', 'Compare burnup and burndown, then discuss which scope is needed for the next useful release.')
        ], 'completed': COMPLETED_RELEASE, 'id': 'expanded',
        'label': 'Scope added', 'meaning': '180 grows to 220',
        'scope': [ 180, 180, 200, 200, 220, 220, 220, 220 ],
        'summary': '170 points completed against 220 points of scope; 50 remain at snapshot 8.'
      },
      {
        'annotations': [
          note('trim', 'Scope can shrink', 'The scope line drops from 180 to 160, then ends at 170.', 'The team may have simplified the solution, deferred something, or corrected an estimate.', 'Read the decision log and inspect the result that the revised scope represents.'),
          note('zero', 'Zero still needs a result', 'Completed work meets revised scope at snapshot 8.', 'All recorded work is complete. That is distinct from demonstrating that users received the intended benefit.', 'Check release readiness, quality, and user outcomes.')
        ], 'completed': COMPLETED_RELEASE, 'id': 'revised',
        'label': 'Scope revised', 'meaning': 'Work removed and added',
        'scope': [ 180, 180, 180, 180, 160, 160, 160, 170 ],
        'summary': '170 points completed against revised scope of 170; remaining work is zero at snapshot 8.'
      }
    ],
    'title': 'Separate scope from completion',
    'unit': 'Estimated points at eight fictional review snapshots. Remaining = scope − completed.'
  },
  'flow': {
    'description': 'The bands show queued, active, and cumulative finished items. Compare three fictional workflows with the same state definitions.',
    'scenarios': [
      {
        'annotations': [
          note('band', 'Thickness is a count', 'The active band stays five items thick vertically.', 'A stable count can include changing items, or one old item while newer work passes it.', 'Inspect active ages and waiting, not just the band’s shape.'),
          note('done', 'Slope records completions', 'Cumulative done increases by five each week.', 'The count depends on item boundaries and finish policies; it does not measure effort or customer value.', 'Check consistent definitions and the usefulness of the finished work.')
        ], 'id': 'steady', 'label': 'Stable active count',
        'meaning': 'Five items in progress',
        'states': { 'active': [ 5, 5, 5, 5, 5, 5, 5, 5 ], 'done': [ 0, 5, 10, 15, 20, 25, 30, 35 ], 'queued': [ 10, 10, 10, 10, 10, 10, 10, 10 ] },
        'summary': 'Five items are active at each snapshot. Done grows by five per week; ten items remain queued.'
      },
      {
        'annotations': [
          note('wider', 'More started work is unfinished', 'The active count rises while completion continues more slowly during the middle snapshots.', 'A dependency, changed work mix, interruption, or recording issue could explain the accumulation.', 'Inspect the oldest active items and compare intake with the workflow’s WIP policy.'),
          note('queue', 'The queue is another boundary', 'Twelve items remain queued in the final six snapshots.', 'A queue count does not establish whether demand is valuable, obsolete, or ready to start.', 'Inspect the queued items and their replenishment policy with the team.')
        ], 'id': 'accumulating', 'label': 'More active work',
        'meaning': 'The active band widens',
        'states': { 'active': [ 5, 6, 8, 12, 17, 20, 18, 14 ], 'done': [ 0, 5, 10, 13, 16, 19, 25, 32 ], 'queued': [ 10, 11, 12, 12, 12, 12, 12, 12 ] },
        'summary': 'Active work rises from 5 to 20 items by week 6, then falls to 14. Done continues to accumulate.'
      },
      {
        'annotations': [
          note('queue', 'The queue reaches zero', 'Queued work falls from 24 items to zero.', 'This could be an intended wind-down or a replenishment gap. Empty is not automatically a problem.', 'Check the goal of this workflow and whether further demand is expected.'),
          note('end', 'All accepted work finished', 'The final snapshot records 32 done and no unfinished items.', 'That describes this fixed set, not the quality or value of its outcome.', 'Inspect what was delivered and decide what, if anything, should happen next.')
        ], 'id': 'draining', 'label': 'Queue drains',
        'meaning': 'A fixed set finishes',
        'states': { 'active': [ 8, 8, 8, 7, 5, 3, 2, 0 ], 'done': [ 0, 6, 12, 18, 23, 27, 30, 32 ], 'queued': [ 24, 18, 12, 7, 4, 2, 0, 0 ] },
        'summary': 'A fixed set of 32 items moves to done. No queued or active items remain at week 8.'
      }
    ],
    'title': 'Read the accumulation, then inspect the items',
    'unit': 'Item counts at eight weekly snapshots. Queued = not started; active = started, unfinished; done accumulates. No removals or reopened items in these samples.'
  },
  'velocity': {
    'description': 'Compare planned and completed estimates within each fictional history. These are not comparable team scores.',
    'scenarios': [
      {
        'annotations': [
          note('gap', 'Planned and completed differ', 'Sprint 6 records 35 planned points and 26 completed.', 'Scope changes, availability, dependencies, estimates, and work still in progress can all affect the gap.', 'Inspect that sprint’s work history and goal before choosing a change.'),
          note('range', 'Keep the range visible', 'This sample includes both 22-point and 35-point sprints.', 'A single average hides that variation and may not describe the work ahead.', 'Check whether the recent sample remains relevant to the next forecast.')
        ], 'bars': bars([ 30, 32, 35, 34, 36, 35, 36, 35 ], [ 22, 30, 34, 33, 35, 26, 35, 34 ]), 'id': 'variable',
        'label': 'Variable completion',
        'meaning': 'A wider recent range',
        'summary': 'Completed estimates vary from 22 to 35 points across these eight sprints.'
      },
      {
        'annotations': [
          note('similar', 'Similar recorded completion', 'The completed totals are close together in this sample.', 'Comparable work and capacity may explain it, but the totals alone cannot establish those conditions.', 'Check work mix, estimation, and quality boundaries before reusing this history.'),
          note('outcome', 'Points leave value out', 'The chart records estimated work, not customer outcomes.', 'Stable totals can accompany useful or unhelpful product changes.', 'Pair the delivery forecast with evidence of product usefulness and quality.')
        ], 'bars': bars([ 32, 33, 32, 34, 33, 34, 32, 33 ], [ 31, 33, 32, 33, 32, 34, 31, 33 ]), 'id': 'narrow',
        'label': 'Narrower range',
        'meaning': 'Similar recorded totals',
        'summary': 'Completed estimates range from 31 to 34 points. The narrow range does not guarantee the next result.'
      },
      {
        'annotations': [
          note('rise', 'The recorded number rises', 'Later sprints complete more estimated points.', 'Delivery may have improved, work may have changed, or the estimation scale may have shifted.', 'Inspect estimation examples and comparable outcomes; do not extrapolate the rise automatically.'),
          note('pressure', 'A target can change measurement', 'The chart itself contains no evidence about anyone’s intent.', 'If points have become a target, people may adapt estimation or slicing to the incentive. That is a hypothesis to check.', 'Ask how the number is used and inspect changes in estimation practice.')
        ], 'bars': bars([ 20, 22, 25, 28, 32, 36, 40, 40 ], [ 18, 21, 24, 27, 31, 35, 39, 40 ]), 'id': 'rising',
        'label': 'Rising points',
        'meaning': 'Several explanations fit',
        'summary': 'Completed estimated points rise from 18 to 40. The chart does not establish a productivity increase.'
      }
    ],
    'title': 'Read points with their context',
    'unit': 'Estimated points per sprint. Planned means the initial selection, not a fixed-scope commitment.'
  }
};
