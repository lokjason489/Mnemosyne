import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Brain, ChevronDown, Eye, Globe, Grid3X3, Hash, Moon, Palette, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BallTest, MemoryGame, NumberTest, StoopTest } from '../../components';
import { AnimatedTabs, type TabItem } from '../../components/ui/AnimatedTabs';
import { cn } from '../../utils/cn';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Dark / Light Mode
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Active Game Tab (0: Number, 1: Ball, 2: Stoop, 3: MemoryGame)
  const [activeTab, setActiveTab] = useState(0);

  // Language Dropdown
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const languageList = useMemo(
    () => [
      { label: '繁體中文', value: 'tc', code: 'TC' },
      { label: '简体中文', value: 'sc', code: 'SC' },
      { label: 'English', value: 'en', code: 'EN' },
    ],
    []
  );

  const currentLangObj = useMemo(
    () => languageList.find((l) => l.value === i18n.language) || languageList[0],
    [i18n.language, languageList]
  );

  // Sync mode with html root class for Tailwind dark:
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  // Click outside listener for language menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  // MUI Theme to match modern palette
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#6366f1', // Indigo
          },
          secondary: {
            main: '#a855f7', // Purple
          },
          background: {
            default: mode === 'dark' ? '#0b0f19' : '#f8fafc',
            paper: mode === 'dark' ? '#131b2e' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
            secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
          },
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        },
        shape: {
          borderRadius: 16,
        },
      }),
    [mode]
  );

  // Tab Definitions
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: 0,
        label: t('Number_short'),
        icon: <Hash className="w-4 h-4 text-indigo-500" />,
      },
      {
        id: 1,
        label: t('Ball_short'),
        icon: <Eye className="w-4 h-4 text-emerald-500" />,
      },
      {
        id: 2,
        label: t('StoopTest_short'),
        icon: <Palette className="w-4 h-4 text-pink-500" />,
      },
      {
        id: 3,
        label: t('MemoryGame_short'),
        icon: <Grid3X3 className="w-4 h-4 text-amber-500" />,
      },
    ],
    [t]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div
        className={cn(
          'min-h-screen w-full flex flex-col font-sans transition-colors duration-300 relative',
          mode === 'dark' ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-100 text-slate-900'
        )}
      >
        {/* Ambient Glowing Background Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className={cn(
              'absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse-slow',
              mode === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'
            )}
          />
          <div
            className={cn(
              'absolute top-1/3 -right-40 w-md h-112 rounded-full blur-3xl opacity-25 animate-pulse-slow',
              mode === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
            )}
            style={{ animationDelay: '3s' }}
          />
          <div
            className={cn(
              'absolute -bottom-40 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse-slow',
              mode === 'dark' ? 'bg-emerald-600' : 'bg-teal-300'
            )}
            style={{ animationDelay: '6s' }}
          />
        </div>

        {/* Floating Modern Header */}
        <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3">
          <div
            className={cn(
              'max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-3xl',
              'border-2 border-slate-300/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/80',
              'backdrop-blur-xl shadow-md shadow-slate-200/60 dark:shadow-indigo-500/5'
            )}
          >
            {/* Branding Logo */}
            <div className="flex items-center gap-3 select-none">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
                <Brain className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Mnemosyne
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase">
                  Cognitive Lab
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="w-full md:w-auto flex justify-center">
              <AnimatedTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="w-full md:w-auto"
              />
            </div>

            {/* Actions: Language & Theme Toggle */}
            <div className="flex items-center gap-2">
              {/* Language Picker Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen((prev) => !prev)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border-2',
                    'bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700',
                    'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80',
                    'transition-all duration-200 outline-none cursor-pointer shadow-sm'
                  )}
                  aria-label="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline px-1 py-0.5 text-[9px] font-black rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {currentLangObj.code}
                  </span>
                  <span>{currentLangObj.label}</span>
                  <ChevronDown
                    className={cn(
                      'w-3 h-3 text-slate-500 transition-transform duration-200',
                      langOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        'absolute right-0 mt-2 w-36 rounded-2xl p-1.5 shadow-2xl border-2 z-50',
                        'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 backdrop-blur-xl'
                      )}
                    >
                      {languageList.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleLanguageSelect(item.value)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl',
                            'transition-colors duration-150 cursor-pointer',
                            i18n.language === item.value
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-black'
                              : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span className="px-1 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {item.code}
                            </span>
                            <span>{item.label}</span>
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark / Light Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm',
                  'bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700',
                  'text-slate-800 dark:text-slate-200 hover:scale-105 active:scale-95'
                )}
                aria-label="Toggle Theme"
              >
                {mode === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeTab === 0 && <NumberTest onClose={setActiveTab} />}
              {activeTab === 1 && <BallTest onClose={setActiveTab} />}
              {activeTab === 2 && <StoopTest onClose={setActiveTab} />}
              {activeTab === 3 && <MemoryGame />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
