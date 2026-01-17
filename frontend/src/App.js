import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Converter from './components/Converter';
import Formatter from './components/Formatter';
import Base64 from './components/Base64';
import Files from './components/Files';
import Utilities from './components/Utilities';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('converter');

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
      </div>
    </ThemeProvider>
  );
}

export default App;

