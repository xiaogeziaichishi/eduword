import React from 'react';
import { WordData } from '../types';
import { playAudio } from '../services/api';
import { Volume2, RefreshCw, ArrowRight, Loader2 } from 'lucide-react';

interface MainStageProps {
  currentWord: WordData | null;
  isLoading: boolean;
  notFound: boolean;
  onNextWord: () => void;
  onReset: () => void;
  hasCandidates: boolean;
}

const MainStage: React.FC<MainStageProps> = ({ 
  currentWord, 
  isLoading, 
  notFound, 
  onNextWord, 
  onReset,
  hasCandidates
}) => {

  if (!currentWord && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center text-slate-400 mb-8">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-3xl">👋</span>
            </div>
          </div>
          <p className="text-xl font-medium text-slate-600 dark:text-slate-300">准备好了吗？</p>
          <p className="mt-2">点击下方按钮开始学习</p>
        </div>
        
        {hasCandidates && (
          <button 
            onClick={onNextWord}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <ArrowRight size={20} />
            <span>开始学习 (下一个)</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center relative scroll-smooth">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-slate-400 animate-pulse">
            <Loader2 className="animate-spin" size={48} />
            <p>正在查询单词...</p>
          </div>
        ) : currentWord ? (
          <div className="w-full max-w-3xl flex flex-col items-center gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Word Header */}
            <div className="text-center w-full">
              <h1 className="text-6xl md:text-9xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight break-words">
                {currentWord.word}
              </h1>
            </div>

            {/* Definitions */}
            {(currentWord.data?.chineseDefinition || currentWord.definition || notFound) && (
              <div className="text-center space-y-4 max-w-2xl px-4">
                {currentWord.data?.chineseDefinition && (
                  <p className="text-2xl md:text-4xl text-indigo-600 dark:text-indigo-400 font-bold">{currentWord.data.chineseDefinition}</p>
                )}
                {currentWord.definition && (
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{currentWord.definition}</p>
                )}
                {notFound && (
                  <p className="text-base md:text-lg text-amber-600 dark:text-amber-400 font-medium">未找到读音</p>
                )}
              </div>
            )}

            {/* Example */}
            {currentWord.example && (
              <div className="bg-slate-50 dark:bg-slate-700/30 p-6 md:p-8 rounded-2xl text-center w-full max-w-2xl">
                <p className="italic text-slate-600 dark:text-slate-300 text-lg md:text-xl font-medium">"{currentWord.example}"</p>
              </div>
            )}
            
          </div>
        ) : null}
      </div>

      {/* Control Bar - Sticky Bottom */}
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 z-10">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
          
          {/* Audio Controls */}
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-sm border border-slate-200 dark:border-slate-600 w-full sm:w-auto justify-center">
            <button 
              onClick={() => currentWord && playAudio(currentWord.word, 1)}
              disabled={!currentWord || notFound}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <Volume2 size={20} />
              <span className="font-bold text-base md:text-lg">英音</span>
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-2"></div>
            <button 
              onClick={() => currentWord && playAudio(currentWord.word, 2)}
              disabled={!currentWord || notFound}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <Volume2 size={20} />
              <span className="font-bold text-base md:text-lg">美音</span>
            </button>
          </div>

          <div className="w-px h-10 bg-slate-300 dark:bg-slate-600 hidden md:block mx-2"></div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onNextWord}
              disabled={!hasCandidates || isLoading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg font-bold"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
              <span>{isLoading ? '加载中...' : '下一个'}</span>
            </button>

            <button 
              onClick={onReset}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-6 md:py-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-red-300 hover:text-red-600 hover:shadow-md transition-all shadow-sm text-base md:text-lg font-medium"
            >
              <RefreshCw size={20} />
              <span>重置</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainStage;
