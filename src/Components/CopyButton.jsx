import React from 'react'

function CopyButton({ content = '' }) {

  return (
    <button
        onClick={() => {navigator.clipboard.writeText(content)}}
        className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-green-600 rounded-md'
    >
        Copy to clipboard
    </button>
  )
}

export default CopyButton