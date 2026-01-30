'use client';

import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { MdContentCopy } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        relative p-2 rounded-lg transition-all duration-300 
        ${copied 
          ? 'bg-green-50' 
          : 'bg-gray-50 hover:bg-blue-50 hover:scale-110'
        }
        active:scale-95 shadow-sm hover:shadow-md
      `}
      title={copied ? "Copied!" : label}
    >
      {copied ? (
        <FiCheck className="w-3.5 h-3.5 text-green-600 animate-in zoom-in duration-200" />
      ) : (
        <MdContentCopy className="w-3.5 h-3.5 text-gray-400 hover:text-blue-600 transition-colors duration-300" />
      )}
    </button>
  );
}