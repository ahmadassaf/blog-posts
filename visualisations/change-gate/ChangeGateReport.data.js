import fixture from './report-fixture.json';

// Synthetic alternatives illustrate the policy described in the article. Only
// the waiting case reproduces the original report fixture unchanged.
const sharedCriteria = [
  { title: 'Open and ready for review', evidence: 'The pull request is open and is not a draft.', status: 'passed' },
  { title: 'Human organisation member', evidence: 'sample-engineer is a human member of example-org.', status: 'passed' },
  { title: 'Change documentation', evidence: 'The reason, declared change class and testing evidence are supplied.', status: 'passed' },
  { title: 'Automated checks', evidence: '2 passed on this commit: Security scan and Tests.', status: 'passed' },
  { title: 'Required security scan', evidence: 'Security scan passed and was produced by the required App, sample-scanner.', status: 'passed' },
  { title: 'Required tests', evidence: 'The Tests check succeeded on this commit and was produced by the configured App, github-actions.', status: 'passed' },
  { title: 'Review conversations', evidence: 'No unresolved conversations.', status: 'passed' }
];

const authReview = { title: 'Independent review and risk grade', evidence: '2 of 2 reviewers completed. No findings. Protected authentication path sets the risk to high.', status: 'passed' };
const authCriteria = sharedCriteria.map(criterion => criterion.title === 'Change documentation'
  ? { ...criterion, evidence: 'Closes #120. Declared Standard; testing is evidenced by the check runs.' }
  : criterion);
const authChange = {
  number: fixture.snapshot.number,
  title: fixture.snapshot.title,
  headRef: fixture.snapshot.headRef,
  headSha: fixture.snapshot.headSha,
  additions: fixture.snapshot.additions,
  deletions: fixture.snapshot.deletions,
  files: fixture.snapshot.files,
  changeClass: 'Normal',
  risk: 'High',
  action: 'withhold',
  findings: [],
  reviewers: fixture.reviewers,
  policyText: 'src/auth/session.ts matches a protected authentication path. This is a Normal change, even though the author declared Standard.',
  reviewerIntro: 'Both suggested low risk. The protected-path rule still takes precedence.'
};

const tenantFinding = {
  title: 'Lookup is missing the tenant constraint',
  detail: 'The changed query filters by record ID but not tenant ID. Include the tenant constraint and test cross-tenant access before proceeding.',
  file: 'src/records/find-record.ts',
  line: 42,
  severity: 'high',
  confidence: 0.86,
  reviewers: ['security', 'correctness']
};

const tenantFindingCorrectness = {
  ...tenantFinding,
  confidence: 0.78,
  reviewers: ['correctness']
};

export const reportCases = [
  {
    ...authChange,
    id: 'waiting',
    label: 'Awaiting approval',
    icon: 'UserRound',
    evaluatedAt: fixture.evaluatedAt,
    mode: 'shadow',
    reviewIssued: 'None — shadow mode',
    conclusion: 'neutral',
    tone: 'warning',
    headline: 'Needs a second engineer',
    description: 'Another engineer must approve the current head commit.',
    decision: 'Would withhold approval.',
    decisionDetail: 'Shadow mode publishes a report; it issues no review action.',
    openRequirement: 'Current-head human approval',
    criteria: [
      ...authCriteria,
      authReview,
      { title: 'Current-head human approval', evidence: 'Another engineer must approve commit 0123456. No approving review is present.', status: 'missing' }
    ]
  },
  {
    id: 'approved',
    label: 'Approved',
    icon: 'CircleCheck',
    number: 125,
    title: 'Fix the pagination label',
    headRef: 'fix/125-pagination-label',
    headSha: 'b39e2189abcdef0123456789abcdef0123456789',
    additions: 8,
    deletions: 3,
    files: ['src/table/pagination.tsx', 'tests/pagination.spec.tsx'],
    evaluatedAt: '2026-01-01T11:51:00.000Z',
    mode: 'enforce',
    changeClass: 'Standard',
    risk: 'Low',
    action: 'approve',
    reviewIssued: 'Approval issued by change-gate',
    conclusion: 'success',
    tone: 'success',
    headline: 'Approved by the change gate',
    description: 'This Standard change satisfies the policy and has no blocking findings. The gate issues an approving review on commit b39e218.',
    decision: 'Approval issued.',
    decisionDetail: 'Enforce mode allows this eligible review. Repository rules and the independent human release approval still apply.',
    policyText: 'The pagination label change touches no protected paths. Both reviewers suggest low risk, and the Standard route permits the gate to approve when every applicable criterion is satisfied.',
    reviewerIntro: 'Both reviewers suggested low risk and returned no findings.',
    findings: [],
    reviewers: fixture.reviewers,
    openRequirement: 'None in this evaluation',
    criteria: [
      ...sharedCriteria,
      { title: 'Independent review and risk grade', evidence: '2 of 2 reviewers completed. Both suggested low risk; no findings or protected paths.', status: 'passed' },
      { title: 'Current-head human approval', evidence: 'Not required by the gate for this eligible Standard change. The separate human release approval is still required.', status: 'not-required' }
    ]
  },
  {
    ...authChange,
    id: 'human',
    label: 'Human approved',
    icon: 'Users',
    evaluatedAt: '2026-01-01T12:08:00.000Z',
    mode: 'enforce',
    reviewIssued: 'None — human approval already satisfies the criterion',
    conclusion: 'success',
    tone: 'success',
    headline: 'Approved by another engineer',
    description: 'sample-reviewer, a human other than the author, approved the current head commit 0123456. All criteria are satisfied.',
    decision: 'Human approval recorded; gate approval withheld.',
    decisionDetail: 'Normal changes stay on the human-review route. The gate publishes a successful check without issuing its own approving review.',
    openRequirement: 'None in this evaluation',
    criteria: [
      ...authCriteria,
      authReview,
      { title: 'Current-head human approval', evidence: 'sample-reviewer is not the author and approved the current commit 0123456 after the last push.', status: 'passed' }
    ]
  },
  {
    id: 'changes',
    label: 'Changes requested',
    icon: 'CircleAlert',
    number: 126,
    title: 'Find records by identifier',
    headRef: 'feat/126-record-lookup',
    headSha: 'c7f091a9abcdef0123456789abcdef0123456789',
    additions: 31,
    deletions: 9,
    files: ['src/records/find-record.ts', 'tests/find-record.spec.ts'],
    evaluatedAt: '2026-01-01T12:12:00.000Z',
    mode: 'enforce',
    changeClass: 'Normal',
    risk: 'Medium',
    action: 'request_changes',
    reviewIssued: 'Changes requested by change-gate',
    conclusion: 'failure',
    tone: 'danger',
    headline: 'Blocking security finding',
    description: 'The record lookup omits the tenant constraint. Two reviewers return a matching high-severity claim at the same file and line, each above the 0.7 confidence threshold.',
    decision: 'Changes requested.',
    decisionDetail: 'The gate requests changes in enforce mode. An existing human approval does not erase a corroborated blocking finding.',
    policyText: 'Security and correctness return a matching high-severity claim on src/records/find-record.ts:42, at 0.86 and 0.78 confidence. Both reports meet the blocking threshold. The resulting risk grade is medium and the gate requests changes. One high-severity report alone would still require a human decision.',
    reviewerIntro: 'Security suggested high risk; correctness suggested medium. Their matching findings form one blocking group. Agreement meets a policy rule; it is not proof that the finding is correct.',
    findings: [tenantFinding],
    reviewers: fixture.reviewers.map(reviewer => reviewer.reviewer === 'security'
      ? { ...reviewer, suggestedGrade: 'high', summary: 'The changed lookup may return a record from another tenant.', findings: [tenantFinding] }
      : { ...reviewer, suggestedGrade: 'medium', summary: 'The tenant argument was dropped from the repository call.', findings: [tenantFindingCorrectness] }),
    openRequirement: 'Resolve the blocking tenant-isolation finding',
    criteria: [
      ...sharedCriteria,
      { title: 'Independent review and risk grade', evidence: '2 of 2 reviewers completed. One matching finding group has two high-severity reports, each above the 0.7 confidence threshold: blocking.', status: 'failed' },
      { title: 'Current-head human approval', evidence: 'sample-reviewer approved current commit c7f091a. That approval cannot override the blocking security finding.', status: 'passed' }
    ]
  }
];
