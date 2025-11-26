import React from 'react';
import { WordData } from '../types';
import { ChevronRight } from 'lucide-react';

interface WordListProps {
  title: string;
  words: (string | WordData)[];
  count: number;
  onSelect: (word: string) => void;
  selectedWord?: string;
  isHistory?: boolean; 
}

const WordList: React.FC<WordListProps> = ({ title, words, count, onSelect, selectedWord, isHistory = false }) => {
  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
          {title} <span className="text-sm font-normal text-slate-400">({count})</span>
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {words.length === 0 ? (
          <div className="text-center text-slate-400 py-10 text-sm">暂无记录</div>
        ) : (
          words.map((item, index) => {
            const wordText = typeof item === 'string' ? item : item.word;
            const isSelected = selectedWord === wordText;
            
            return (
              <button
                key={`${wordText}-${index}`}
                onClick={() => onSelect(wordText)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group
                  ${isSelected 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium shadow-sm' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-1.5 py-0.5 rounded border 
                    ${isSelected ? 'border-indigo-200 bg-indigo-100 dark:bg-indigo-900 dark:border-indigo-700' : 'border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800'}`}>
                    {wordText.slice(0, 2).toLowerCase()}
                  </span>
                  <span>{wordText}</span>
                </div>
                {isSelected && <ChevronRight size={16} />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WordList;
