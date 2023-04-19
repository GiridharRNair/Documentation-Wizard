import React, { useState } from 'react'

function DownloadButton({ content = '', fileType = '' }) {
  
    async function handleDownload () {
        const fileName = window.prompt('Enter file name:');
        if (fileName !== null && fileName !== '') {
            const element = document.createElement('a');
            const file = new Blob([content], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = fileName + fileType;
            document.body.appendChild(element);
            element.click();
        }
    };    
  
    return (
        <button
            onClick={handleDownload}
            className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-green-600 rounded-md'
        >
            Download
        </button>
    )
}

export default DownloadButton
  
