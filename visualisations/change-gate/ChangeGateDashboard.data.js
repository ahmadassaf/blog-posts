// Deliberately synthetic records. This is a UI concept over the evidence schema,
// not an export from the pilot or a claim about production throughput.
const basicCriteria = [
  ['Open, ready for review', true],
  ['Human organisation member', true],
  ['Change documentation', true],
  ['Automated checks on head', true],
  ['Required scanner identity + result', true],
  ['Review discussions resolved', true],
  ['Independent review and risk grade', true],
  ['Current-head human approval', true],
  ['Required tests from the configured App', true]
];

const criteria = (failed) => basicCriteria.map(([label, pass], index) => ({ label, pass: failed.includes(index) ? false : pass }));
const reviewers = (securityFinding = false) => [
  { name: 'Correctness', model: 'example-model', state: 'Complete', grade: securityFinding ? 'Medium' : 'Low', findings: securityFinding ? 1 : 0 },
  { name: 'Security', model: 'example-model', state: 'Complete', grade: securityFinding ? 'High' : 'Low', findings: securityFinding ? 1 : 0 }
];

const records = [
  {
    id: 'eval-006', pr: 123, title: 'Handle an expired session consistently', head: '0123456', time: '12:00', mode: 'shadow', action: 'withhold', risk: 'High', changeClass: 'Normal', seconds: 0.6, cost: 0,
    reason: 'The authentication path requires a second engineer. Both reviewers graded the change low; neither can overrule the protected-path policy.',
    next: 'Another engineer must approve commit 0123456.', path: 'src/auth/session.ts', criteria: criteria([7]), reviewers: reviewers(), findings: [],
    trigger: 'Checks completed', check: 'Neutral', issued: 'None — shadow mode', cached: true
  },
  {
    id: 'eval-005', pr: 127, title: 'Clarify the empty search state', head: 'a42c103', time: '11:57', mode: 'shadow', action: 'approve', risk: 'Low', changeClass: 'Standard', seconds: 12.1, cost: 0.021,
    reason: 'A routine change with all criteria satisfied and no blocking findings is eligible for approval. Shadow mode only records that recommendation.',
    next: 'Follow the repository’s human review and release process.', path: 'src/search/empty-state.tsx', criteria: criteria([]), reviewers: reviewers(), findings: [],
    trigger: 'New commit', check: 'Neutral', issued: 'None — shadow mode', cached: false
  },
  {
    id: 'eval-004', pr: 126, title: 'Find records by identifier', head: 'c7f091a', time: '11:53', mode: 'shadow', action: 'request_changes', risk: 'Medium', changeClass: 'Normal', seconds: 21.6, cost: 0.041,
    reason: 'Two reviewers return the same high-severity claim at the same file and line, at confidence 0.86 and 0.78. Both original reports meet the blocking rule. Human approval would not erase the finding.',
    next: 'Investigate the missing tenant constraint before proceeding.', path: 'src/records/find-record.ts', criteria: criteria([6, 7]), reviewers: reviewers(true),
    findings: ['High · matching reports at 0.86 and 0.78 confidence: lookup filters by record ID but omits tenant ID at line 42.'],
    trigger: 'New commit', check: 'Neutral', issued: 'None — shadow mode', cached: false
  },
  {
    id: 'eval-003', pr: 125, title: 'Fix the pagination label', head: 'b39e218', time: '11:51', mode: 'enforce', action: 'approve', risk: 'Low', changeClass: 'Standard', seconds: 10.7, cost: 0.018,
    reason: 'All criteria pass for a Standard change. In this simulated enforce-mode record, the service issues its eligible approval.',
    next: 'Repository rules and the human release approval still apply.', path: 'src/table/pagination.tsx', criteria: criteria([]), reviewers: reviewers(), findings: [],
    trigger: 'New commit', check: 'Success', issued: 'Approval issued', cached: false
  },
  {
    id: 'eval-002', pr: 124, title: 'Update the export column labels', head: '5de310a', time: '11:49', mode: 'enforce', action: 'withhold', risk: 'Low', changeClass: 'Standard', seconds: 0.8, cost: 0,
    reason: 'A passing check has the expected scanner name, but it was posted by the wrong App. The required security check is not satisfied.',
    next: 'Run the configured scanner App on commit 5de310a.', path: 'src/export/columns.ts', criteria: criteria([4]), reviewers: reviewers(), findings: [],
    trigger: 'Check updated', check: 'Failure', issued: 'No approval', cached: true
  },
  {
    id: 'eval-001', pr: 123, title: 'Handle an expired session consistently', head: '0123456', time: '11:48', mode: 'shadow', action: 'withhold', risk: 'High', changeClass: 'Normal', seconds: 17.9, cost: 0.031,
    reason: 'The same pull request was evaluated while its checks were still running. It also needs a current-head approval because it changes authentication.',
    next: 'Wait for the checks and an independent approval on 0123456.', path: 'src/auth/session.ts', criteria: criteria([3, 4, 7]), reviewers: reviewers(), findings: [],
    trigger: 'Pull request opened', check: 'Pending', issued: 'None — shadow mode', cached: false
  }
];

export const evaluations = records.map(record => {
  const suffix = record.id.slice(-3);
  return {
    ...record,
    audit: {
      delivery: `delivery-${suffix}`,
      job: `job-${suffix}`,
      attempt: `attempt-${suffix}-1`,
      receivedAt: `1 Jan 2026, ${record.time} UTC`,
      triggerActor: record.trigger.startsWith('Check') ? 'example-ci[bot]' : 'example-engineer',
      policy: 'base 49ac102 · policy 3ed48a1',
      reviewVersion: 'review-config-07 · evaluator-03',
      inputDigest: `sha256:sample-${record.head}`,
      principal: 'change_gate_runtime',
      outcome: record.check === 'Pending' ? 'Pending check published; evaluation recorded' : 'Check published; outcome recorded',
      humanApproval: record.changeClass === 'Standard' ? 'Not required by this route; release approval remains separate' : 'No qualifying approval on this commit'
    }
  };
});

export const outcomes = [
  { id: 'approve', label: 'Approve', icon: 'CircleCheck' },
  { id: 'withhold', label: 'Withhold', icon: 'Clock' },
  { id: 'request_changes', label: 'Request changes', icon: 'TriangleAlert' }
];

export const money = value => `$${value.toFixed(3)}`;
export const actionLabel = record => record.mode === 'shadow'
  ? ({ approve: 'Would approve', withhold: 'Would withhold', request_changes: 'Would request changes' })[record.action]
  : ({ approve: 'Approved', withhold: 'Withheld', request_changes: 'Changes requested' })[record.action];
