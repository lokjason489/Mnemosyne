import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Brain, ChevronDown, Eye, Globe, Grid3X3, Hash, Moon, Palette, Sun } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BallTest, MemoryGame, NumberTest, StoopTest } from '../../components';
import { AdBanner } from '../../components/ui/AdBanner';
import { AnimatedTabs, type TabItem } from '../../components/ui/AnimatedTabs';
import { FloatingAmbientControl, GLOW_PRESETS } from '../../components/ui/FloatingAmbientControl';
import { cn } from '../../utils/cn';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  // 1. Dark / Light Mode with localStorage persistence
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mnemosyne_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('mnemosyne_theme', mode);
  }, [mode]);

  // 2. Ambient Glow Enabled with localStorage persistence
  const [glowEnabled, setGlowEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedGlow = localStorage.getItem('mnemosyne_glow_enabled');
      if (savedGlow !== null) return savedGlow === 'true';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('mnemosyne_glow_enabled', String(glowEnabled));
  }, [glowEnabled]);

  // 3. Ambient Glow Color ID with localStorage persistence
  const [glowColorId, setGlowColorId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedColor = localStorage.getItem('mnemosyne_glow_color');
      if (savedColor) return savedColor;
    }
    return 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('mnemosyne_glow_color', glowColorId);
  }, [glowColorId]);

  const activeGlowPreset = useMemo(
    () => GLOW_PRESETS.find((p) => p.id === glowColorId) || GLOW_PRESETS[0],
    [glowColorId]
  );

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

  // High-Contrast Linear MUI Theme
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#ffffff' : '#000000',
          },
          secondary: {
            main: mode === 'dark' ? '#d4d4d4' : '#525252',
          },
          background: {
            default: mode === 'dark' ? '#080b11' : '#f1f5f9',
            paper: mode === 'dark' ? '#0f141f' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#000000',
            secondary: mode === 'dark' ? '#d4d4d4' : '#525252',
          },
        },
        typography: {
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [mode]
  );

  // Prevent Google AdSense from setting destructive "min-height: 0px !important" on root elements
  useEffect(() => {
    const root = document.getElementById('root');
    const container = document.getElementById('app-container');

    const cleanInlineStyles = () => {
      if (root?.style.minHeight === '0px' || root?.style.height === 'auto') {
        root.style.removeProperty('min-height');
        root.style.removeProperty('height');
      }
      if (container?.style.minHeight === '0px' || container?.style.height === 'auto') {
        container.style.removeProperty('min-height');
        container.style.removeProperty('height');
      }
    };

    cleanInlineStyles();
    const observer = new MutationObserver(cleanInlineStyles);
    if (root) observer.observe(root, { attributes: true, attributeFilter: ['style'] });
    if (container) observer.observe(container, { attributes: true, attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, []);

  // Tab Definitions
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: 0,
        label: t('Number_short'),
        icon: <Hash className="w-3.5 h-3.5" />,
      },
      {
        id: 1,
        label: t('Ball_short'),
        icon: <Eye className="w-3.5 h-3.5" />,
      },
      {
        id: 2,
        label: t('StoopTest_short'),
        icon: <Palette className="w-3.5 h-3.5" />,
      },
      {
        id: 3,
        label: t('MemoryGame_short'),
        icon: <Grid3X3 className="w-3.5 h-3.5" />,
      },
    ],
    [t]
  );

  // Fast, Direct Mouse-Following Ambient Glow
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  const springConfig = { damping: 28, stiffness: 450, mass: 0.1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Exactly center the 640px glow circle on the pointer (offset by half dimension 320px)
  const glowX = useTransform(smoothMouseX, (val) => val - 320);
  const glowY = useTransform(smoothMouseY, (val) => val - 320);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div
        id="app-container"
        className={cn(
          'min-h-dvh w-full flex-1 flex flex-col justify-between font-sans transition-colors duration-200 relative selection:bg-indigo-500/20',
          mode === 'dark' ? 'bg-[#080b11] text-slate-100' : 'bg-[#f1f5f9] text-slate-950'
        )}
      >
        {/* Single Mouse-Following Ambient Glowing Light */}
        <AnimatePresence>
          {glowEnabled && (
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <motion.div
                style={{
                  x: glowX,
                  y: glowY,
                  background:
                    mode === 'dark'
                      ? activeGlowPreset.darkGradient
                      : activeGlowPreset.lightGradient,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-0 w-160 h-160 rounded-full blur-[80px] will-change-transform"
              />
            </div>
          )}
        </AnimatePresence>

        {/* Liquid Glass Header - Single Surface Layout */}
        <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5">
          <div
            className={cn(
              'max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 px-5 py-2.5 rounded-3xl relative',
              'liquid-glass-card shadow-lg'
            )}
          >
            {/* Specular top rim highlight */}
            <div className="absolute inset-x-8 top-0 h-[1.5px] bg-linear-to-r from-transparent via-white/80 dark:via-white/35 to-transparent pointer-events-none" />

            {/* Modern Logo */}
            <div className="flex items-center gap-3 select-none relative z-10">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 border border-white/20">
                <Brain className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                  Mnemosyne
                </span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 tracking-wider uppercase leading-none">
                  {t('cognitive_lab', 'Cognitive Lab')}
                </span>
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div className="w-full md:w-auto flex justify-center relative z-10">
              <AnimatedTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="w-full md:w-auto"
              />
            </div>

            {/* Actions: Clean Minimalist Controls on the Single Glass Surface */}
            <div className="flex items-center gap-1 relative z-10">
              {/* Language Picker Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen((prev) => !prev)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer',
                    'liquid-glass-border-only',
                    'text-slate-950 dark:text-slate-200 hover:bg-black/3 dark:hover:bg-white/5',
                    'transition-colors duration-150 outline-none'
                  )}
                  aria-label={t('change_language', 'Change Language')}
                >
                  <Globe className="w-3.5 h-3.5 text-slate-900 dark:text-slate-200" />
                  <span>{currentLangObj.code}</span>
                  <ChevronDown
                    className={cn(
                      'w-3 h-3 text-slate-700 dark:text-slate-400 transition-transform duration-150',
                      langOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="absolute! top-[calc(100%+8px)] right-0 w-36 rounded-2xl p-1.5 z-50 liquid-glass-dropdown shadow-2xl"
                    >
                      {languageList.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleLanguageSelect(item.value)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl',
                            'transition-colors duration-150 cursor-pointer font-bold',
                            i18n.language === item.value
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/10'
                          )}
                        >
                          <span>{item.label}</span>
                          <span className="text-[10px] font-mono opacity-75">{item.code}</span>
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
                  'p-2 rounded-xl cursor-pointer text-slate-950 dark:text-slate-200',
                  'liquid-glass-border-only',
                  'hover:bg-black/3 dark:hover:bg-white/5 transition-colors duration-150'
                )}
                aria-label={t('toggle_theme', 'Toggle Theme')}
              >
                {mode === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-950" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              {activeTab === 0 && <NumberTest onClose={setActiveTab} />}
              {activeTab === 1 && <BallTest onClose={setActiveTab} />}
              {activeTab === 2 && <StoopTest onClose={setActiveTab} />}
              {activeTab === 3 && <MemoryGame />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer Area with Google Ads Banner */}
        <footer className="relative z-10 w-full max-w-lg mx-auto px-4 pb-3 pt-1 flex flex-col items-center gap-1.5 select-none shrink-0">
          <AdBanner adClient="ca-pub-6995811232744511" className="w-full" />
          <div className="flex flex-col sm:flex-row items-center justify-between w-full text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1 gap-1">
            <span>© {new Date().getFullYear()} Mnemosyne Cognitive Lab</span>
            <span className="opacity-75">
              {t('cognitive_training', 'Cognitive & Memory Training')}
            </span>
          </div>
        </footer>

        {/* Floating Ambient Glow Control Button */}
        <FloatingAmbientControl
          enabled={glowEnabled}
          onToggle={() => setGlowEnabled((prev) => !prev)}
          selectedColorId={glowColorId}
          onSelectColor={setGlowColorId}
        />
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
