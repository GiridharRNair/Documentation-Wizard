import React, { useState } from 'react';

function CopyButton({ content = '', response = '', loading = '' }) {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <>
      {(response !== "Your altered code will appear here" && response !== "Abort Success" && !loading) ? (
        <>
          <button
            title='Copy to clipboard'
            onClick={onClick}
            className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-green-600 rounded-md'
          >
            {isCopied ? "Copied" : "Copy"}
          </button>
        </>
      ) : null}
    </>
  )
}

export default CopyButton