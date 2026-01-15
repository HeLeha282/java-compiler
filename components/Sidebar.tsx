import React from 'react';
import { FolderIcon, FileJavaIcon, SettingsIcon } from './Icons';

interface SidebarProps {
  // Props simplified as we don't need file uploading anymore
}

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="w-56 bg-[#f7f7f7] border-r border-gray-300 flex flex-col h-full select-none text-[#333]">
      <div className="p-3 font-semibold text-sm border-b border-gray-200 bg-[#e0e0e0] flex justify-between items-center">
        <span>Project</span>
        <SettingsIcon />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 bg-white">
        <div className="flex items-center p-1 cursor-pointer hover:bg-gray-100 rounded">
            <span className="mr-2"><FolderIcon /></span>
            <span className="text-sm font-medium">Online Java Compiler</span>
        </div>
        <div className="ml-4 flex flex-col mt-1">
             <div className="flex items-center p-1 bg-[#e8f0fe] text-blue-600 rounded cursor-pointer border-l-2 border-blue-600">
                <span className="mr-2"><FileJavaIcon /></span>
                <span className="text-sm">Main.java</span>
             </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-[#f7f7f7] text-xs text-gray-500 text-center">
          <button className="bg-orange-500 text-white px-4 py-2 rounded font-bold hover:bg-orange-600 w-full mb-2">
              New Project
          </button>
      </div>
    </div>
  );
};