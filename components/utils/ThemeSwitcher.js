import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import IconDarkMode from '@/static/icons/darkMode.svg';
import IconLightMode from '@/static/icons/lightMode.svg';

const ThemeSwitch = () => {
  const [ mounted, setMounted ] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <button aria-label='Toggle Dark Mode' type='button' style={{ 'outline': 'none' }} className='mx-4 h-8 w-8 rounded p-1' onClick={ () => setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark') }>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='text-gray-900 dark:text-gray-100'>
        {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (<IconDarkMode />) : (<IconLightMode />)}
      </svg>
    </button>
  );
};

export default ThemeSwitch;
