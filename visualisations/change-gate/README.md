# Change-gate interactive illustrations

The article uses three content-owned React components:

- `ChangeGateFlow`: a selectable walkthrough of the evaluation pipeline, with
  inputs, decisions, outputs and a shadow/enforce comparison.
- `ChangeGateReport`: a GitHub-style pull-request report with a working full-report
  disclosure and check-run view. Its evidence follows `report-output.md` and
  `report-fixture.json`; the surrounding interface is an illustrative recreation.
- `ChangeGateDashboard`: an explorable dashboard concept over synthetic evaluation
  records. It is not a screenshot of a shipped dashboard or production metrics.

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
