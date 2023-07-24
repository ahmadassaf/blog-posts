import { useEffect, useState } from 'react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
  const [ mounted, setMounted ] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <button aria-label='Toggle Dark Mode' type='button' className='mx-4 h-8 w-8 rounded p-1' onClick={ () => setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark') }>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='text-gray-900 dark:text-gray-100'>
        {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (<BsFillMoonStarsFill />) : (<BsFillSunFill />)}
      </svg>
    </button>
  );
};

export default ThemeSwitch;
