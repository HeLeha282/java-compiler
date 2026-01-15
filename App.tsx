import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { PlayIcon, BugIcon, StopIcon, ShareIcon, SaveIcon } from './components/Icons';
import { Status } from './types';
import { analyzeCode } from './services/geminiService';

const DEFAULT_CODE = `/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/

// Объясни, что делает этот код и как его можно оптимизировать?

public class Main
{
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}
`;

const App: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [output, setOutput] = useState<string>('');
  
  const handleRun = async () => {
    setStatus(Status.LOADING);
    setOutput('');

    try {
      // Simulate Running
      const result = await analyzeCode(code, 'run');
      setOutput(result);
      setStatus(Status.SUCCESS);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      setStatus(Status.ERROR);
    }
  };

  const handleDebugClick = async () => {
    setStatus(Status.LOADING);
    setOutput('Scanning code for debug instructions (lines starting with //)...');

    // Find the first line that looks like a single-line comment
    const lines = code.split('\n');
    const commentLine = lines.find(line => line.trim().startsWith('//'));

    if (!commentLine) {
        setStatus(Status.ERROR);
        setOutput('Debug Error: No debug instruction found.\n\nPlease add a comment line starting with "//" inside your code to tell the debugger what to do.\nExample: // Find the syntax error');
        return;
    }

    const query = commentLine.trim().replace(/^\/\/\s*/, ''); // Remove // and leading space

    setOutput(`> Debugger attached.\n> Instruction: "${query}"\n> Analyzing...`);

    try {
        const result = await analyzeCode(code, 'debug', query);
        setOutput(result);
        setStatus(Status.SUCCESS);
    } catch (error: any) {
        setOutput(`Debug Error: ${error.message}`);
        setStatus(Status.ERROR);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Navbar / Header */}
      <div className="h-14 bg-[#333] text-white flex items-center justify-between px-4 shadow-md z-20">
        <div className="flex items-center space-x-2">
            <div className="bg-orange-500 text-white font-bold p-1 rounded text-xs">GDB</div>
            <span className="font-semibold text-lg tracking-tight">Online Java Compiler</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
           <button 
             onClick={handleRun}
             disabled={status === Status.LOADING}
             className="flex items-center px-4 py-1.5 bg-[#4caf50] hover:bg-[#43a047] text-white rounded text-sm font-medium transition-colors mx-1"
           >
             <span className="mr-1.5"><PlayIcon /></span> Run
           </button>

           <button 
                onClick={handleDebugClick}
                disabled={status === Status.LOADING}
                className="flex items-center px-4 py-1.5 bg-[#f44336] hover:bg-[#e53935] text-white rounded text-sm font-medium transition-colors mx-1"
                title="Executes debug instruction found in // comments"
            >
                <span className="mr-1.5"><BugIcon /></span> Debug
            </button>
                
           <button className="flex items-center px-4 py-1.5 bg-[#ff9800] hover:bg-[#fb8c00] text-white rounded text-sm font-medium transition-colors mx-1">
             <span className="mr-1.5"><StopIcon /></span> Stop
           </button>
           
           <button className="flex items-center px-3 py-1.5 bg-transparent hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors mx-1 border border-gray-600">
             <span className="mr-1.5"><ShareIcon /></span> Share
           </button>
           
           <button className="flex items-center px-3 py-1.5 bg-transparent hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors mx-1 border border-gray-600">
             <span className="mr-1.5"><SaveIcon /></span> Save
           </button>
        </div>

        <div className="flex items-center">
            <span className="text-gray-400 text-xs mr-2">Language:</span>
            <select className="bg-[#444] text-white border border-gray-600 rounded px-2 py-1 text-sm outline-none">
                <option>Java (OpenJDK 17.0.1)</option>
            </select>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Editor Area */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* Main Editor Tabs */}
          <div className="flex bg-[#e0e0e0] border-b border-gray-300">
             <div className="px-4 py-1.5 bg-white border-t-2 border-orange-500 text-sm font-medium text-gray-700 flex items-center border-r border-gray-300">
                Main.java
             </div>
             <button 
                className="px-3 py-1.5 text-lg font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-300"
                title="New File"
             >
                +
             </button>
          </div>

          {/* Split View: Editor (Top) & Terminal (Bottom) */}
          <div className="flex-1 flex flex-col h-full relative">
            
            {/* Top Half: Code Editor */}
            <div className="flex-1 h-3/5 min-h-[200px] border-b border-gray-400">
                <Editor value={code} onChange={setCode} />
            </div>

            {/* Bottom Half: Terminal */}
            <div className="h-2/5 min-h-[150px] bg-black">
              <Terminal output={output} status={status} />
            </div>
          </div>

        </div>
        
        {/* Right Ad Space Placeholder (for authenticity) */}
        <div className="hidden lg:block w-40 bg-[#f0f0f0] border-l border-gray-300 p-4 text-center">
            <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                Ads by Google
            </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-[#e0e0e0] border-t border-gray-300 py-1 px-4 text-[11px] text-gray-600 flex justify-between">
          <div>© 2016 - 2025 GDB Online</div>
          <div>
              <span className="mr-4 hover:underline cursor-pointer">About</span>
              <span className="mr-4 hover:underline cursor-pointer">FAQ</span>
              <span className="mr-4 hover:underline cursor-pointer">Tutorials</span>
              <span className="hover:underline cursor-pointer">Contact</span>
          </div>
      </div>
    </div>
  );
};

export default App;
