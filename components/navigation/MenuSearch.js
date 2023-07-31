const MenuSearch = ({ setOpen }) => (

  <div className='w-full max-w-lg lg:max-w-xs'>
    <label htmlFor='search' className='sr-only'>Search</label>
    <button className='relative w-full' onClick={ () => setOpen(true) }>
      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 right-0'>
        <kbd className='absolute right-1.5 top-1.5 h-6 select-none items-center bg-gray-300 gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 flex'>
          <span className='text-xs font-white'>⌘</span>K
        </kbd>
      </div>
      <input id='search' name='search' className='!outline-none ring-1 ring-gray-300 cursor-pointer block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6' placeholder='Search' type='search'/>
    </button>
  </div>

);

export default MenuSearch;
