/**
 * Six contribution scopes, adapted from Elliot Graebert's impact-based level system.
 * Every level carries the same five fields so the readout never has an empty panel:
 * examples (technical and leadership), evidence, support, and a development experiment.
 */

export const levels = [
  {
    'description': 'Deliver a well-defined task with a clear purpose, quality bar, and someone available to help.',
    'evidence': 'Discuss the finished work, the checks performed, and how questions or blockers were raised. Look at the clarity of the brief as well as the execution.',
    'experiment': 'For the next task, explain the acceptance checks before starting, then review with a mentor whether those checks caught the important issues.',
    'id': 'l1',
    'kind': 'Defined task',
    'leadership': 'At this scope, management is a supporting responsibility: explain the task, make help available, and give specific feedback. This is not a proposed entry-level management role.',
    'name': 'L1',
    'support': 'An accessible mentor, a usable development environment, and a shared example of what finished work looks like.',
    'technical': 'Implement a scoped change, check it against the agreed behavior, and explain any uncertainty before handing it over.'
  },
  {
    'description': 'Deliver a bounded project while more experienced colleagues help with unfamiliar trade-offs and business context.',
    'evidence': 'Review how dependencies, risks, and handoffs were handled. Distinguish gaps in execution from gaps in the plan someone else supplied.',
    'experiment': 'Map the next project’s dependencies and review them with a colleague. After delivery, compare the predicted handoffs with the ones that caused delays.',
    'id': 'l2',
    'kind': 'Bounded project',
    'leadership': 'Coordinate a small piece of delivery: clarify ownership, surface dependencies, and arrange help. This responsibility does not require a people-management title.',
    'name': 'L2',
    'support': 'A clear decision owner, timely product context, and help with trade-offs outside the person’s experience.',
    'technical': 'Deliver the project through implementation, testing, and support, making risks visible as the work develops.'
  },
  {
    'description': 'Turn an ambiguous goal into a workable project, and change the approach when new evidence calls for it.',
    'evidence': 'Discuss the framing of the problem, decisions made, collaboration, and the resulting work. Include constraints and contributions from other people.',
    'experiment': 'For the next proposal, ask a colleague to identify the decision, alternatives, and owner from the first page. Use any gaps to improve the proposal.',
    'id': 'l3',
    'kind': 'Open project',
    'leadership': 'Help a project group agree priorities, resolve dependencies, and keep the decisions visible to the people doing the work.',
    'name': 'L3',
    'support': 'Access to stakeholders, clear authority to make decisions, and a sounding board for unfamiliar choices.',
    'technical': 'Frame the problem, compare approaches, and bring the right people into technical decisions before committing to a solution.'
  },
  {
    'description': 'Improve how a team works, so the contribution continues through other people’s decisions and practice.',
    'evidence': 'Look for changes in the team’s work: clearer decisions, useful shared practices, or recurring problems reduced. Ask teammates what actually helped.',
    'experiment': 'Try a shared review guide on the next few changes. Ask reviewers where it helped, where it added friction, and what should change.',
    'id': 'l4',
    'kind': 'Team',
    'leadership': 'Clarify priorities and responsibilities, create development opportunities, and address constraints that the team cannot remove alone.',
    'name': 'L4',
    'support': 'Time for mentoring and improvement work, agreement on team priorities, and authority that matches the responsibility.',
    'technical': 'Guide architecture, mentor colleagues, and improve engineering practices that the team can use without depending on one person.'
  },
  {
    'description': 'Help several teams make coherent decisions across a shared problem or product area.',
    'evidence': 'Review the decisions and coordination across teams, including what was stopped or simplified. Consider which constraints the person could influence.',
    'experiment': 'Choose one recurring dependency between teams, agree a decision owner and escalation path, then review whether the next decision was easier to make.',
    'id': 'l5',
    'kind': 'Several teams',
    'leadership': 'Develop team leaders, align responsibilities across teams, and negotiate priorities and resources for the shared area.',
    'name': 'L5',
    'support': 'Sponsorship across team boundaries, access to strategy and resource decisions, and colleagues who can challenge the proposed direction.',
    'technical': 'Shape a technical direction across teams, guide shared architecture, and develop other technical leaders.'
  },
  {
    'description': 'Shape decisions whose consequences extend across the company, with accountability for their wider effects.',
    'evidence': 'Examine the quality of strategic choices, how assumptions were tested, and effects over time. Include uncertainty and decisions owned by others.',
    'experiment': 'Before a major commitment, make a critical assumption explicit and run a bounded test. Review the evidence with the people accountable for the decision.',
    'id': 'l6',
    'kind': 'Company',
    'leadership': 'Shape the organization, develop its leaders, and align resources and responsibilities with the company’s direction.',
    'name': 'L6',
    'support': 'Shared business context, explicit decision rights, access to dissenting views, and enough time to observe longer-term consequences.',
    'technical': 'Guide company-wide technical strategy and help teams make consequential choices about capabilities, architecture, or technical risk.'
  }
];

export const defaultLevelId = 'l3';

/** The level for an id, falling back to the default so an unknown value never empties the readout. */
export function findLevel(id) {
  return levels.find((level) => level.id === id) || levels.find((level) => level.id === defaultLevelId);
}

/** The heading and status text for a level: the name and its scope, nothing else. */
export function levelLabel(level) {
  return `${level.name}: ${level.kind}`;
}
