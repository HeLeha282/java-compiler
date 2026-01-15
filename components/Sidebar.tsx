import React, { useRef } from 'react';
import { FileData } from '../types';
import { FileIcon, ImageIcon, UploadIcon, TrashIcon } from './Icons';

interface SidebarProps {
  selectedFile: FileData | null;
  onFileSelect: (file: FileData | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedFile, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Extract base64 part (remove data:image/png;base64,)
        const base64 = result.split(',')[1];
        
        onFileSelect({
          name: file.name,
          type: 'image',
          url: result,
          base64: base64,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input to allow selecting the same file again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col h-full select-none">
      <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
        <span>Проводник</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 pb-2">
          <div className="text-xs text-gray-500 mb-2 pl-2">Открытые редакторы</div>
          <div className="flex items-center px-2 py-1 text-sm text-blue-300 bg-[#2d3a4f] rounded cursor-pointer mb-1">
            <span className="mr-2"><FileIcon /></span>
            <span className="truncate">prompt.txt</span>
          </div>
        </div>

        <div className="px-2 mt-2">
           <div className="text-xs text-gray-500 mb-2 pl-2 flex justify-between items-center">
             <span>Ресурсы (Скриншот)</span>
             <button 
                onClick={handleTriggerUpload}
                className="text-gray-400 hover:text-white transition-colors"
                title="Загрузить изображение"
             >
                <UploadIcon />
             </button>
           </div>
           
           {!selectedFile ? (
             <div 
                onClick={handleTriggerUpload}
                className="border border-dashed border-gray-600 rounded p-4 m-2 text-center cursor-pointer hover:border-blue-500 hover:bg-[#2d3a4f] transition-all group"
             >
                <div className="flex justify-center text-gray-500 group-hover:text-blue-400 mb-2">
                    <ImageIcon />
                </div>
                <div className="text-xs text-gray-400">Нажмите для загрузки</div>
             </div>
           ) : (
             <div className="px-2 py-1 flex items-center justify-between group text-sm text-green-300 bg-[#2d3a4f]/50 rounded mb-1 border border-green-900/50">
                <div className="flex items-center overflow-hidden">
                    <span className="mr-2 flex-shrink-0"><ImageIcon /></span>
                    <span className="truncate" title={selectedFile.name}>{selectedFile.name}</span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect(null);
                    }}
                    className="ml-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <TrashIcon />
                </button>
             </div>
           )}
           
           {selectedFile && (
               <div className="m-2 rounded overflow-hidden border border-gray-700 bg-black">
                   <img src={selectedFile.url} alt="Preview" className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity" />
               </div>
           )}
        </div>
      </div>
      
      {/* Hidden Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};