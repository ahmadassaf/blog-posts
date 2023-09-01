
import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';

import IconEmail from '@/static/icons/email-light.svg';
import IconGithub from '@/static/icons/socials/github-light.svg';
import IconLinkedin from '@/static/icons/socials/linkedin-light.svg';
import IconTwitter from '@/static/icons/socials/twitter-light.svg';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

function PostsCmd({ setPage, search }) {

  const socialItems = filterItems(
    [
      {
        'heading': 'Contact Me',
        'id': 'contact',
        'items': [
          {
            'children': 'Linkedin',
            'closeOnSelect': false,
            'heroIcon': <IconLinkedin className='h-5 w-5'/>,
            'id': 'linkedin',
            'onClick': () => {
              window.open('https://linkedin.com/in/ahmadassaf', '_blank').focus();
            },
            'title': 'My Linkedin Profile'
          },
          {
            'children': 'Twitter',
            'closeOnSelect': false,
            'heroIcon': <IconTwitter className='h-5 w-5'/>,
            'id': 'twitter',
            'onClick': () => {
              window.open('https://twitter.com/ahmadaassaf', '_blank').focus();
            },
            'title': 'Follow my Tweets'
          },
          {
            'children': 'Github',
            'closeOnSelect': false,
            'heroIcon': <IconGithub className='h-5 w-5'/>,
            'id': 'github',
            'onClick': () => {
              window.open('https://github.com/ahmadassaf', '_blank').focus();
            },
            'title': 'Check my Github repos'
          },
          {
            'children': 'Mail',
            'closeOnSelect': false,
            'heroIcon': <IconEmail className='h-5 w-5'/>,
            'id': 'mail',
            'onClick': () => {
              window.open('mailto:ahmad@assaf.website', '_blank').focus();
            },
            'title': 'E-mail me'
          }
        ]
      }
    ], search
  );

  return (
    <CommandPalette.Page id='contact' searchPrefix={ [ 'General', 'Contact' ] } onEscape={ () => {
      setPage('root');
    } }>

      {socialItems.length ? (
        socialItems.map((list) => (
          <CommandPalette.List key={ list.id } heading={ list.heading }>
            {list.items.map(({ id, title, heroIcon, ...rest }) => (
              <CommandPalette.ListItem
                key={ id }
                index={ getItemIndex(socialItems, id) }
                { ...rest }
              >
                <div className='flex items-center w-full'>
                  {heroIcon}
                  <div className='mx-2 text-md'>{ title }</div>
                </div>
              </CommandPalette.ListItem>
            ))}
          </CommandPalette.List>
        ))
      ) : (
        <CommandPalette.FreeSearchAction />
      )}
    </CommandPalette.Page>
  );
}

export default PostsCmd;
