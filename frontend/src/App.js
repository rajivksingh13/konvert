import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Converter from './components/Converter';
import Formatter from './components/Formatter';
import Base64 from './components/Base64';
import Files from './components/Files';
import Utilities from './components/Utilities';
import './App.css';
import api from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('converter');
  const [trialStatus, setTrialStatus] = useState(null);

  const tabs = [
    { id: 'converter', label: 'Normalize & Transform', icon: '🔄' },
    { id: 'formatter', label: 'Standardize', icon: '✨' },
    { id: 'base64', label: 'Encode, Decode & Inspect', icon: '🔐' },
    { id: 'files', label: 'File Operations', icon: '📁' },
    { id: 'utilities', label: 'Governance Utilities', icon: '🛠️' }
  ];

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        // Trigger action based on active tab
        // This will be handled by individual components
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;
    api.getTrialStatus()
      .then((status) => {
        if (isMounted) setTrialStatus(status);
      })
      .catch(() => {
        if (isMounted) setTrialStatus(null);
      });
    return () => { isMounted = false; };
  }, []);

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'converter':
        return <Converter />;
      case 'formatter':
        return <Formatter />;
      case 'base64':
        return <Base64 />;
      case 'files':
        return <Files />;
      case 'utilities':
        return <Utilities />;
      default:
        return <Converter />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Navigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <main className="main-content">
          {renderActivePanel()}
        </main>
        {trialStatus && !trialStatus.valid && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="card-modern max-w-lg w-full p-6 text-center space-y-3">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Trial expired</h2>
              <p className="text-sm text-[var(--text-secondary)]">{trialStatus.message}</p>
              {trialStatus.extensionUrl ? (
                <button
                  className="btn-primary-modern px-5"
                  onClick={() => window.open(trialStatus.extensionUrl, '_blank', 'noopener,noreferrer')}
                >
                  Extend Trial
                </button>
              ) : trialStatus.supportEmail ? (
                <a
                  className="btn-primary-modern px-5 inline-flex justify-center"
                  href={`mailto:${trialStatus.supportEmail}?subject=KonvertR%20Trial%20Extension`}
                >
                  Request Extension
                </a>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">
                  Contact support to extend your trial period.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

