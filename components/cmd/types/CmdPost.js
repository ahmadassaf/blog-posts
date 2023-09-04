function CmdPost({ title, category }) {

  return (
    <div className='flex justify-between w-full'>
      <div className='text-md'>{ title }</div>
      <span className='text-xs rounded bg-green-600 text-white p-2 capitalize'>{ category.replace('-', ' ') }</span>
    </div>
  );
}

export default CmdPost;

