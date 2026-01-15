import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { PlayIcon, TerminalIcon } from './components/Icons';
import { Status, FileData } from './types';
import { analyzeImageWithPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [output, setOutput] = useState<string>('');
  
  const handleRun = async () => {
    if (!selectedFile) {
        setOutput("ОШИБКА: Нет входного файла. Пожалуйста, загрузите скриншот в панели 'Проводник'.");
        setStatus(Status.ERROR);
        return;
    }

    if (!code.trim()) {
        setOutput("ПРЕДУПРЕЖДЕНИЕ: Текстовый запрос пуст. Нейросеть попытается описать изображение.");
    }

    setStatus(Status.LOADING);
    setOutput(''); // Clear previous output

    try {
      const result = await analyzeImageWithPrompt(
          code.trim() || "Проанализируй это изображение.", 
          selectedFile.base64, 
          selectedFile.mimeType
      );
      setOutput(result);
      setStatus(Status.SUCCESS);
    } catch (error: any) {
      setOutput(`ОШИБКА ВРЕМЕНИ ВЫПОЛНЕНИЯ: ${error.message}`);
      setStatus(Status.ERROR);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Top Bar (VS Code style) */}
      <div className="h-10 bg-[#1e293b] flex items-center justify-between px-4 border-b border-[#334155] select-none z-10">
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-gray-400 font-medium">NeuroCompiler IDE - Workspace</span>
        </div>
        
        <div className="flex items-center bg-[#0f172a] rounded-md border border-[#334155]">
           <button 
             onClick={handleRun}
             disabled={status === Status.LOADING}
             className={`flex items-center px-3 py-1 text-sm font-medium transition-colors ${
                 status === Status.LOADING 
                 ? 'text-gray-500 cursor-not-allowed' 
                 : 'text-green-400 hover:text-green-300 hover:bg-[#1e293b]'
             }`}
           >
             <span className="mr-2"><PlayIcon /></span>
             {status === Status.LOADING ? 'Компиляция...' : 'Запустить'}
           </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar selectedFile={selectedFile} onFileSelect={setSelectedFile} />

        {/* Editor Area */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* Editor Tabs */}
          <div className="flex bg-[#1e293b] border-b border-[#334155]">
             <div className="px-4 py-2 bg-[#0f172a] border-t-2 border-blue-500 text-sm text-gray-200 flex items-center border-r border-[#334155]">
                <span className="mr-2 text-yellow-400">JS</span>
                prompt.txt
             </div>
             {selectedFile && (
                 <div className="px-4 py-2 bg-[#1e293b] text-sm text-gray-400 flex items-center border-r border-[#334155] cursor-default opacity-70">
                    <span className="mr-2 text-blue-400">IMG</span>
                    {selectedFile.name}
                 </div>
             )}
          </div>

          {/* Split View: Editor (Top) & Terminal (Bottom) */}
          <div className="flex-1 flex flex-col h-full relative">
            
            {/* Top Half: Code Editor */}
            <div className="flex-1 h-1/2 min-h-[200px]">
                <Editor value={code} onChange={setCode} />
            </div>

            {/* Resizer Handle Visual (Non-functional for simplicity) */}
            <div className="h-1 bg-[#334155] cursor-row-resize hover:bg-blue-500 transition-colors"></div>

            {/* Bottom Half: Terminal */}
            <div className="h-1/2 min-h-[200px] bg-[#020617]">
              <Terminal output={output} status={status} />
            </div>
          </div>

        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-[#1e293b] border-t border-[#334155] flex items-center justify-between px-3 text-xs text-white select-none">
        <div className="flex items-center space-x-3">
            <div className="flex items-center text-blue-400 font-bold hover:bg-[#334155] px-1 rounded cursor-pointer">
                <span className="mr-1"><TerminalIcon /></span> master*
            </div>
            <div className="hover:bg-[#334155] px-1 rounded cursor-pointer">0 errors, 0 warnings</div>
        </div>
        <div className="flex items-center space-x-4">
             <div className="hover:bg-[#334155] px-1 rounded cursor-pointer">Ln {code.split('\n').length}, Col 1</div>
             <div className="hover:bg-[#334155] px-1 rounded cursor-pointer">UTF-8</div>
             <div className="hover:bg-[#334155] px-1 rounded cursor-pointer">Gemini-2.5-Flash</div>
             <div className="hover:bg-[#334155] px-1 rounded cursor-pointer text-blue-300">Prettier</div>
        </div>
      </div>
    </div>
  );
};

export default App;