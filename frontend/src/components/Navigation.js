import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Lock, FolderOpen, Wrench, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Navigation.css';

const iconMap = {
  'converter': RefreshCw,
  'formatter': Sparkles,
  'base64': Lock,
  'files': FolderOpen,
  'utilities': Wrench,
};

const Navigation = ({ tabs, activeTab, onTabChange }) => {
  const { theme, toggleTheme } = useTheme();
  const ThemeIcon = theme === 'light' ? Moon : Sun;

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-[var(--border-color)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Brand */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer -ml-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 border border-primary-400/20">
                <RefreshCw className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-400 rounded-full border-2 border-[var(--bg-card)] shadow-sm"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-2xl font-bold gradient-text leading-tight">KonvertR</span>
              <span className="text-[10px] font-medium text-[var(--text-muted)] tracking-wide whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]">
                Enterprise Data Hygiene & Validation Engine
              </span>
            </div>
          </motion.div>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center pr-14 min-w-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = iconMap[tab.id];
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm
                    transition-all duration-200
                    ${isActive 
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = iconMap[tab.id];
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center justify-center p-2.5 rounded-xl text-sm
                    transition-all duration-200 min-w-[44px]
                    ${isActive 
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }
                  `}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          
          {/* Theme Toggle */}
          <div className="absolute right-0 inset-y-0 flex items-center">
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] 
                       hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]
                       transition-all duration-200"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <ThemeIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
