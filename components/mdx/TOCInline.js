const TOCInline = ({
  toc,
  indentDepth = 3,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = true,
  exclude = ''
}) => {
  const re = Array.isArray(exclude) ? new RegExp(`^(${exclude.join('|')})$`, 'i') : new RegExp(`^(${exclude})$`, 'i');

  const filteredToc = toc.filter(
    (heading) => heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  );

  const tocList = (
    <ul>
      {filteredToc.map((heading) => (
        <li key={ heading.value } className={ `${heading.depth >= indentDepth && 'ml-6'}` }>
          <a href={ heading.url }>{heading.value}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {asDisclosure ? (
        // eslint-disable-next-line react/no-unknown-property
        <details closed='true'>
          <summary className='ml-6 pt-2 pb-2 text-xl font-bold'>Table of Contents</summary>
          <div className='ml-6'>{tocList}</div>
        </details>
      ) : (
        tocList
      )}
    </>
  );
};

export default TOCInline;
