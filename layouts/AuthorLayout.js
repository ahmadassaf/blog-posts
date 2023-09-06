export default function AuthorLayout({ content, children }) {
  const { name, occupation } = content;

  return (
    <>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl sm:leading-10 md:text-6xl md:leading-14'>
            {name}
          </h1>
          <h3 className='text-1xl sm:text-1xl leading-9 tracking-tight text-gray-600 dark:text-gray-100 sm:leading-10 md:text-2xl md:leading-14'>
            {occupation}
          </h3>
        </div>
        <div >
          <div className='prose max-w-none pt-8 pb-8 dark:prose-dark xl:col-span-2'>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
