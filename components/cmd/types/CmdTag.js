function CmdTag({ title, count }) {

  return (
    <div className='flex justify-between w-full'>
      <div className='text-md'>{ title }</div>
      <span className='text-xs rounded bg-blue-600 text-white p-1'>{ count } posts</span>
    </div>
  );
}

export default CmdTag;

