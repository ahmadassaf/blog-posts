function CmdPublication({ title, year }) {

  return (
    <div className='contents w-full'>
      <div className='text-sm w-[90%]'>{ title }</div>
      <span className='text-xs rounded bg-green-600 text-white p-2 capitalize'>{ year }</span>
    </div>
  );
}

export default CmdPublication;

