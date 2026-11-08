### Change gate · shadow mode (observing only)

**Class:** Normal · **Risk:** HIGH · **Commit:** `0123456`

_Would have: **withhold**._ 👤 **Needs a second engineer**: another engineer must approve the current head commit.

**Open items**
- ❌ Approved by another engineer after the last push: needs an approving review from another engineer on the current head commit



<details><summary>Full report</summary>

> **Shadow mode.** The gate is observing only: it posts this check and records evidence but never approves or requests changes.

**Change class:** Normal

- touches protected paths: `src/auth/session.ts`

| | Criterion | Evidence |
|---|---|---|
| ✅ | Pull request is open and not a draft | open, ready for review |
| ✅ | Author is a human member of the organisation | `sample-engineer` is an organisation member |
| ✅ | Change documentation | issue Closes #120; class declared standard; testing evidenced by the check runs below |
| ✅ | Automated checks pass on the head commit | 2 passed: Security scan, Tests |
| ✅ | Required checks ran and passed (security scanning) | present and passing: Security scan (by sample-scanner) |
| ✅ | All review conversations are resolved | none open |
| ✅ | Independent review and risk grade | grade high; 2/2 reviewers, 0 finding(s), 0 blocking; touches protected paths: `src/auth/session.ts` |
| ❌ | Approved by another engineer after the last push | needs an approving review from another engineer on the current head commit |

### Risk grade: **HIGH** (24 changed lines)

- touches protected paths: `src/auth/session.ts`

**Reviewers**
- correctness: graded **low**, 0 finding(s). No substantive finding in this illustrative response.
- security: graded **low**, 0 finding(s). No substantive finding in this illustrative response.

**Findings**
_No findings._

Head commit `0123456789abcdef0123456789abcdef01234567` · evaluated 2026-01-01T12:00:00.000Z

_Would have: **withhold**._

</details>

[Check run](https://example.invalid/checks/123)