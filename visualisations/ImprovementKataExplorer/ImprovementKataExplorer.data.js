export const baselineHours = [ 4, 6, 7, 8, 10, 12, 16, 18, 20, 24 ];

export const trials = {
  'backup': {
    'change': 'Keep the window and nominate a backup when the reviewer is handling an incident.',
    'hours': [ 3, 5, 6, 8, 12 ],
    'learning': 'The backup covered two interruptions in this sample. One request still waited because both reviewers were occupied. This is a reason to inspect coverage further, not proof that the process is now reliable.',
    'observations': [
      'Reviewed in the window.',
      'Backup covered an incident interruption.',
      'Reviewed in the window.',
      'Backup completed the first review.',
      'Both reviewers were occupied.'
    ],
    'step': 'Alternative next experiment',
    'title': 'Give the review window backup coverage'
  },
  'reminder': {
    'change': 'Keep the original staffing and send a reminder before each review window.',
    'hours': [ 4, 6, 8, 13, 16 ],
    'learning': 'The reminders were seen, but they did not create availability during incidents. In this sample, coverage remains the obstacle. This does not tell us whether reminders help in a different situation.',
    'observations': [
      'Reviewed after the reminder.',
      'Reviewed in the window.',
      'Reviewed within one working day.',
      'Reminder arrived while the reviewer handled an incident.',
      'Reviewer saw the reminder but had no capacity.'
    ],
    'step': 'Alternative next experiment',
    'title': 'Send reminders before the review window'
  },
  'window': {
    'change': 'Reserve a daily window for one reviewer, keeping the existing review checks.',
    'hours': [ 4, 6, 8, 12, 16 ],
    'learning': 'The window was interrupted by incident work. That makes reviewer availability an obstacle worth investigating; it does not establish that protected time never helps.',
    'observations': [
      'Reviewed in the window.',
      'Reviewed in the window.',
      'Reviewed within one working day.',
      'Reviewer was pulled into an incident.',
      'Incident work displaced the review window.'
    ],
    'step': 'First experiment',
    'title': 'Protect a daily review window'
  }
};

export function withinWorkingDay(hours) {
  return hours.filter((value) => value <= 8).length;
}

export function predictionSnapshot(expected, note) {
  if (!Number.isInteger(expected) || expected < 0 || expected > 5) throw new RangeError('Predict between zero and five requests.');

  return { expected, 'note': note.trim() };
}

export function comparePrediction(hours, expected) {
  const actual = withinWorkingDay(hours);
  const difference = actual - expected;

  return {
    actual,
    'comparison': difference === 0 ? 'The count matches your prediction.' : `${Math.abs(difference)} ${difference < 0 ? 'fewer' : 'more'} than you predicted.`
  };
}
