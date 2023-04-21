import React, { useEffect, useState } from 'react';

function CopyButton({ content = '', response = '', loading = '' }) {
  const [showToast, setShowToast] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(content);
    setShowToast(true);
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 1500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showToast]);

  return (
    <>
      {(response !== "Your altered code will appear here" && !loading) ? (
        <>
          <button
            onClick={onClick}
            className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-green-600 rounded-md'
          >
            Copy to clipboard
          </button>
          {showToast &&
            <div 
              className={`bg-green-600 text-white px-4 py-2 rounded-md absolute top-0 right-2 mt-2 mr-2`}
            >
              Copied to clipboard
            </div>
          }
        </>
      ) : null}
    </>
  )
}

export default CopyButton