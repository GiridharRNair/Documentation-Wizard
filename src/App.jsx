import DocsGen from './DocsGen';
import ParticlesComponent from './Components/Particles';

function App() {
  return (
    <div className='font-mono overflow-y-scroll no-scrollbar flex-col w-screen h-screen py-3'>
      <p className=' text-white hover:text-green-600 text-xl font-bold text-center'>
        Documentation Wizard
      </p>
      <p className='text-xs mx-[15vw] hover:text-green-600 text-white text-center py-1'> 
        Note that lengthy code may take more time to generate documentation, so meaningful variable names are recommended. <br/> 
      </p>
      <p className='text-xs mx-[25vw] text-green-600 text-center py-1'>
        To get started, input the code you want documentation for in the code editor below.
      </p>
      <DocsGen />
      <div title="Go to site's Github" className='underline text-xs text-white hover:text-green-600 fixed bottom-2 right-2'>
        <a href="https://github.com/SyntaxWarrior30/Documentation-Generator" target="_blank" rel="noopener noreferrer">Github</a>
      </div>  
      <div className="fixed z-[-1] top-0 left-0 right-0 bottom-0 bg-neutral-900">
        <ParticlesComponent />
      </div> 
    </div>
  );
}


export default App;
