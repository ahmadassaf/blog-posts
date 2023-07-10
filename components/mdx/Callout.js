/* eslint-disable no-lone-blocks */
const Callout = ({ text, type }) => {
  let calloutBackgroundColor;
  let calloutIcon;
  let calloutTextColour;

  switch (type) {
  case 'warning':
    {
      calloutIcon = (
        <svg
          className='h-5 w-5 text-yellow-400'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z'
            clipRule='evenodd'
          />
        </svg>
      );
      calloutBackgroundColor = 'bg-yellow-50';
      calloutTextColour = 'text-yellow-700';
    }
    break;
  case 'info':
    {
      calloutIcon = (
        <svg
          className='h-5 w-5 text-blue-400'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M19 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0zM8.25 9.75A.75.75 0 019 9h.253a1.75 1.75 0 011.709 2.13l-.46 2.066a.25.25 0 00.245.304H11a.75.75 0 010 1.5h-.253a1.75 1.75 0 01-1.709-2.13l.46-2.066a.25.25 0 00-.245-.304H9a.75.75 0 01-.75-.75zM10 7a1 1 0 100-2 1 1 0 000 2z'
            clipRule='evenodd'
          />
        </svg>
      );
      calloutBackgroundColor = 'bg-blue-50';
      calloutTextColour = 'text-blue-700';
    }
    break;
  case 'success':
    {
      calloutIcon = (
        <svg
          className='h-5 w-5 text-green-400'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
            clipRule='evenodd'
          />
        </svg>
      );
      calloutBackgroundColor = 'bg-green-50';
      calloutTextColour = 'text-green-700';
    }
    break;
  case 'error': {
    calloutIcon = (
      <svg
        className='h-5 w-5 text-red-400'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        aria-hidden='true'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
          clipRule='evenodd'
        />
      </svg>
    );
    calloutBackgroundColor = 'bg-red-50';
    calloutTextColour = 'text-red-700';
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
