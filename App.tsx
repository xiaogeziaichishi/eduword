import React, { useState, useEffect } from 'react';
import { INITIAL_WORDS } from './constants';
import { WordData, Theme } from './types';
import WordList from './components/WordList';
import MainStage from './components/MainStage';
import { fetchWordDefinition, loadLocalDictionary, checkAudioAvailability } from './services/api';
import { Search, Moon, Sun, BookOpen, List, History, Home } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [candidateWords, setCandidateWords] = useState<string[]>(INITIAL_WORDS);
  const [historyWords, setHistoryWords] = useState<WordData[]>([]);
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [initialList, setInitialList] = useState<string[]>(INITIAL_WORDS);
  
  // Mobile Tab State: 'candidates' | 'main' | 'history'
  const [activeMobileTab, setActiveMobileTab] = useState<'candidates' | 'main' | 'history'>('candidates');

  // Initialize Theme
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(Theme.DARK);
    }
  }, []);

  useEffect(() => {
    // Load local dictionary for candidate list
    loadLocalDictionary().then(dict => {
      if (dict.words.length > 0) {
        setInitialList(dict.words);
        setCandidateWords(dict.words);
      }
    }).catch(err => {
      console.error("Failed to load local word list:", err);
    });
  }, []);

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => setTheme(newTheme);

  // Core Logic: Load Word Details and Move to History
  const loadWord = async (word: string) => {
    const targetWord = word.trim();
    if (!targetWord) return;

    // Switch to main view immediately on mobile
    setActiveMobileTab('main');

    // Check if already selected to avoid redundant processing if it's the exact same state
    if (currentWord?.word.toLowerCase() === targetWord.toLowerCase()) return;

    setIsLoading(true);
    setNotFound(false);
    setSearchText(targetWord);
    
    // Check if it's in history first (just display it, don't move it)
    const existingInHistory = historyWords.find(w => w.word.toLowerCase() === targetWord.toLowerCase());
    if (existingInHistory) {
      setCurrentWord(existingInHistory);
      setIsLoading(false);
      return;
    }

    // It's a new load. Fetch data.
    const [result, audioAvailable] = await Promise.all([
      fetchWordDefinition(targetWord),
      checkAudioAvailability(targetWord)
    ]);
    
    let newWordData: WordData;

    if (result.found && result.data) {
      newWordData = {
        word: targetWord,
        definition: result.data.definition,
        phonetic: result.data.phonetic,
        example: result.data.example,
        timestamp: Date.now(),
        data: result.data
      };
    } else {
      // 未找到翻译，仍然显示单词
      newWordData = {
        word: targetWord,
        timestamp: Date.now()
      };
    }

    // 标记是否有可用读音
    setNotFound(!audioAvailable);

    // Success: Update State
    setCurrentWord(newWordData);

    // Remove from Candidates if present
    setCandidateWords(prev => prev.filter(w => w.toLowerCase() !== targetWord.toLowerCase()));

    // Add to History (prevent duplicates)
    setHistoryWords(prev => {
        const filtered = prev.filter(w => w.word.toLowerCase() !== targetWord.toLowerCase());
        return [newWordData, ...filtered];
    });
    
    setIsLoading(false);
  };

  const handleNextWord = () => {
    if (candidateWords.length > 0) {
      loadWord(candidateWords[0]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      loadWord(searchText.trim());
    }
  };

  const handleReset = () => {
    // Restore all words to candidates
    setCandidateWords(initialList);
    setHistoryWords([]);
    setCurrentWord(null);
    setSearchText('');
    setNotFound(false);
    setActiveMobileTab('candidates');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900">
      
      {/* Top Navigation Bar */}
      <header className="h-16 flex-none bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between shadow-sm z-20 relative">
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg text-white">
             <BookOpen size={20} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 hidden sm:block">Edu工具</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          
          {/* Theme Toggles - Compact on Mobile */}
          <button 
            onClick={() => toggleTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 md:hidden"
          >
            {theme === Theme.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="hidden md:flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg shrink-0">
            <button 
              onClick={() => toggleTheme(Theme.LIGHT)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${theme === Theme.LIGHT ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <Sun size={14} /> 浅色
            </button>
            <button 
               onClick={() => toggleTheme(Theme.DARK)}
               className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${theme === Theme.DARK ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <Moon size={14} /> 深色
            </button>
          </div>

          {/* Search Bar - Flexible width */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-[200px] md:max-w-xs transition-all">
            <div className="relative group w-full">
              <input 
                type="text" 
                placeholder="搜词..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-3 md:pl-4 pr-8 md:pr-10 py-1.5 md:py-2 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <Search className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 pointer-events-none w-4 h-4 md:w-5 md:h-5" />
            </div>
            <button 
              type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              搜
            </button>
          </form>

        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full max-w-[1600px] mx-auto md:p-6 md:grid md:grid-cols-12 md:gap-6">
          
          {/* Mobile View: Render based on active tab */}
          <div className="md:hidden h-full pb-16"> 
            {activeMobileTab === 'candidates' && (
              <div className="h-full p-4">
                 <WordList 
                  title="待选单词" 
                  count={candidateWords.length} 
                  words={candidateWords}
                  onSelect={loadWord}
                  selectedWord={currentWord?.word}
                />
              </div>
            )}
            
            {activeMobileTab === 'main' && (
              <div className="h-full p-4">
                <MainStage 
                  currentWord={currentWord}
                  isLoading={isLoading}
                  notFound={notFound}
                  onNextWord={handleNextWord}
                  onReset={handleReset}
                  hasCandidates={candidateWords.length > 0}
                />
              </div>
            )}

            {activeMobileTab === 'history' && (
              <div className="h-full p-4">
                <WordList 
                  title="已选单词" 
                  count={historyWords.length} 
                  words={historyWords}
                  onSelect={loadWord}
                  selectedWord={currentWord?.word}
                  isHistory
                />
              </div>
            )}
          </div>

          {/* Desktop View: 3-Column Layout */}
          <div className="hidden md:block col-span-3 lg:col-span-2 h-full min-w-[200px]">
            <WordList 
              title="待选" 
              count={candidateWords.length} 
              words={candidateWords}
              onSelect={loadWord}
              selectedWord={currentWord?.word}
            />
          </div>

          <div className="hidden md:block col-span-6 lg:col-span-8 h-full">
            <MainStage 
              currentWord={currentWord}
              isLoading={isLoading}
              notFound={notFound}
              onNextWord={handleNextWord}
              onReset={handleReset}
              hasCandidates={candidateWords.length > 0}
            />
          </div>

          <div className="hidden md:block col-span-3 lg:col-span-2 h-full min-w-[200px]">
            <WordList 
              title="已选" 
              count={historyWords.length} 
              words={historyWords}
              onSelect={loadWord}
              selectedWord={currentWord?.word}
              isHistory
            />
          </div>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 h-16 flex items-center justify-around z-50 pb-safe">
        <button 
          onClick={() => setActiveMobileTab('candidates')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeMobileTab === 'candidates' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <List size={24} />
          <span className="text-xs font-medium">列表 ({candidateWords.length})</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('main')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeMobileTab === 'main' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className={`p-1 rounded-full ${activeMobileTab === 'main' ? 'bg-indigo-50 dark:bg-slate-700' : ''}`}>
             <Home size={24} />
          </div>
          <span className="text-xs font-medium">学习</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('history')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeMobileTab === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <History size={24} />
          <span className="text-xs font-medium">历史 ({historyWords.length})</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
