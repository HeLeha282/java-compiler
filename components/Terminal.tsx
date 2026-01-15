import React, { useEffect, useRef, useState } from 'react';
import { Status } from '../types';

interface TerminalProps {
  output: string;
  status: Status;
}

export const Terminal: React.FC<TerminalProps> = ({ output, status }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  // Auto-switch to Input tab when compilation starts (simulating a crash/error view first)
  useEffect(() => {
    if (status === Status.LOADING) {
      setActiveTab('input');
    }
  }, [status]);

  useEffect(() => {
    if (activeTab === 'output' && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, status, activeTab]);

  return (
    <div className="h-full bg-black text-white font-mono text-sm flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center px-4 py-1 bg-[#f0f0f0] border-t border-b border-gray-300 select-none">
        <button 
          onClick={() => setActiveTab('input')}
          className={`font-bold text-xs uppercase mr-4 pb-0.5 outline-none transition-colors ${
            activeTab === 'input' 
              ? 'text-gray-700 border-b-2 border-orange-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Input
        </button>
        <button 
          onClick={() => setActiveTab('output')}
          className={`font-bold text-xs uppercase mr-4 pb-0.5 outline-none transition-colors ${
            activeTab === 'output' 
              ? 'text-gray-700 border-b-2 border-orange-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Output
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        
        {/* INPUT TAB - FAKE ERROR */}
        {activeTab === 'input' && (
           <div className="animate-pulse">
              <div className="text-gray-400 mb-1">$ javac Main.java</div>
              <div className="text-red-400">
                Main.java:14: error: ';' expected<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;System.out.println("Processing...")<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br/>
                1 error<br/>
                compiler exit status 1
              </div>
              <div className="text-gray-500 mt-4 italic border-t border-gray-800 pt-2">
                (System note: Check Output tab for execution details despite errors)
              </div>
           </div>
        )}

        {/* OUTPUT TAB - REAL AI RESULT */}
        {activeTab === 'output' && (
          <>
            {status === Status.LOADING && (
              <div className="text-gray-400">
                Compiling and running...
              </div>
            )}
            
            {output && (
                 <div>{output}</div>
            )}

            {status === Status.ERROR && (
              <div className="text-red-400 mt-2">
                Error: Compilation failed.
              </div>
            )}
            
            {status === Status.SUCCESS && (
                 <div className="text-orange-500 mt-2">
                    ...Program finished with exit code 0
                    <br/>
                    Press ENTER to exit console.
                 </div>
            )}
            
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};
