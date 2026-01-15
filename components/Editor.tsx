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
    <div className="relative flex flex-1 h-full bg-[#0f172a] font-mono text-sm overflow-hidden">
      {/* Line Numbers */}
      <div 
        id="line-numbers"
        className="w-12 pt-4 bg-[#0f172a] text-right text-gray-600 border-r border-[#334155] select-none overflow-hidden"
        style={{ lineHeight: '1.5rem', fontFamily: 'Fira Code, monospace' }}
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="pr-3">{i + 1}</div>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="flex-1 bg-[#0f172a] text-gray-300 p-0 pt-4 pl-4 border-none outline-none resize-none whitespace-pre"
        spellCheck={false}
        style={{ 
            lineHeight: '1.5rem', 
            fontFamily: 'Fira Code, monospace',
            tabSize: 2 
        }}
        placeholder="// Напишите ваш вопрос или код здесь...
// Скриншот из 'Проводника' будет проанализирован вместе с этим текстом."
      />
    </div>
  );
};