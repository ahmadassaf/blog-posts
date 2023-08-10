import { FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { HiMiniEnvelope } from 'react-icons/hi2';
import { PiGithubLogoFill } from 'react-icons/pi';

const components = {
  'github': PiGithubLogoFill,
  'linkedin': FaLinkedin,
  'mail': HiMiniEnvelope,
  'twitter': FaTwitter,
  'youtube': FaYoutube
};

const Icon = ({ kind, href }) => {
  // eslint-disable-next-line prefer-named-capture-group
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))) return null;

  const SocialSvg = components[kind];

  return (
    <a className='text-sm text-gray-500 transition hover:text-gray-600' target='_blank' rel='noopener noreferrer' href={ href } >
      <span className='sr-only'>{kind}</span>
      <SocialSvg className={ `fill-current text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400` } size={ '18' }/>
    </a>
  );
};

export default Icon;
