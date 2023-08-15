/* eslint-disable no-lone-blocks */

import { IoDisc, IoLogoIonic, IoMedicalSharp, IoSettings, IoShieldHalfOutline, IoSpeedometerSharp, IoWarningSharp } from 'react-icons/io5';

const Callout = ({ text, type }) => {
  let calloutBackgroundColor;
  let calloutIcon;
  let calloutTextColour;

  switch (type) {
  case 'warning':
    {
      calloutIcon = <IoWarningSharp className='h-5 w-5 fill-yellow-400'/>;
      calloutBackgroundColor = 'bg-yellow-50';
      calloutTextColour = 'text-yellow-700';
    }
    break;
  case 'info':
    {
      calloutIcon = <IoLogoIonic className='h-5 w-5 fill-blue-600'/>;
      calloutBackgroundColor = 'bg-blue-50';
      calloutTextColour = 'text-blue-700';
    }
    break;
  case 'success':
    {
      calloutIcon = <IoDisc className='h-5 w-5 fill-green-600'/>;
      calloutBackgroundColor = 'bg-green-50';
      calloutTextColour = 'text-green-700';
    }
    break;
  case 'error': {
    calloutIcon = <IoMedicalSharp className='h-5 w-5 fill-red-600'/>;
    calloutBackgroundColor = 'bg-red-50';
    calloutTextColour = 'text-red-700';
  }
    break;
  case 'optimize': {
    calloutIcon = <IoSpeedometerSharp className='h-5 w-5 fill-fuchsia-600'/>;
    calloutBackgroundColor = 'bg-fuchsia-50';
    calloutTextColour = 'text-fuchsia-700';
  }
    break;
  case 'settings': {
    calloutIcon = <IoSettings className='h-5 w-5 fill-indigo-600'/>;
    calloutBackgroundColor = 'bg-indigo-50';
    calloutTextColour = 'text-indigo-700';
  }
    break;
  case 'secure':
    {
      calloutIcon = <IoShieldHalfOutline className='h-5 w-5 fill-gray-800'/>;
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

