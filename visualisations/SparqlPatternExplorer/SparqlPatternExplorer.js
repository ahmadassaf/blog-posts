'use client';

/**
 * THESIS: A SPARQL triple pattern is a stencil laid over the data: constants must match exactly, variables soak up whatever sits beneath them.
 * OWN-WORLD: The eight sample triples from the post laid out as rows; each query pattern lights up exactly the rows it matches.
 * STORY: Switch between three query patterns to see which triples match and what bindings fall out, or click any triple to read what it says.
 * FIRST VIEWPORT: All eight triples with the pattern ?x foaf:name ?name active and four rows lit.
 * FORM: A responsive SVG triple table with semantic tab switching and selectable rows.
 */

import { useState } from 'react';

import styles from './SparqlPatternExplorer.module.css';

const triples = [
  {
    'id': 't1',
    'object': '"Ahmad\'s Blog"',
    'predicate': 'foaf:name',
    'reads': 'The resource blog1 has the name "Ahmad\'s Blog". A blog is a thing with a name too, which is why a bare foaf:name pattern picks it up alongside people.',
    'subject': 'ex:blog1'
  },
  {
    'id': 't2',
    'object': 'ex:Assaf',
    'predicate': 'aa:owner',
    'reads': 'The resource blog1 has an owner, and that owner is the resource Assaf. The object here is another resource, not a text value.',
    'subject': 'ex:blog1'
  },
  {
    'id': 't3',
    'object': '"Ahmad Assaf"',
    'predicate': 'foaf:name',
    'reads': 'The resource Assaf has the name "Ahmad Assaf". This is the triple the chained query reaches after following aa:owner out of blog1.',
    'subject': 'ex:Assaf'
  },
  {
    'id': 't4',
    'object': 'ex:London',
    'predicate': 'foaf:based_near',
    'reads': 'The resource Assaf is based near London. None of the three patterns here touches this triple; the post leans on it later to filter owners by location.',
    'subject': 'ex:Assaf'
  },
  {
    'id': 't5',
    'object': '"Overfit.in"',
    'predicate': 'foaf:name',
    'reads': 'The resource blog2 has the name "Overfit.in". Like blog1, it matches any pattern with foaf:name in the predicate position.',
    'subject': 'ex:blog2'
  },
  {
    'id': 't6',
    'object': 'ex:Ahmad',
    'predicate': 'aa:owner',
    'reads': 'The resource blog2 has an owner, the resource Ahmad. Together with the other aa:owner triple, it is the only place ownership lives in this dataset.',
    'subject': 'ex:blog2'
  },
  {
    'id': 't7',
    'object': '"Ahmad"',
    'predicate': 'foaf:name',
    'reads': 'The resource Ahmad has the name "Ahmad". The chained query reaches it by following aa:owner out of blog2.',
    'subject': 'ex:Ahmad'
  },
  {
    'id': 't8',
    'object': 'ex:Manchester',
    'predicate': 'foaf:based_near',
    'reads': 'The resource Ahmad is based near Manchester. No pattern here matches it, but the post\'s FILTER example uses it to find owners who are not near London.',
    'subject': 'ex:Ahmad'
  }
];

const patterns = {
  'chain': {
    'blurb': 'Two query triples share the variable ?x, and that shared variable joins them. The first triple finds each owner; the second follows the same ?x to its foaf:name. Each highlighted pair of rows collapses into one solution.',
    'label': '?blog aa:owner ?x . ?x foaf:name ?name',
    'matches': [ 't2', 't3', 't6', 't7' ],
    'meaning': 'owner, then name',
    'meta': '4 of 8 triples match · 2 solutions · rows join on ?x',
    'solutions': [
      '{?blog = http://example.org/blog1, ?x = http://example.org/Assaf, ?name = "Ahmad Assaf"}',
      '{?blog = http://example.org/blog2, ?x = http://example.org/Ahmad, ?name = "Ahmad"}'
    ],
    'tab': 'chained pair'
  },
  'name': {
    'blurb': 'One query triple where the subject and the object are variables and the predicate is the constant foaf:name. Four of the eight database triples carry foaf:name in the predicate position, so all four match: ?x soaks up each subject and ?name each object. Nothing restricts ?x to blogs, so people match too.',
    'label': '?x foaf:name ?name',
    'matches': [ 't1', 't3', 't5', 't7' ],
    'meaning': 'every name',
    'meta': '4 of 8 triples match · 4 solutions',
    'solutions': [
      '{?x = http://example.org/blog1, ?name = "Ahmad\'s Blog"}',
      '{?x = http://example.org/Assaf, ?name = "Ahmad Assaf"}',
      '{?x = http://example.org/blog2, ?name = "Overfit.in"}',
      '{?x = http://example.org/Ahmad, ?name = "Ahmad"}'
    ],
    'tab': '?x foaf:name ?name'
  },
  'owner': {
    'blurb': 'Here the constant is aa:owner, and only the two ownership triples carry it. ?blog binds to each blog resource and ?x to its owner. The objects are resources rather than text, which is exactly what makes the next hop possible.',
    'label': '?blog aa:owner ?x',
    'matches': [ 't2', 't6' ],
    'meaning': 'the owners',
    'meta': '2 of 8 triples match · 2 solutions',
    'solutions': [
      '{?blog = http://example.org/blog1, ?x = http://example.org/Assaf}',
      '{?blog = http://example.org/blog2, ?x = http://example.org/Ahmad}'
    ],
    'tab': '?blog aa:owner ?x'
  }
};

const patternOrder = [ 'name', 'owner', 'chain' ];

const SparqlPatternExplorer = ({
  title = 'A triple pattern is a stencil',
  description = 'The eight sample triples from this post, one row each. Pick a query pattern to light up the rows it matches and read the solution bindings, or click any triple to read what it says.',
  className = ''
}) => {
  const [ activePatternId, setActivePatternId ] = useState('name');
  const [ selectedTripleId, setSelectedTripleId ] = useState(null);
  const activePattern = patterns[activePatternId];
  const selectedTriple = triples.find((triple) => triple.id === selectedTripleId) || null;
  const matchWord = activePattern.matches.includes(selectedTripleId) ? 'matches' : 'does not match';
  const readoutMeta = selectedTriple ? `this triple ${matchWord} the active pattern ${activePattern.label}` : activePattern.meta;

  const selectTriple = (tripleId) => {
    const triple = triples.find((row) => row.id === tripleId);

    return {
      'aria-label': `Read the triple ${triple.subject} ${triple.predicate} ${triple.object}`,
      'aria-pressed': selectedTripleId === tripleId,
      'data-active': activePattern.matches.includes(tripleId),
      'data-selected': selectedTripleId === tripleId,
      'onClick': () => setSelectedTripleId(tripleId),
      'onFocus': () => setSelectedTripleId(tripleId),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setSelectedTripleId(tripleId);
        }
      },
      'role': 'button',
      'tabIndex': 0
    };
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <div className={ styles.toolbar }>
        <div className={ styles.typeTabs } aria-label='Query pattern' role='group'>
          {patternOrder.map((id) => [ id, patterns[id] ]).map(([ id, pattern ]) => (
            <button
              type='button'
              aria-label={ `${pattern.label}, ${pattern.meaning}` }
              aria-pressed={ activePatternId === id }
              data-active={ activePatternId === id }
              key={ id }
              onClick={ () => {
                setActivePatternId(id);
                setSelectedTripleId(null);
              } }
            >
              <strong>{pattern.tab}</strong>
              <span>{pattern.meaning}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the diagram</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable triple pattern matching diagram' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 472' role='group' aria-label='The eight sample triples as rows'>
          <text x='56' y='40' className={ styles.columnHead }>SUBJECT</text>
          <text x='396' y='40' className={ styles.columnHead }>PREDICATE</text>
          <text x='620' y='40' className={ styles.columnHead }>OBJECT</text>

          {triples.map((triple, index) => {
            const top = 60 + (index * 46);

            return (
              <g className={ styles.row } key={ triple.id } { ...selectTriple(triple.id) }>
                <rect x='32' y={ top } width='936' height='40' rx='10' />
                <text x='56' y={ top + 25 } className={ styles.cell }>{triple.subject}</text>
                <text x='396' y={ top + 25 } className={ styles.cell }>{triple.predicate}</text>
                <text x='620' y={ top + 25 } className={ styles.cell }>{triple.object}</text>
                <text x='944' y={ top + 25 } textAnchor='end' className={ styles.matchFlag }>match</text>
              </g>
            );
          })}

          <text x='32' y='452' className={ styles.legend }>
            {'prefixes shortened for display: ex: <http://example.org/> · foaf: <http://xmlns.com/foaf/0.1/> · aa: <http://example.org/Personal#>'}
          </text>
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>
            {selectedTriple ? `${selectedTriple.subject} ${selectedTriple.predicate} ${selectedTriple.object}` : activePattern.label}
          </span>
          <span className={ styles.readoutText }>{selectedTriple ? selectedTriple.reads : activePattern.blurb}</span>
        </div>
        {selectedTriple ? null : (
          <ul className={ styles.readoutSolutions }>
            {activePattern.solutions.map((solution) => (
              <li key={ solution }>{solution}</li>
            ))}
          </ul>
        )}
        <span className={ styles.readoutMeta }>{readoutMeta}</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {selectedTriple ? `${selectedTriple.subject} ${selectedTriple.predicate} ${selectedTriple.object}. ${selectedTriple.reads} ${readoutMeta}.` : `${activePattern.label}, ${activePattern.meaning}. ${activePattern.blurb} Solutions: ${activePattern.solutions.join(' ')}`}
      </p>
    </figure>
  );
};

export default SparqlPatternExplorer;
