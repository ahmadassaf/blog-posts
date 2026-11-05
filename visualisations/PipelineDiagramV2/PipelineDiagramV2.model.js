/**
 * Pipeline Diagram V2 model
 *
 * Pure shaping of the MDX props into what the static figure prints. Kept apart
 * from the component so the data contract can be checked without a renderer.
 */

const SCRIPT_PATTERN = /\b[\w-]+\.sh\b/u;

/*
 * The script name is taken from an explicit `script` field when the post
 * provides one, otherwise from the first `*.sh` mentioned in the stage's own
 * detail sentence. Nothing is invented when neither exists.
 */
export const scriptFor = (stage) => {
  if (stage.script) return stage.script;

  const match = SCRIPT_PATTERN.exec(stage.detail || '');

  return match ? match[0] : null;
};

/*
 * The run stops at the boundary after the last stage that can fail and before
 * the first stage that cannot. With Build and Validate able to fail and Deploy
 * not, that boundary sits between Validate and Deploy. Returns null when no
 * such boundary exists (no failing stage, or every stage can fail).
 */
export const stopBoundary = (stages, destination) => {
  const failing = stages.filter((stage) => stage.failure);

  if (failing.length === 0) return null;

  const lastFailing = stages.lastIndexOf(failing[failing.length - 1]);
  const next = stages[lastFailing + 1];

  if (!next) return null;

  const guarded = failing.map((stage) => stage.label);
  const target = destination?.label ? ` to ${destination.label}` : '';
  const verb = guarded.length > 1 ? 'pass' : 'passes';

  return {
    'afterIndex': lastFailing,
    'note': `${next.label}${target} runs only after ${guarded.join(' and ')} ${verb}.`,
    'title': 'Run stops here on failure'
  };
};

export const routeFor = ({ destination, pipeline, platform, source }) => [ source, platform, pipeline, destination ]
  .map((node) => node?.label)
  .filter(Boolean);

export const buildFigure = ({ destination, pipeline, platform, source }) => {
  const stages = pipeline.stages.map((stage, index) => {
    return {
      'detail': stage.detail || `${stage.label} runs in ${pipeline.label}.`,
      'id': stage.id || `stage-${index}`,
      'label': stage.label,
      'number': index + 1,
      'script': scriptFor(stage)
    };
  });

  return {
    'route': routeFor({ destination, pipeline, platform, source }),
    stages,
    'stop': stopBoundary(pipeline.stages, destination)
  };
};
