import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Prism as PrismSyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import classNames from 'classnames';
import detectLang from 'lang-detector';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'


const currStatus = ['Generating', 'Generating.', 'Generating..', ' Generating...']
const langFileExt = [
  { name: 'javaScript', extension: '.js' },
  { name: 'c', extension: ".c" },
  { name: 'python', extension: '.py' },
  { name: 'java', extension: '.java' },
  { name: 'c++', extension: '.cpp' },
  { name: 'html', extension: '.html' },
  { name: 'css', extension: '.css' },
  { name: 'ruby', extension: '.ruby' },
  { name: 'go', extension: '.go' },
  { name: 'php', extension: '.php' }
]

function DocsGen () {

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const [value, setValue] = useState('Input your raw code here');
  const [response, setResponse] = useState('Your altered code will appear here');
  const [status, setStatus] = useState('Generate Documentation');
  const [loading, isLoading] = useState(false);
  const [language, setLanguage] = useState("Unknown");
  const [fileExtension, setFileExt] = useState("none");
  const abortController = useRef(null);

  let intervalId;
  var statusChange = 0;

  const API_KEY = import.meta.env.VITE_API_KEY;
  
  useEffect(() => {
    resetAbortController();
  }, []);

  const resetAbortController = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
  };

  function statusUpdate () {
    if (statusChange === 0) {
      setStatus(currStatus[0]);
      statusChange++;
    } else if (statusChange === 1) {
      statusChange++;
      setStatus(currStatus[1]);
    } else if (statusChange === 2) {
      statusChange++;
      setStatus(currStatus[2]);
    } else {
      statusChange = 0;
      setStatus(currStatus[3]);
    }
  }

  function startInterval () {
    isLoading(true);
    intervalId = setInterval(statusUpdate, 300);
  }

  function stopInterval () {
    isLoading(false);
    clearInterval(intervalId);
  }

  function handleEditorChange (newValue) {
    if (newValue.includes("Input your raw code here"))
      clearOnChange();
    getLanguage(newValue);
  }

  function getLanguage (value) {
    setLanguage(detectLang(value).toLowerCase());
    if (language !== "Unknown") {
      setFileExt(langFileExt.find(l => l.name === language).extension);
    }
  }

  function clearOnChange () {
    setValue('')
  }

  function resetButtonClick () {
    setResponse('Your altered code will appear here');
    setValue('Input your raw code here');
    setStatus('Generate Documentation'); 
    fileInputRef.current.value = null;   
  };

  const buttonClass = classNames(
    'bg-gray-500',
    'w-[100vh]',
    'text-center',
    'h-[5vh]',
    'hover:bg-green-600',
    'rounded-md',
    {
      'text-black': (status === 'Generate Documentation'),
      'text-red-600 duration-150 animate:shake': (status === 'Error, Try Again'),
      'disabled' : (loading)
    }
  )

  function isStringEmptyOrSpaces(str) {
    return str.trim() === '';
  }

  function handleSend (textIn) {
    if (textIn !== "//Input your raw code here" && !(isStringEmptyOrSpaces(textIn))) {
      startInterval();
      fetch(`https://api.openai.com/v1/chat/completions`,
      {
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            {role: "system", 
            content: "Properly format and add documentation to this code (keep code under column 100): \n" + textIn}
          ],
        }), 
        method: "POST",
        headers: {
          "content-type": "application/json",
        Authorization: "Bearer " + API_KEY,
        },
        signal: abortController.current.signal,
      })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data.choices[0].message.content);
        console.log(ddata.choices[0].message.content);
      })
      .catch(error => {
        if (error.name === "AbortError") 
          console.log("Fetch aborted");
      })
      .finally(() => {
        stopInterval();
        setStatus('Generate Documentation');
      })
    }
  }

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  function getEditorValue() {
    const inputCode = editorRef.current.getValue();
    handleSend(inputCode);
  }

  const handleAbort = () => {
    if (abortController.current) {
      abortController.current.abort();
      resetAbortController();
    }
  };

  const handleDownload = () => {
    const fileName = window.prompt('Enter file name:');
    if (fileName !== null && fileName !== '') {
      const element = document.createElement('a');
      const file = new Blob([response], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = fileName + fileExtension;
      document.body.appendChild(element);
      element.click();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setValue(event.target.result);
      setResponse("Your altered code will appear here");
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-col w-[100vh] h-[30vh] mx-auto space-y-2">   
      <p className='py-2 text-xs hover:text-green-600 text-white text-center'>
        Programming Language Detected: {language}
      </p>
      <Tooltip
        title="Can't upload files during generation"
        disabled={!loading}
        duration={200}
      >
        <input
          className="m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-green-600 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-gray-500 dark:file:text-neutral-100 dark:focus:border-primary"
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
          ref={fileInputRef}
          onMouseOver={() => setIsDisabled(true)}
          onMouseLeave={() => setIsDisabled(false)}
        />    
      </Tooltip>
      <Editor
        theme='vs-dark'
        language={language}
        onMount={handleEditorDidMount}
        value={value}
        onChange={handleEditorChange}
        className='h-[30vh] rounded-md'
        options={{domReadOnly: loading, readOnly: loading,}}
      />
      <button 
        onClick={() => getEditorValue()}
        className={buttonClass}
        disabled={loading}
      >
        {status}
      </button>
      <PrismSyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="h-[30vh] overflow-y-scroll no-scrollbar rounded-md"
      >
        {response}
      </PrismSyntaxHighlighter>
      <div className='flex-row space-x-2'>
        {(!loading && value !== "Input your raw code here") ? (
          <button
            onClick={resetButtonClick}
            className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-green-600 rounded-md'
          >
            Reset
          </button>
        ) : null}
        {(response !== "Your altered code will appear here" && !loading) ? (
          <button
            onClick={() => {navigator.clipboard.writeText(response)}}
            className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-green-600 rounded-md'
          >
            Copy to clipboard
          </button>
        ) : null}
        {(response !== "Your altered code will appear here" && !loading) ? (
          <button
            onClick={handleDownload}
            className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-green-600 rounded-md'
          >
            Download
          </button>
        ) : null}
        {loading ? (
          <button
            className='text-xs bg-gray-500 w-[20vh] h-[4vh] hover:bg-red-600 rounded-md'
            onClick={handleAbort}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  )
};
  
export default DocsGen;
  