'use client';

/**
 * THESIS: A SPARQL triple pattern is a stencil laid over the data: constants must match exactly, variables soak up whatever sits beneath them.
 * OWN-WORLD: The eight sample triples from the post laid out as rows; each query pattern lights up exactly the rows it matches.
 * STORY: Switch between three query patterns to see which triples match and what bindings fall out, or click any triple to read what it says.
 * FIRST VIEWPORT: All eight triples with the pattern ?x foaf:name ?name active and four rows lit.
 * FORM: A responsive SVG triple table with semantic tab switching and selectable rows.
 */

import { useState } from 'react';

import { graphSelectionProps } from '../graphSelectionProps';

import styles from './SparqlPatternExplorer.module.css';

const triples = [
  {
    'id': 't1',
    'object': '"Ahmad Assaf\'s Blog"',
    'predicate': 'aa:hasName',
    'reads': 'This triple records the title of Ahmad’s blog. The title pattern matches its aa:hasName predicate.',
    'subject': 'site:blog'
  },
  {
    'id': 't2',
    'object': ':ahmadassaf',
    'predicate': 'aa:owner',
    'reads': 'The ownership arrow goes from the blog to Ahmad’s IRI. That IRI connects this triple to his name.',
    'subject': 'site:blog'
  },
  {
    'id': 't3',
    'object': '"Ahmad Assaf"',
    'predicate': 'foaf:name',
    'reads': 'Ahmad’s display name belongs to the person identified by :ahmadassaf.',
    'subject': ':ahmadassaf'
  },
  {
    'id': 't4',
    'object': 'ex:London',
    'predicate': 'foaf:based_near',
    'reads': 'Ahmad is recorded as being based near London. This location does not match the title or ownership patterns.',
    'subject': ':ahmadassaf'
  },
  {
    'id': 't5',
    'object': '"Overfit.in"',
    'predicate': 'aa:hasName',
    'reads': 'Overfit.in is the title of the second blog. Both blog titles use aa:hasName.',
    'subject': 'ex:blog2'
  },
  {
    'id': 't6',
    'object': 'ex:otherOwner',
    'predicate': 'aa:owner',
    'reads': 'The second blog’s ownership triple leads to a different person in this example.',
    'subject': 'ex:blog2'
  },
  {
    'id': 't7',
    'object': '"Other owner"',
    'predicate': 'foaf:name',
    'reads': 'The chained query reaches this display name after finding the owner of the second blog.',
    'subject': 'ex:otherOwner'
  },
  {
    'id': 't8',
    'object': 'ex:Manchester',
    'predicate': 'foaf:based_near',
    'reads': 'The other owner has a recorded location near Manchester. A query for an explicit London location does not match this triple.',
    'subject': 'ex:otherOwner'
  }
];

const patterns = {
  'chain': {
    'blurb': 'The first pattern binds ?owner to a person. The second uses the same IRI as its subject to find that person’s foaf:name. Each highlighted pair of triples yields one solution.',
    'label': '?blog aa:owner ?owner . ?owner foaf:name ?ownerName',
    'matches': [ 't2', 't3', 't6', 't7' ],
    'meaning': 'owner, then name',
    'meta': '4 of 8 triples match · 2 solutions · joined on ?owner',
    'solutions': [
      '{?blog = site:blog, ?owner = :ahmadassaf, ?ownerName = "Ahmad Assaf"}',
      '{?blog = ex:blog2, ?owner = ex:otherOwner, ?ownerName = "Other owner"}'
    ],
    'tab': 'chained pair'
  },
  'name': {
    'blurb': 'The predicate is fixed at aa:hasName. Two directory triples use it, so the query binds ?blog and ?name twice. The people’s names use a different predicate.',
    'label': '?blog aa:hasName ?name',
    'matches': [ 't1', 't5' ],
    'meaning': 'blog titles',
    'meta': '2 of 8 triples match · 2 solutions',
    'solutions': [
      '{?blog = site:blog, ?name = "Ahmad Assaf\'s Blog"}',
      '{?blog = ex:blog2, ?name = "Overfit.in"}'
    ],
    'tab': '?blog aa:hasName ?name'
  },
  'owner': {
    'blurb': 'Only the two ownership triples carry aa:owner. Each match binds ?blog to the blog IRI and ?owner to the related person.',
    'label': '?blog aa:owner ?owner',
    'matches': [ 't2', 't6' ],
    'meaning': 'the owners',
    'meta': '2 of 8 triples match · 2 solutions',
    'solutions': [
      '{?blog = site:blog, ?owner = :ahmadassaf}',
      '{?blog = ex:blog2, ?owner = ex:otherOwner}'
    ],
    'tab': '?blog aa:owner ?owner'
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
      ...graphSelectionProps({
        'label': `Read the triple ${triple.subject} ${triple.predicate} ${triple.object}`,
        'onSelect': () => setSelectedTripleId(tripleId),
        'selected': selectedTripleId === tripleId
      }),
      'data-active': activePattern.matches.includes(tripleId),
      'data-selected': selectedTripleId === tripleId
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
        <svg className={ styles.graph } viewBox='0 0 1000 492' role='group' aria-label='The eight sample triples as rows'>
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

          <text x='32' y='449' className={ styles.legend }>
            {'site: <http://assaf.website/> · : <http://assaf.website/triples#> · aa: <http://assaf.website/Personal#>'}
          </text>
          <text x='32' y='473' className={ styles.legend }>
            {'ex: <http://example.org/> · foaf: <http://xmlns.com/foaf/0.1/>'}
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
