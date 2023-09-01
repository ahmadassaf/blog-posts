import IconEmail from '@/static/icons/email.svg';
import IconGithub from '@/static/icons/socials/github.svg';
import IconLinkedin from '@/static/icons/socials/linkedin.svg';
import IconTwitter from '@/static/icons/socials/twitter.svg';
import IconYoutube from '@/static/icons/socials/youtube.svg';

const components = {
  'github': IconGithub,
  'linkedin': IconLinkedin,
  'mail': IconEmail,
  'twitter': IconTwitter,
  'youtube': IconYoutube
};

const Icon = ({ kind, href }) => {
  // eslint-disable-next-line prefer-named-capture-group
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))) return null;

  const SocialSvg = components[kind];

  return (
    <a className='text-sm text-gray-500 transition hover:text-gray-600' target='_blank' rel='noopener noreferrer' href={ href } >
      <span className='sr-only'>{kind}</span>
      <SocialSvg className={ `h-5 w-5 fill-current text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400` }/>
    </a>
  );
};

export default Icon;
