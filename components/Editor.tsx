import React, { useState, useRef, useEffect } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    const lineNumElem = document.getElementById('line-numbers');
    if (textareaRef.current && lineNumElem) {
      lineNumElem.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(Math.max(lines, 1));
  }, [value]);

  return (
    <div className="relative flex flex-1 h-full bg-[#fffffe] font-mono text-sm overflow-hidden text-black">
      {/* Line Numbers */}
      <div 
        id="line-numbers"
        className="w-10 pt-4 bg-[#f0f0f0] text-right text-gray-400 border-r border-gray-300 select-none overflow-hidden"
        style={{ lineHeight: '1.5rem', fontFamily: 'Fira Code, monospace' }}
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="pr-2">{i + 1}</div>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="flex-1 bg-white text-[#2b2b2b] p-0 pt-4 pl-4 border-none outline-none resize-none whitespace-pre selection:bg-blue-100"
        spellCheck={false}
        style={{ 
            lineHeight: '1.5rem', 
            fontFamily: 'Fira Code, monospace',
            tabSize: 4 
        }}
      />
    </div>
  );
};