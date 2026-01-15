import React, { useEffect, useRef } from 'react';
import { Status } from '../types';

interface TerminalProps {
  output: string;
  status: Status;
}

export const Terminal: React.FC<TerminalProps> = ({ output, status }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, status]);

  return (
    <div className="h-full bg-black text-white font-mono text-sm flex flex-col">
      <div className="flex items-center px-4 py-1 bg-[#f0f0f0] border-t border-b border-gray-300 select-none">
        <span className="text-gray-700 font-bold text-xs uppercase mr-4 border-b-2 border-orange-500 pb-0.5">Input</span>
        <span className="text-gray-500 font-bold text-xs uppercase mr-4 hover:text-gray-700 cursor-pointer">Output</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
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
      </div>
    </div>
  );
};