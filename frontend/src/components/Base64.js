import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Lock, Check, ChevronDown, Key, RefreshCw, Eye, Link, Globe, Hash, HelpCircle } from 'lucide-react';
import { TextArea, Select } from './UI/Input';
import { ErrorMessage } from './UI/Message';
import api from '../services/api';

// Section Component (similar to Transform and Beautify tabs)
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

// Encode Item Component
const EncodeItem = ({ title, icon: Icon, children }) => (
  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] mb-4">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-primary-500" />}
      <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
    </div>
    {children}
  </div>
);

const Base64 = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('encoding');
  const [error, setError] = useState('');

  const sidebarItems = [
    {
      id: 'encoding',
      title: 'Encoding / Decoding',
      icon: Lock,
      description: 'Base64, URL, HTML entity, and Hex encoding/decoding'
    },
    {
      id: 'tokens',
      title: 'Token Utilities',
      icon: Eye,
      description: 'JWT decoder with header, payload, and signature inspection'
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
        <div className="card-modern p-3 space-y-2 sticky top-20">
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
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6 w-full max-w-none">
        <AnimatePresence mode="wait">
          {activeSidebarItem === 'encoding' && (
            <motion.div
              key="encoding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <Base64Section />
                <UrlSection />
                <HtmlSection />
                <HexSection />
              </div>
            </motion.div>
          )}

          {activeSidebarItem === 'tokens' && (
            <motion.div
              key="tokens"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <JwtSection />
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

// Base64 Section Component
const Base64Section = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState('encode');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization (operation-aware)
  const sampleInputEncode = 'Hello, World!';
  const sampleOutputEncode = 'SGVsbG8sIFdvcmxkIQ==';
  const sampleInputDecode = 'SGVsbG8sIFdvcmxkIQ==';
  const sampleOutputDecode = 'Hello, World!';
  
  const getSampleInput = () => {
    return operation === 'encode' ? sampleInputEncode : sampleInputDecode;
  };

  const getSampleOutput = () => {
    return operation === 'encode' ? sampleOutputEncode : sampleOutputDecode;
  };

  const handleProcess = async () => {
    const processInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!processInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(processInput);
    }
    setLoading(true);
    try {
      const result = operation === 'encode' 
        ? await api.base64Encode(processInput)
        : await api.base64Decode(processInput);
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

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Base64 Encoding/Decoding"
      icon={Lock}
      description="Encode text to Base64 or decode Base64 to text"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleProcess}
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
              'Process'
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
      <EncodeItem title="Base64" icon={Lock}>
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
                <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Base64 encoding converts binary data or text to ASCII characters</li>
                        <li>Base64 decoding converts Base64 strings back to original text</li>
                        <li>Uses characters A-Z, a-z, 0-9, +, /, and = for padding</li>
                        <li>Commonly used for encoding data in URLs, emails, and APIs</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-violet-200 dark:border-violet-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Encoding Text</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Plain Text):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            Hello, World!
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Base64 Encoded):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            SGVsbG8sIFdvcmxkIQ==
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-violet-200 dark:border-violet-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Decoding Base64</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Base64 String):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            SGVsbG8sIFdvcmxkIQ==
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Decoded Text):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            Hello, World!
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-violet-200 dark:border-violet-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Special Characters</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {"<script>alert('Hello');</script>"}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Base64):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            PHNjcmlwdD5hbGVydCgnSGVsbG8nKTs8L3NjcmlwdD4=
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-violet-100 dark:bg-violet-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Useful for embedding binary data in text-based formats (JSON, XML, URLs)</li>
                        <li>Increases data size by approximately 33%</li>
                        <li>Base64 strings may end with = or == for padding</li>
                        <li>Commonly used in data URIs, email attachments, and API authentication</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            options={[
              { value: 'encode', label: 'Encode' },
              { value: 'decode', label: 'Decode' }
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
              placeholder={operation === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={operation === 'encode' ? 'Base64 encoded result will appear here...' : 'Decoded text will appear here...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </EncodeItem>
    </Section>
  );
};

// URL Section Component
const UrlSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState('encode');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization (operation-aware)
  const sampleInputEncode = 'https://example.com/page?name=John Doe&age=30';
  const sampleOutputEncode = 'https%3A%2F%2Fexample.com%2Fpage%3Fname%3DJohn%20Doe%26age%3D30';
  const sampleInputDecode = 'https%3A%2F%2Fexample.com%2Fpage%3Fname%3DJohn%20Doe%26age%3D30';
  const sampleOutputDecode = 'https://example.com/page?name=John Doe&age=30';
  
  const getSampleInput = () => {
    return operation === 'encode' ? sampleInputEncode : sampleInputDecode;
  };

  const getSampleOutput = () => {
    return operation === 'encode' ? sampleOutputEncode : sampleOutputDecode;
  };

  const handleProcess = async () => {
    const processInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!processInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(processInput);
    }
    setLoading(true);
    try {
      const result = operation === 'encode' 
        ? await api.urlEncode(processInput)
        : await api.urlDecode(processInput);
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

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="URL Encoding/Decoding"
      icon={Link}
      description="Encode or decode URL-encoded strings"
      actions={
        <>
          <motion.button
            onClick={handleProcess}
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
              'Process'
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
      <EncodeItem title="URL" icon={Link}>
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
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>URL encoding converts special characters to percent-encoded format</li>
                        <li>URL decoding converts percent-encoded strings back to original characters</li>
                        <li>Also known as percent encoding (e.g., space becomes %20)</li>
                        <li>Ensures URLs are safe for transmission and storage</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Encoding URLs</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (URL with special characters):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            https://example.com/page?name=John Doe&age=30
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (URL Encoded):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            https%3A%2F%2Fexample.com%2Fpage%3Fname%3DJohn%20Doe%26age%3D30
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Decoding URLs</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Encoded URL):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            https%3A%2F%2Fexample.com%2Fpage%3Fname%3DJohn%20Doe%26age%3D30
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Decoded URL):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            https://example.com/page?name=John Doe&age=30
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Special Characters</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Common Encodings:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Space → %20
: → %3A
/ → %2F
? → %3F
= → %3D
& → %26
# → %23
@ → %40`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Essential for URLs with query parameters containing special characters</li>
                        <li>Prevents issues with spaces, ampersands, and other reserved characters</li>
                        <li>Useful for API calls and web forms</li>
                        <li>Also called percent encoding or URL percent encoding</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            options={[
              { value: 'encode', label: 'Encode' },
              { value: 'decode', label: 'Decode' }
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
              placeholder={operation === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={operation === 'encode' ? 'Encoded URL will appear here...' : 'Decoded URL will appear here...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </EncodeItem>
    </Section>
  );
};

// HTML Section Component
const HtmlSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState('encode');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization (operation-aware)
  const sampleInputEncode = '<div class="container">Hello & Welcome</div>';
  const sampleOutputEncode = '&lt;div class=&quot;container&quot;&gt;Hello &amp; Welcome&lt;/div&gt;';
  const sampleInputDecode = '&lt;div class=&quot;container&quot;&gt;Hello &amp; Welcome&lt;/div&gt;';
  const sampleOutputDecode = '<div class="container">Hello & Welcome</div>';
  
  const getSampleInput = () => {
    return operation === 'encode' ? sampleInputEncode : sampleInputDecode;
  };

  const getSampleOutput = () => {
    return operation === 'encode' ? sampleOutputEncode : sampleOutputDecode;
  };

  const handleProcess = async () => {
    const processInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!processInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(processInput);
    }
    setLoading(true);
    try {
      const result = operation === 'encode' 
        ? await api.htmlEncode(processInput)
        : await api.htmlDecode(processInput);
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

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="HTML Entity Encoding/Decoding"
      icon={Globe}
      description="Encode or decode HTML entities"
      actions={
        <>
          <motion.button
            onClick={handleProcess}
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
              'Process'
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
      <EncodeItem title="HTML Entity" icon={Globe}>
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
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>HTML encoding converts special characters to HTML entities</li>
                        <li>HTML decoding converts HTML entities back to original characters</li>
                        <li>Prevents HTML injection and ensures safe display in browsers</li>
                        <li>Commonly used in web forms and user-generated content</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-rose-200 dark:border-rose-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Encoding HTML</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (HTML with special characters):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {"<div class=\"container\">Hello & Welcome</div>"}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (HTML Encoded):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            &lt;div class=&quot;container&quot;&gt;Hello &amp; Welcome&lt;/div&gt;
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-rose-200 dark:border-rose-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Decoding HTML Entities</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Encoded HTML):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            &lt;div class=&quot;container&quot;&gt;Hello &amp; Welcome&lt;/div&gt;
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Decoded HTML):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {"<div class=\"container\">Hello & Welcome</div>"}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-rose-200 dark:border-rose-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Common HTML Entities</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Entity Reference Table:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`< → &lt; or &#60;
> → &gt; or &#62;
& → &amp; or &#38;
" → &quot; or &#34;
' → &#39; or &apos;
© → &copy; or &#169;
€ → &euro; or &#8364;`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-rose-100 dark:bg-rose-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Essential for preventing XSS (Cross-Site Scripting) attacks</li>
                        <li>Use when displaying user input in HTML to prevent script injection</li>
                        <li>Numeric entities (&#60;) and named entities (&lt;) are both supported</li>
                        <li>Commonly used in web forms, comments, and content management systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            options={[
              { value: 'encode', label: 'Encode' },
              { value: 'decode', label: 'Decode' }
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
              placeholder={operation === 'encode' ? 'Enter HTML content to encode...' : 'Enter HTML entities to decode...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={operation === 'encode' ? 'HTML encoded result will appear here...' : 'Decoded HTML will appear here...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </EncodeItem>
    </Section>
  );
};

// Hex Section Component
const HexSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState('encode');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization (operation-aware)
  const sampleInputEncode = 'Hello, World!';
  const sampleOutputEncode = '48656c6c6f2c20576f726c6421';
  const sampleInputDecode = '48656c6c6f2c20576f726c6421';
  const sampleOutputDecode = 'Hello, World!';
  
  const getSampleInput = () => {
    return operation === 'encode' ? sampleInputEncode : sampleInputDecode;
  };

  const getSampleOutput = () => {
    return operation === 'encode' ? sampleOutputEncode : sampleOutputDecode;
  };

  const handleProcess = async () => {
    const processInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!processInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(processInput);
    }
    setLoading(true);
    try {
      const result = operation === 'encode' 
        ? await api.hexEncode(processInput)
        : await api.hexDecode(processInput);
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

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Hex Encoding/Decoding"
      icon={Hash}
      description="Encode text to hexadecimal or decode hex to text"
      actions={
        <>
          <motion.button
            onClick={handleProcess}
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
              'Process'
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
      <EncodeItem title="Hex" icon={Hash}>
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
                <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Hexadecimal encoding converts text to hexadecimal (base-16) representation</li>
                        <li>Hexadecimal decoding converts hex strings back to original text</li>
                        <li>Each character is represented by two hexadecimal digits (0-9, A-F)</li>
                        <li>Commonly used in debugging, data analysis, and low-level programming</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Encoding Text</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Plain Text):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            Hello, World!
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Hexadecimal):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            48656c6c6f2c20576f726c6421
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Decoding Hex</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Hexadecimal String):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            48656c6c6f2c20576f726c6421
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Decoded Text):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            Hello, World!
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Character Encoding</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Common Encodings:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`'H' → 48
'e' → 65
'l' → 6c
'o' → 6f
' ' (space) → 20
'!' → 21`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-slate-100 dark:bg-slate-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Hexadecimal uses base-16 numbering (0-9, A-F)</li>
                        <li>Each byte is represented by exactly two hex digits</li>
                        <li>Useful for binary data representation and debugging</li>
                        <li>Common in memory dumps, network protocols, and file formats</li>
                        <li>Hex strings are case-insensitive (uppercase/lowercase both work)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            options={[
              { value: 'encode', label: 'Encode' },
              { value: 'decode', label: 'Decode' }
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
              placeholder={operation === 'encode' ? 'Enter text to encode to hex...' : 'Enter hex string to decode...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={operation === 'encode' ? 'Hexadecimal result will appear here...' : 'Decoded text will appear here...'}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </EncodeItem>
    </Section>
  );
};

// JWT Section Component
const JwtSection = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({ header: false, payload: false, signature: false });

  const handleDecode = async () => {
    if (!token.trim()) return;
    setLoading(true);
    try {
      const result = await api.jwtDecode(token);
      if (result.success && result.output) {
        const decoded = result.output;
        setHeader(decoded.headerParsed ? JSON.stringify(decoded.headerParsed, null, 2) : decoded.header || '');
        setPayload(decoded.payloadParsed ? JSON.stringify(decoded.payloadParsed, null, 2) : decoded.payload || '');
        setSignature(decoded.signature || '');
      } else {
        setHeader('');
        setPayload('');
        setSignature('');
        alert(result.error || 'JWT decoding failed');
      }
    } catch (err) {
      setHeader('');
      setPayload('');
      setSignature('');
      alert(err.message || 'JWT decoding failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, type) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
  };

  return (
    <Section
      title="JWT Decoder"
      icon={Eye}
      description="Decode JWT tokens with header, payload, and signature inspection"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleDecode}
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
                Decoding...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 inline mr-2" />
                Decode
              </>
            )}
          </motion.button>
          <motion.button
            onClick={() => { 
              setToken(''); 
              setHeader(''); 
              setPayload(''); 
              setSignature(''); 
            }}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <EncodeItem title="JWT Decoder" icon={Eye}>
        <div className="space-y-4">
          <TextArea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter JWT token to decode..."
            className="min-h-[100px]"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Header */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg">
                <h5 className="text-xs font-semibold text-[var(--text-primary)]">Header</h5>
                <motion.button
                  onClick={() => handleCopy(header, 'header')}
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy"
                >
                  {copied.header ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  )}
                </motion.button>
              </div>
              <TextArea
                value={header}
                readOnly
                placeholder="JWT header will appear here..."
                className="min-h-[200px]"
              />
            </div>

            {/* Payload */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg">
                <h5 className="text-xs font-semibold text-[var(--text-primary)]">Payload</h5>
                <motion.button
                  onClick={() => handleCopy(payload, 'payload')}
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy"
                >
                  {copied.payload ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  )}
                </motion.button>
              </div>
              <TextArea
                value={payload}
                readOnly
                placeholder="JWT payload will appear here..."
                className="min-h-[200px]"
              />
            </div>

            {/* Signature */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg">
                <h5 className="text-xs font-semibold text-[var(--text-primary)]">Signature</h5>
                <motion.button
                  onClick={() => handleCopy(signature, 'signature')}
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy"
                >
                  {copied.signature ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  )}
                </motion.button>
              </div>
              <TextArea
                value={signature}
                readOnly
                placeholder="JWT signature will appear here..."
                className="min-h-[200px]"
              />
            </div>
          </div>
        </div>
      </EncodeItem>
    </Section>
  );
};

export default Base64;
