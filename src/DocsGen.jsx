import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import classNames from 'classnames';

const currStatus = ['Generating', 'Generating.', 'Generating..', ' Generating...']

function DocsGen () {

  const editorRef = useRef(null);
  const [value, setValue] = useState('//Input your raw Java code here');
  const [response, setResponse] = useState('//Your altered Java code will appear here');
  const [status, setStatus] = useState('Generate Documentation');
  const [loading, isLoading] = useState(false)
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

  function clearOnChange () {
    setValue('')
  }

  function resetButtonClick () {
    setResponse('//Your altered Java code will appear here');
    setValue('//Input your raw code here');
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
      'text-red-600': (status === 'Error, Try Again'),
      'disabled' : (loading)
    }
  )

  function isStringEmptyOrSpaces(str) {
    return str.trim() === '';
  }

  function handleSend (textIn) {
    if (textIn !== "//Input your raw code here" && !(isStringEmptyOrSpaces(textIn))) {
      console.log(textIn)
      startInterval();
      fetch(`https://api.openai.com/v1/chat/completions`,
      {
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            {role: "system", 
            content: "Properly format and add documentation to this Java code (keep code under column 100): \n" + textIn}
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const ast = javaParser.parse(contents);
      setValue(renderAst(ast));
    };

    reader.readAsText(file);
  };
  
  return (
    <div className="flex-col font-mono w-[100vh] h-[30vh] mx-auto space-y-2">   
      <Editor
        theme='vs-dark'
        defaultLanguage="java"
        onMount={handleEditorDidMount}
        value={value}
        onChange={clearOnChange}
        className='h-[30vh] rounded-md'
      />
      <button 
        onClick={() => getEditorValue()}
        className={buttonClass}
        disabled={loading}
      >
        {status}
      </button>
      <SyntaxHighlighter
        language="java"
        style={vscDarkPlus}
        className="h-[30vh] overflow-y-scroll no-scrollbar rounded-md"
      >
        {response}
      </SyntaxHighlighter>
      <div className='flex-row space-x-2'>
        {response !== "//Your altered Java code will appear here" ? (
          <button
            onClick={resetButtonClick}
            className='text-xs bg-gray-500 w-[17vh] text-center h-[4vh] hover:bg-green-600 rounded-md'
          >
            Reset
          </button>
        ) : null}
        {response !== "//Your altered Java code will appear here" ? (
          <button
            onClick={() => {navigator.clipboard.writeText(response)}}
            className='text-xs bg-gray-500 w-[20vh] text-center h-[4vh] hover:bg-green-600 rounded-md'
          >
            Copy to clipboard
          </button>
        ) : null}
      </div>
    </div>
  )
};
  
export default DocsGen;
  