/* eslint-disable no-lone-blocks */

import IconError from '@/static/icons/callout/error.svg';
import IconInfo from '@/static/icons/callout/info.svg';
import IconOptimize from '@/static/icons/callout/optimize.svg';
import IconSecure from '@/static/icons/callout/secure.svg';
import IconSettings from '@/static/icons/callout/settings.svg';
import IconSuccess from '@/static/icons/callout/success.svg';
import IconWarning from '@/static/icons/callout/warning.svg';

const Callout = ({ text, type }) => {
  let calloutBackgroundColor;
  let calloutIcon;
  let calloutTextColour;

  switch (type) {
  case 'warning':
    {
      calloutIcon = <IconWarning className='h-5 w-5 fill-yellow-400'/>;
      calloutBackgroundColor = 'bg-yellow-50';
      calloutTextColour = 'text-yellow-700';
    }
    break;
  case 'info':
    {
      calloutIcon = <IconInfo className='h-5 w-5 fill-blue-600'/>;
      calloutBackgroundColor = 'bg-blue-50';
      calloutTextColour = 'text-blue-700';
    }
    break;
  case 'success':
    {
      calloutIcon = <IconSuccess className='h-5 w-5 fill-green-600'/>;
      calloutBackgroundColor = 'bg-green-50';
      calloutTextColour = 'text-green-700';
    }
    break;
  case 'error': {
    calloutIcon = <IconError className='h-5 w-5 fill-red-600'/>;
    calloutBackgroundColor = 'bg-red-50';
    calloutTextColour = 'text-red-700';
  }
    break;
  case 'optimize': {
    calloutIcon = <IconOptimize className='h-5 w-5 fill-fuchsia-600'/>;
    calloutBackgroundColor = 'bg-fuchsia-50';
    calloutTextColour = 'text-fuchsia-700';
  }
    break;
  case 'settings': {
    calloutIcon = <IconSettings className='h-5 w-5 fill-indigo-600'/>;
    calloutBackgroundColor = 'bg-indigo-50';
    calloutTextColour = 'text-indigo-700';
  }
    break;
  case 'secure':
    {
      calloutIcon = <IconSecure className='h-5 w-5 fill-gray-800'/>;
      calloutBackgroundColor = 'bg-gray-100';
      calloutTextColour = 'text-gray-700';
    }
    break;
  default: return null;
  }

  return (
    <div className={ ` p-4 ${calloutBackgroundColor}` }>
      <div className='flex items-center'>
        <div className='flex-shrink-0'>{calloutIcon}</div>
        <div className='ml-3'>
          <div className={ `mt-2 text-sm ${calloutTextColour}` }>
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callout;

