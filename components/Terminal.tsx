import React, { useEffect, useRef } from 'react';
import { Status } from '../types';
import ReactMarkdown from 'react-markdown';

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
    <div className="h-full bg-[#020617] text-gray-300 font-mono text-sm flex flex-col border-t border-[#334155]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b] border-b border-[#334155] select-none">
        <div className="flex space-x-4">
            <span className="text-white border-b-2 border-blue-500 pb-2 -mb-2.5">ТЕРМИНАЛ</span>
            <span className="text-gray-500 hover:text-gray-300 cursor-not-allowed">ПРОБЛЕМЫ</span>
            <span className="text-gray-500 hover:text-gray-300 cursor-not-allowed">ВЫВОД</span>
            <span className="text-gray-500 hover:text-gray-300 cursor-not-allowed">КОНСОЛЬ ОТЛАДКИ</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-gray-500 mb-2">Microsoft Windows [Version 10.0.19045.3693]<br/>(c) Microsoft Corporation. All rights reserved.</div>
        
        <div className="flex">
          <span className="text-green-500 mr-2">➜</span>
          <span className="text-blue-400">~/project</span>
          <span className="text-gray-400 ml-2">node index.js</span>
        </div>

        {status === Status.LOADING && (
          <div className="text-yellow-400 animate-pulse">
            > Анализ скриншота и компиляция ответа...
          </div>
        )}
        
        {output && (
             <div className="mt-2 prose prose-invert prose-sm max-w-none text-gray-300">
                <ReactMarkdown
                     components={{
                        code({className, children, ...props}) {
                            return (
                                <code className={`${className} bg-gray-800 rounded px-1 py-0.5 text-blue-300`} {...props}>
                                    {children}
                                </code>
                            )
                        },
                        pre({children}) {
                             return <pre className="bg-[#1e1e1e] p-3 rounded-md overflow-x-auto border border-gray-700 my-2">{children}</pre>
                        }
                    }}
                >
                    {output}
                </ReactMarkdown>
             </div>
        )}

        {status === Status.ERROR && (
          <div className="text-red-500 mt-2">
            Error: Process exited with code 1
          </div>
        )}
        
        {status === Status.SUCCESS && (
             <div className="text-green-500 mt-4">
                > Готово в {(Math.random() * 2 + 0.5).toFixed(2)}s.
             </div>
        )}

        <div className="flex items-center mt-2">
            <span className="text-green-500 mr-2">➜</span>
            <span className="text-blue-400">~/project</span>
            <span className="w-2 h-4 bg-gray-400 ml-2 animate-pulse block"></span>
        </div>
        
        <div ref={bottomRef} />
      </div>
    </div>
  );
};