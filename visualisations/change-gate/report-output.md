### Change gate · shadow mode (observing only)

**Class:** Normal · **Risk:** HIGH · **Commit:** `0123456`

_Would have: **withhold**._ 👤 **Needs a second engineer**: another engineer must approve the current head commit.

**Open items**
- ❌ Approved by an authorized engineer on the current commit: needs an effective approving review from another engineer with repository write access on the current head commit



<details><summary>Full report</summary>

> **Shadow mode.** The gate is observing only: it posts this check and records evidence but never approves or requests changes.

**Change class:** Normal

- touches protected paths: `src/auth/session.ts`

| | Criterion | Evidence |
|---|---|---|
| ✅ | Pull request is open and not a draft | open, ready for review |
| ✅ | Author eligibility and human accountability | `sample-engineer` is an organisation member |
| ✅ | Change documentation | issue Closes #120; class declared standard; configured verification results listed below; check counts do not establish test adequacy; AI assistance not declared |
| ✅ | Automated checks pass on the head commit | 2 passed: Security scan, Tests |
| ✅ | Required security checks ran and passed | present and passing: Security scan (by sample-scanner) |
| ✅ | Configured test/build checks ran and passed | present and passing: Tests (by github-actions) |
| ✅ | All review conversations are resolved | none open |
| ✅ | Independent review and risk grade | grade high; 2/2 applicable reviewers completed; 0 skipped; 0 finding group(s) from 0 report(s), 0 blocking; touches protected paths: `src/auth/session.ts` |
| ❌ | Approved by an authorized engineer on the current commit | needs an effective approving review from another engineer with repository write access on the current head commit |

### Review routing grade: **HIGH**

- touches protected paths: `src/auth/session.ts`


**Review scope:** 3 of 3 changed lines reviewed (~100 of 60,000 estimated diff-token allowance)

**Reviewers**
- correctness: graded **low**, 0 finding(s). No substantive finding.
- security: graded **low**, 0 finding(s). No substantive finding.

**Finding groups** (0 groups from 0 report(s))
_No findings._

Head commit `0123456789abcdef0123456789abcdef01234567` · evaluated 2026-01-01T12:00:00.000Z

_Would have: **withhold**._

</details>

[Check run](https://example.invalid/checks/123)