# Change-gate interactive illustrations

The article uses three content-owned React components:

- `ChangeGateFlow`: a selectable walkthrough of the evaluation pipeline, with
  inputs, decisions, outputs and a shadow/enforce comparison.
- `ChangeGateReport`: a GitHub-style pull-request report with four selectable cases,
  a working full-report disclosure and a check-run view. `ChangeGateReport.data.js`
  supplies waiting, gate-approved, human-approved and blocking-finding scenarios.
  The waiting case follows `report-output.md` and `report-fixture.json`; the other
  cases use additional synthetic inputs. Selecting a case updates every report view.
  The blocking case supplies two matching high-severity reports at confidence 0.86
  and 0.78. It requests changes with a medium risk grade; a blocking action and a
  high risk grade are not interchangeable. An uncorroborated serious finding would
  still require human review. These examples illustrate policy, not model accuracy.
- `ChangeGateDashboard`: an explorable dashboard concept over synthetic evaluation
  records. Its delivery-and-decision disclosure connects a synthetic delivery, job,
  attempt, input fingerprint, policy and reviewer versions to the recorded outcome.
  It is not a screenshot of a shipped dashboard or production metrics. Sample
  fingerprints and database principals are illustrative, not exported credentials.

All interactions stay in the page. No live repository, model provider or evidence
endpoint is called. Synthetic identifiers are display values, not external links.
The components inherit the site's theme and adapt to their article container.

## Original formatter screenshots

These screenshots are generated from the real change-gate comment formatter using
the fully synthetic inputs in `report-fixture.json`. They do not capture a live pull
request or imply that the model findings came from a real review.

The example deliberately declares a Standard change and supplies two low-risk model
responses. A protected authentication path still makes the result Normal/high-risk,
and the missing current-head human approval withholds it. The service is in shadow
mode, so no review action would be issued.

`report-output.md` is the exact formatter output, with its clock replaced by the
fixture timestamp. The screenshots close the formatter's native `Full report`
disclosure. They are retained as source references for the interactive illustration.
Link styling is retained in the screenshot, but fixture URLs use
the reserved `.invalid` domain and are never requested.

To regenerate with existing local dependencies:

```sh
node --import <source-root>/node_modules/tsx/dist/loader.mjs generate-report.mjs \
  --source-root <change-gate-checkout> \
  --blog-root <blog-engine-checkout> \
  --playwright-root <package-with-playwright-test>
```

The script imports only the pure renderer, evaluator, risk assessment and policy
modules. It does not import the application entry point, load environment files,
call model or GitHub APIs, or inspect deployment configuration.

`provenance.json` records the formatter hash and image dimensions. PNG metadata also
records their origin. No private repository names, real user handles, customer
details, credentials, real findings or production performance numbers are included.
