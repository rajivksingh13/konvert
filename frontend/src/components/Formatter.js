import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Sparkles, Check, ChevronDown, Wand2, Minus, RefreshCw, HelpCircle } from 'lucide-react';
import { TextArea, Select } from './UI/Input';
import { ErrorMessage } from './UI/Message';
import api from '../services/api';

// Section Component (similar to Transform tab)
const Section = ({ title, icon: Icon, description, children, defaultExpanded = false, actions }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-modern overflow-hidden mb-4"
    >
      <div className="w-full flex items-center justify-between p-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 flex-1 hover:bg-[var(--bg-secondary)] transition-colors rounded-lg p-2 -m-2 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            {description && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>}
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {actions}
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-[var(--bg-secondary)] transition-colors rounded-lg -m-2"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
            </motion.div>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-[var(--border-color)]"
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Formatter Item Component
const FormatterItem = ({ title, icon: Icon, children }) => (
  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] mb-4">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-primary-500" />}
      <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
    </div>
    {children}
  </div>
);

const Formatter = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('formatters');
  const [error, setError] = useState('');

  const sidebarItems = [
    {
      id: 'formatters',
      title: 'Formatters',
      icon: Wand2,
      description: 'Standardize data presentation to ensure consistent readability and review'
    },
    {
      id: 'cleanup',
      title: 'Cleanup & Minification',
      icon: Minus,
      description: 'Reduce payload size and remove non-essential artifacts for production readiness'
    }
  ];

  return (
    <div className="full-width flex flex-col lg:flex-row gap-6 w-full max-w-full px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-5">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-72 xl:w-80 flex-shrink-0"
      >
        <div className="card-modern p-3 sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarItem === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSidebarItem(item.id)}
                className={`
                  relative w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-200 min-h-[90px]
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 border border-primary-500/30 dark:border-primary-500/30 shadow-sm'
                    : 'hover:bg-[var(--bg-secondary)] border border-transparent'
                  }
                `}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`
                  w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30'
                    : 'bg-[var(--bg-tertiary)]'
                  }
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[var(--text-secondary)]'}`} />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex flex-col gap-0.5 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-semibold leading-tight ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed line-clamp-3">{item.description}</p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
            })}
          </div>
          <div className="mt-auto pt-3 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] leading-relaxed">
            <p>© 2026 KonvertR All rights reserved</p>
            <p className="mt-2">Created and Developed by Rajiv_Kumar_f8dd89</p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6 w-full max-w-none">
        <AnimatePresence mode="wait">
          {activeSidebarItem === 'formatters' && (
            <motion.div
              key="formatters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
              <JsonFormatterSection />
              <YamlFormatterSection />
              <CsvFormatterSection />
              <ToonFormatterSection />
              </div>
            </motion.div>
          )}

          {activeSidebarItem === 'cleanup' && (
            <motion.div
              key="cleanup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <MinifySection />
                <RemoveCommentsSection />
                <CssBeautifySection />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ErrorMessage message={error} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// JSON Formatter Section
const JsonFormatterSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInput = '{"name":"John","age":30,"city":"New York","active":true,"tags":["developer","designer"],"address":{"street":"123 Main St","zip":"10001"}}';
  const sampleOutput = `{
  "name": "John",
  "age": 30,
  "city": "New York",
  "active": true,
  "tags": [
    "developer",
    "designer"
  ],
  "address": {
    "street": "123 Main St",
    "zip": "10001"
  }
}`;

  const handleFormat = async () => {
    const formatInput = !hasInteracted && !input ? sampleInput : input;
    if (!formatInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(formatInput);
    }
    setLoading(true);
    try {
      const result = await api.format(formatInput, 'JSON', false);
      setOutput(result.output);
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? sampleInput : input;
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="JSON Formatter"
      icon={Wand2}
      description="Standardize JSON structure and formatting for better readability"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleFormat}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 inline mr-2" />
                Format
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FormatterItem title="JSON Formatter" icon={Wand2}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Pretty-prints JSON with proper indentation and formatting</li>
                        <li>Makes JSON readable with consistent spacing and line breaks</li>
                        <li>Validates JSON syntax before formatting</li>
                        <li>Preserves all data while improving readability</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Minified JSON</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Minified):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"name":"John","age":30,"city":"New York"}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Formatted):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John",
  "age": 30,
  "city": "New York"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Nested Objects</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"user":{"name":"John","contact":{"email":"john@example.com","phone":"123-456-7890"}}}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "John",
    "contact": {
      "email": "john@example.com",
      "phone": "123-456-7890"
    }
  }
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Arrays</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"items":[1,2,3],"tags":["dev","design"],"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "items": [1, 2, 3],
  "tags": [
    "dev",
    "design"
  ],
  "users": [
    {"id": 1, "name": "John"},
    {"id": 2, "name": "Jane"}
  ]
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Useful for debugging and reading JSON files</li>
                        <li>Improves code readability and maintainability</li>
                        <li>Works with valid JSON only - invalid JSON will show an error</li>
                        <li>All data types are preserved (strings, numbers, booleans, null, objects, arrays)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder="Enter JSON data here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </FormatterItem>
    </Section>
  );
};

// YAML Formatter Section
const YamlFormatterSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInput = 'name: John\nage: 30\ncity: New York\nactive: true\ntags:\n  - developer\n  - designer\naddress:\n  street: "123 Main St"\n  zip: "10001"';
  const sampleOutput = `name: John
age: 30
city: New York
active: true
tags:
  - developer
  - designer
address:
  street: "123 Main St"
  zip: "10001"`;

  const handleFormat = async () => {
    const formatInput = !hasInteracted && !input ? sampleInput : input;
    if (!formatInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(formatInput);
    }
    setLoading(true);
    try {
      const result = await api.format(formatInput, 'YAML', false);
      setOutput(result.output);
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? sampleInput : input;
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="YAML Formatter"
      icon={Wand2}
      description="Standardize YAML structure and formatting for better readability"
      actions={
        <>
          <motion.button
            onClick={handleFormat}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 inline mr-2" />
                Format
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FormatterItem title="YAML Formatter" icon={Wand2}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Pretty-prints YAML with proper indentation and formatting</li>
                        <li>Improves readability with consistent spacing and structure</li>
                        <li>Validates YAML syntax before formatting</li>
                        <li>Preserves all data while making it more readable</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Simple YAML</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`name: John
age: 30
city: New York`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Formatted):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`name: John
age: 30
city: New York`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Nested Structure</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`user:
  name: John
  contact:
    email: john@example.com
    phone: "123-456-7890"`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`user:
  name: John
  contact:
    email: john@example.com
    phone: "123-456-7890"`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Arrays</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`items:
  - item1
  - item2
  - item3
users:
  - name: John
    id: 1
  - name: Jane
    id: 2`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`items:
  - item1
  - item2
  - item3
users:
  - name: John
    id: 1
  - name: Jane
    id: 2`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Useful for configuration files and data serialization</li>
                        <li>Improves readability and maintainability</li>
                        <li>Works with valid YAML only - invalid YAML will show an error</li>
                        <li>Maintains proper indentation and structure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder="Enter YAML data here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder="Formatted YAML will appear here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </FormatterItem>
    </Section>
  );
};

// CSV Formatter Section
const CsvFormatterSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [alignColumns, setAlignColumns] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInput = 'Name,Age,City,Active\nJohn,30,New York,true\nJane,25,Los Angeles,false\nBob,35,Chicago,true';
  const sampleOutput = `Name,Age,City,Active
John,30,New York,true
Jane,25,Los Angeles,false
Bob,35,Chicago,true`;

  const handleFormat = async () => {
    const formatInput = !hasInteracted && !input ? sampleInput : input;
    if (!formatInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(formatInput);
    }
    setLoading(true);
    try {
      const result = await api.format(formatInput, 'CSV', alignColumns);
      setOutput(result.output);
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? sampleInput : input;
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="CSV Formatter"
      icon={Wand2}
      description="Normalize CSV layout and alignment"
      actions={
        <>
          <motion.button
            onClick={handleFormat}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 inline mr-2" />
                Format
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FormatterItem title="CSV Formatter" icon={Wand2}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Formats CSV data with proper spacing and structure</li>
                        <li>Optional column alignment for better readability</li>
                        <li>Preserves all data while improving visual structure</li>
                        <li>Works with standard CSV format (comma-separated values)</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-green-200 dark:border-green-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Basic CSV</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Name,Age,City
John,30,New York
Jane,25,Los Angeles`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Formatted):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Name,Age,City
John,30,New York
Jane,25,Los Angeles`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-green-200 dark:border-green-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: With Column Alignment</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Product,Price,Stock
Laptop,999.99,50
Mouse,29.99,200
Keyboard,79.99,150`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (With Alignment):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Product ,Price  ,Stock
Laptop  ,999.99  ,50
Mouse   ,29.99   ,200
Keyboard,79.99   ,150`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-green-100 dark:bg-green-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Useful for organizing and viewing CSV data</li>
                        <li>Column alignment option improves readability for numeric data</li>
                        <li>Works with standard CSV format (comma-separated)</li>
                        <li>Preserves all data including headers and values</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={alignColumns}
              onChange={(e) => setAlignColumns(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-color)] text-primary-500 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            />
            <span className="text-sm text-[var(--text-secondary)]">
              Optional column alignment for better readability
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder="Enter CSV data here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder="Formatted CSV will appear here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </FormatterItem>
    </Section>
  );
};

// TOON Formatter Section
const ToonFormatterSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInput = 'name=John,age=30,city=New York,active=true,tags=developer|designer,address.street=123 Main St,address.zip=10001';
  const sampleOutput = `name=John
age=30
city=New York
active=true
tags=developer|designer
address.street=123 Main St
address.zip=10001`;

  const handleFormat = async () => {
    const formatInput = !hasInteracted && !input ? sampleInput : input;
    if (!formatInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(formatInput);
    }
    setLoading(true);
    try {
      const result = await api.format(formatInput, 'TOON', delimiter);
      setOutput(result.output);
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? sampleInput : input;
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="TOON Formatter"
      icon={Sparkles}
      description="Standardize TOON encoding and delimiters (comma, tab, pipe)"
      actions={
        <>
          <motion.button
            onClick={handleFormat}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 inline mr-2" />
                Format
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FormatterItem title="TOON Formatting" icon={Sparkles}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Formats TOON (TOken-Object Notation) data with proper structure</li>
                        <li>Supports custom delimiters: comma, tab, or pipe</li>
                        <li>Converts compact TOON format to readable multi-line format</li>
                        <li>Preserves all data while improving readability</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-cyan-200 dark:border-cyan-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Comma Delimiter</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Comma-separated):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`name=John,age=30,city=New York,active=true`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Formatted):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`name=John
age=30
city=New York
active=true`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cyan-200 dark:border-cyan-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Nested Structure</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`name=John,address.street=123 Main St,address.zip=10001,contact.email=john@example.com`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`name=John
address.street=123 Main St
address.zip=10001
contact.email=john@example.com`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cyan-200 dark:border-cyan-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Tab Delimiter</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Tab-separated):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`name=John\tage=30\tcity=New York`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`name=John
age=30
city=New York`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-cyan-100 dark:bg-cyan-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Comma (,) - Most common, best for general use</li>
                        <li>Tab - Useful for copy-paste from spreadsheets</li>
                        <li>Pipe (|) - Good for avoiding conflicts with data content</li>
                        <li>Select the delimiter that matches your TOON data format</li>
                        <li>Nested keys use dot notation (e.g., address.street)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            options={[
              { value: ',', label: 'Comma (,)' },
              { value: '\t', label: 'Tab' },
              { value: '|', label: 'Pipe (|)' }
            ]}
            className="input-modern w-auto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder="Enter TOON data to format..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder="Formatted TOON will appear here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </FormatterItem>
    </Section>
  );
};

// Minify Section
const MinifySection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization (format-aware)
  const sampleInputJSON = `{
  "name": "John",
  "age": 30,
  "city": "New York",
  "active": true,
  "tags": [
    "developer",
    "designer"
  ],
  "address": {
    "street": "123 Main St",
    "zip": "10001"
  }
}`;
  const sampleOutputJSON = '{"name":"John","age":30,"city":"New York","active":true,"tags":["developer","designer"],"address":{"street":"123 Main St","zip":"10001"}}';
  
  const sampleInputYAML = `name: John
age: 30
city: New York
active: true
tags:
  - developer
  - designer
address:
  street: "123 Main St"
  zip: "10001"`;
  const sampleOutputYAML = 'name: John\nage: 30\ncity: New York\nactive: true\ntags:\n  - developer\n  - designer\naddress:\n  street: "123 Main St"\n  zip: "10001"';
  
  const sampleInputCSS = `.header {
  background-color: #ffffff;
  color: #333333;
  padding: 20px;
}

.content {
  font-size: 16px;
  line-height: 1.5;
}`;
  const sampleOutputCSS = '.header{background-color:#fff;color:#333;padding:20px}.content{font-size:16px;line-height:1.5}';
  
  const sampleInputXML = `<root>
  <user>
    <name>John</name>
    <age>30</age>
    <city>New York</city>
  </user>
</root>`;
  const sampleOutputXML = '<root><user><name>John</name><age>30</age><city>New York</city></user></root>';
  
  const getSampleInput = () => {
    switch (format) {
      case 'json': return sampleInputJSON;
      case 'yaml': return sampleInputYAML;
      case 'css': return sampleInputCSS;
      case 'xml': return sampleInputXML;
      default: return sampleInputJSON;
    }
  };

  const getSampleOutput = () => {
    switch (format) {
      case 'json': return sampleOutputJSON;
      case 'yaml': return sampleOutputYAML;
      case 'css': return sampleOutputCSS;
      case 'xml': return sampleOutputXML;
      default: return sampleOutputJSON;
    }
  };

  const handleMinify = async () => {
    const minifyInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!minifyInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(minifyInput);
    }
    setLoading(true);
    try {
      const result = await api.minify(minifyInput, format);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Minify"
      icon={Minus}
      description="Minimize payload size while preserving semantic integrity"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleMinify}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              'Minify'
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FormatterItem title="Minify" icon={Minus}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Removes all unnecessary whitespace and formatting</li>
                        <li>Reduces file size for faster loading and transfer</li>
                        <li>Preserves all data while removing readability formatting</li>
                        <li>Supports JSON, YAML, XML, CSS, and TOON formats</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: JSON Minification</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Formatted JSON):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John",
  "age": 30,
  "city": "New York"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Minified JSON):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"name":"John","age":30,"city":"New York"}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: CSS Minification</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Formatted CSS):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`.header {
  background-color: #ffffff;
  padding: 20px;
}

.content {
  font-size: 16px;
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Minified CSS):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`.header{background-color:#fff;padding:20px}.content{font-size:16px}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: XML Minification</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Formatted XML):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`<root>
  <user>
    <name>John</name>
    <age>30</age>
  </user>
</root>`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Minified XML):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`<root><user><name>John</name><age>30</age></user></root>`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-orange-100 dark:bg-orange-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Useful for production builds to reduce file sizes</li>
                        <li>Significantly reduces file size (often 50-70% reduction)</li>
                        <li>Improves loading times and bandwidth usage</li>
                        <li>Select the correct format (JSON, YAML, XML, CSS, TOON) for accurate minification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { value: 'json', label: 'JSON' },
              { value: 'yaml', label: 'YAML' },
              { value: 'xml', label: 'XML' },
              { value: 'css', label: 'CSS' },
              { value: 'toon', label: 'TOON' }
            ]}
            className="input-modern w-auto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder={`Enter ${format.toUpperCase()} data to minify...`}
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`Minified ${format.toUpperCase()} will appear here...`}
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </FormatterItem>
    </Section>
  );
};

// Remove Comments Section
const RemoveCommentsSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization (format-aware with comments)
  const sampleInputJSON = `{
  // This is a comment
  "name": "John",
  "age": 30,
  /* Multi-line comment
     about the city */
  "city": "New York",
  "active": true
}`;
  const sampleOutputJSON = `{
  "name": "John",
  "age": 30,
  "city": "New York",
  "active": true
}`;
  
  const sampleInputYAML = `# This is a comment
name: John
age: 30
# Another comment
city: New York
active: true`;
  const sampleOutputYAML = `name: John
age: 30
city: New York
active: true`;
  
  const sampleInputCSS = `/* This is a CSS comment */
.header {
  background-color: #ffffff; /* inline comment */
  color: #333333;
  padding: 20px;
}

/* Another comment */
.content {
  font-size: 16px;
}`;
  const sampleOutputCSS = `.header {
  background-color: #ffffff;
  color: #333333;
  padding: 20px;
}

.content {
  font-size: 16px;
}`;
  
  const sampleInputXML = `<?xml version="1.0"?>
<!-- This is an XML comment -->
<root>
  <user>
    <name>John</name>
    <!-- Another comment -->
    <age>30</age>
  </user>
</root>`;
  const sampleOutputXML = `<?xml version="1.0"?>
<root>
  <user>
    <name>John</name>
    <age>30</age>
  </user>
</root>`;
  
  const getSampleInput = () => {
    switch (format) {
      case 'json': return sampleInputJSON;
      case 'yaml': return sampleInputYAML;
      case 'css': return sampleInputCSS;
      case 'xml': return sampleInputXML;
      default: return sampleInputJSON;
    }
  };

  const getSampleOutput = () => {
    switch (format) {
      case 'json': return sampleOutputJSON;
      case 'yaml': return sampleOutputYAML;
      case 'css': return sampleOutputCSS;
      case 'xml': return sampleOutputXML;
      default: return sampleOutputJSON;
    }
  };

  const handleRemoveComments = async () => {
    const removeInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!removeInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(removeInput);
    }
    setLoading(true);
    try {
      const result = await api.removeComments(removeInput, format);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Remove Comments & Extra Whitespace"
      icon={Minus}
      description="Remove non-functional elements to enforce clean artifacts"
      actions={
        <>
          <motion.button
            onClick={handleRemoveComments}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              'Remove'
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FormatterItem title="Remove Comments" icon={Minus}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Removes all comments and extra whitespace from files</li>
                        <li>Preserves all functional code while cleaning up documentation</li>
                        <li>Reduces file size by removing non-functional content</li>
                        <li>Supports JSON, YAML, XML, CSS, and TOON formats</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-pink-200 dark:border-pink-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: JSON Comments</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (JSON with comments):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  // This is a comment
  "name": "John",
  /* Multi-line comment */
  "age": 30
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Comments removed):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John",
  "age": 30
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-pink-200 dark:border-pink-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: YAML Comments</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (YAML with comments):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`# This is a comment
name: John
age: 30
# Another comment
city: New York`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Comments removed):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`name: John
age: 30
city: New York`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-pink-200 dark:border-pink-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: CSS Comments</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (CSS with comments):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`/* CSS comment */
.header {
  color: #333; /* inline comment */
  padding: 20px;
}

/* Another comment */
.content {
  font-size: 16px;
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Comments removed):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`.header {
  color: #333;
  padding: 20px;
}

.content {
  font-size: 16px;
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-pink-200 dark:border-pink-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 4: XML Comments</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (XML with comments):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`<?xml version="1.0"?>
<!-- XML comment -->
<root>
  <user>
    <!-- Another comment -->
    <name>John</name>
    <age>30</age>
  </user>
</root>`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Comments removed):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`<?xml version="1.0"?>
<root>
  <user>
    <name>John</name>
    <age>30</age>
  </user>
</root>`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-pink-100 dark:bg-pink-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>JSON: Removes // single-line and /* */ multi-line comments</li>
                        <li>YAML: Removes # comments (both inline and block)</li>
                        <li>CSS: Removes /* */ comments (both block and inline)</li>
                        <li>XML: Removes <code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">{`<!-- -->`}</code> comments</li>
                        <li>Useful for preparing files for production deployment</li>
                        <li>Select the correct format for accurate comment removal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { value: 'json', label: 'JSON' },
              { value: 'yaml', label: 'YAML' },
              { value: 'xml', label: 'XML' },
              { value: 'css', label: 'CSS' },
              { value: 'toon', label: 'TOON' }
            ]}
            className="input-modern w-auto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder={`Enter ${format.toUpperCase()} data with comments...`}
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`Cleaned ${format.toUpperCase()} will appear here...`}
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </FormatterItem>
    </Section>
  );
};

// CSS Beautify Section
const CssBeautifySection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInput = '.header{background-color:#fff;color:#333;padding:20px;margin:0}.content{font-size:16px;line-height:1.5;padding:10px}.footer{text-align:center;color:#666}';
  const sampleOutput = `.header {
  background-color: #fff;
  color: #333;
  padding: 20px;
  margin: 0;
}

.content {
  font-size: 16px;
  line-height: 1.5;
  padding: 10px;
}

.footer {
  text-align: center;
  color: #666;
}`;

  const handleBeautify = async () => {
    const beautifyInput = !hasInteracted && !input ? sampleInput : input;
    if (!beautifyInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(beautifyInput);
    }
    setLoading(true);
    try {
      const result = await api.beautifyCss(beautifyInput);
      setOutput(result.success ? result.output : 'Error: ' + (result.error || 'Unknown error'));
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? sampleInput : input;
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="CSS Beautify"
      icon={Minus}
      description="Standardize CSS formatting for maintainability"
      actions={
        <>
          <motion.button
            onClick={handleBeautify}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 inline mr-2" />
                Beautify
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FormatterItem title="CSS Beautify" icon={Minus}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Formats CSS with proper indentation and spacing</li>
                        <li>Organizes CSS rules for better readability</li>
                        <li>Preserves all CSS functionality while improving structure</li>
                        <li>Makes CSS easier to read, debug, and maintain</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-teal-200 dark:border-teal-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Minified CSS</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Minified CSS):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`.header{background-color:#fff;color:#333;padding:20px}.content{font-size:16px;line-height:1.5}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Beautified CSS):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`.header {
  background-color: #fff;
  color: #333;
  padding: 20px;
}

.content {
  font-size: 16px;
  line-height: 1.5;
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-teal-200 dark:border-teal-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Compact CSS</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`.nav{display:flex;justify-content:space-between;align-items:center}.nav-item{margin:0 10px;padding:5px}.nav-link{text-decoration:none;color:#333}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-item {
  margin: 0 10px;
  padding: 5px;
}

.nav-link {
  text-decoration: none;
  color: #333;
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-teal-200 dark:border-teal-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Nested Rules</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`.container{width:100%;max-width:1200px}.container .header{background:#fff}.container .content{padding:20px}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`.container {
  width: 100%;
  max-width: 1200px;
}

.container .header {
  background: #fff;
}

.container .content {
  padding: 20px;
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-teal-100 dark:bg-teal-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Useful for formatting minified or compact CSS files</li>
                        <li>Improves readability and makes CSS easier to debug</li>
                        <li>Organizes CSS rules with proper indentation</li>
                        <li>Helps maintain consistent coding style</li>
                        <li>Preserves all CSS functionality including selectors, properties, and values</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder="Enter CSS here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder="Beautified CSS will appear here..."
              className={`min-h-[250px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </FormatterItem>
    </Section>
  );
};

export default Formatter;
